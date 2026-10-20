import hashlib

from sqlalchemy.orm import Session, selectinload

from app.db.session import SessionLocal
from app.models.app import App
from app.models.file import FileType
from app.models.route import Route
from app.models.route_version import RouteVersion


def _bucket(visitor_id: str, route_link: str, total: int) -> int:
    digest = hashlib.sha256(f"{visitor_id}:{route_link}".encode()).hexdigest()
    return int(digest, 16) % total


def pick_version(visitor_id: str, route: Route):
    active_versions = sorted(
        (version for version in route.versions if version.apps),
        key=lambda version: version.id,
    )
    total = sum(version.percentage for version in active_versions)
    if total <= 0:
        return active_versions[0] if active_versions else None

    bucket = _bucket(visitor_id, route.link, total)
    cumulative = 0
    for version in active_versions:
        cumulative += version.percentage
        if bucket < cumulative:
            return version
    return active_versions[-1]


def _serialize_app(app) -> dict:
    files = sorted(app.files, key=lambda file: file.id)
    return {
        "name": app.name,
        "position": app.position,
        "css": [file.link for file in files if file.type == FileType.CSS.value],
        "js": [file.link for file in files if file.type == FileType.JS.value],
    }


def _pick_version_id(visitor_id: str, route: dict):
    versions = route["versions"]
    if not versions:
        return None
    total = sum(version["percentage"] for version in versions)
    if total <= 0:
        return versions[0]["id"]

    bucket = _bucket(visitor_id, route["link"], total)
    cumulative = 0
    for version in versions:
        cumulative += version["percentage"]
        if bucket < cumulative:
            return version["id"]
    return versions[-1]["id"]


class Snapshot:
    def __init__(self, routes: list[dict]):
        self.routes = routes
        self._view_cache: dict[tuple, dict] = {}

    def view_for(self, visitor_id: str) -> dict:
        picks = [
            (route, _pick_version_id(visitor_id, route)) for route in self.routes
        ]
        signature = tuple(version_id for _, version_id in picks)
        cached = self._view_cache.get(signature)
        if cached is not None:
            return cached

        view = {
            route["id"]: route["views"][version_id]
            for route, version_id in picks
            if version_id is not None
        }
        self._view_cache[signature] = view
        return view


def build_snapshot(db: Session) -> Snapshot:
    query = (
        db.query(Route)
        .options(
            selectinload(Route.versions)
            .selectinload(RouteVersion.apps)
            .selectinload(App.files)
        )
        .order_by(Route.id)
    )

    routes = []
    for route in query:
        versions = []
        views = {}
        for version in sorted(route.versions, key=lambda version: version.id):
            if not version.apps:
                continue
            apps = sorted(version.apps, key=lambda app: app.id)
            versions.append({"id": version.id, "percentage": version.percentage})
            views[version.id] = {
                "id": route.id,
                "link": route.link,
                "name": route.name,
                "apps": [_serialize_app(app) for app in apps],
            }
        routes.append(
            {
                "id": route.id,
                "link": route.link,
                "versions": versions,
                "views": views,
            }
        )
    return Snapshot(routes)


def current_snapshot() -> Snapshot:
    db = SessionLocal()
    try:
        return build_snapshot(db)
    finally:
        db.close()


def _app_names(route: dict) -> list:
    return [app["name"] for app in route["apps"]]


def _apps_by_name(route: dict) -> dict:
    return {app["name"]: app for app in route["apps"]}


def diff_views(old_view: dict, new_view: dict) -> list:
    changes = []
    for route_id, route in new_view.items():
        if route_id not in old_view:
            changes.append({"type": "added", "route": route})
            continue

        old_route = old_view[route_id]

        route_changed = (
            old_route["link"] != route["link"]
            or old_route["name"] != route["name"]
            or _app_names(old_route) != _app_names(route)
        )
        if route_changed:
            changes.append({"type": "modified", "route": route})
            continue

        old_apps = _apps_by_name(old_route)
        for app in route["apps"]:
            if old_apps[app["name"]] != app:
                changes.append({"type": "app_modified", "route": route, "app": app})

    for route_id, route in old_view.items():
        if route_id not in new_view:
            changes.append({"type": "removed", "route": route})
    return changes
