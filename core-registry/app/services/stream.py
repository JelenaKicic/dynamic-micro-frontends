import hashlib

from sqlalchemy.orm import Session

from app.models.file import FileType
from app.models.route import Route

CHANGEABLE_FIELDS = ("link", "name", "apps")


def _bucket(visitor_id: str, route_link: str, total: int) -> int:
    digest = hashlib.sha256(f"{visitor_id}:{route_link}".encode()).hexdigest()
    return int(digest, 16) % total


def pick_version(visitor_id: str, route: Route):
    # Only versions that actually have apps are visible, so an empty version
    # never affects what a visitor sees until its first app is added
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


def build_view(db: Session, visitor_id: str) -> dict:
    view = {}
    for route in db.query(Route).all():
        version = pick_version(visitor_id, route)
        if version is None:
            continue
        apps = sorted(version.apps, key=lambda app: app.id)
        view[route.id] = {
            "id": route.id,
            "link": route.link,
            "name": route.name,
            "apps": [_serialize_app(app) for app in apps],
        }
    return view


def _changed_fields(old_route: dict, new_route: dict) -> list:
    return [field for field in CHANGEABLE_FIELDS if old_route[field] != new_route[field]]


def diff_views(old_view: dict, new_view: dict) -> list:
    changes = []
    for route_id, route in new_view.items():
        if route_id not in old_view:
            changes.append({"type": "added", "route": route})
        else:
            changed = _changed_fields(old_view[route_id], route)
            if changed:
                changes.append({"type": "modified", "route": route, "changed": changed})
    for route_id, route in old_view.items():
        if route_id not in new_view:
            changes.append({"type": "removed", "route": route})
    return changes
