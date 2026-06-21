import hashlib

from sqlalchemy.orm import Session

from app.models.file import FileType
from app.models.route import Route


def _bucket(visitor_id: str, route_link: str, total: int) -> int:
    digest = hashlib.sha256(f"{visitor_id}:{route_link}".encode()).hexdigest()
    return int(digest, 16) % total


def pick_version(visitor_id: str, route: Route):
    versions = sorted(route.versions, key=lambda version: version.id)
    total = sum(version.percentage for version in versions)
    if total <= 0:
        return versions[0] if versions else None

    # Walk the versions until the visitor's bucket falls inside one's share.
    bucket = _bucket(visitor_id, route.link, total)
    cumulative = 0
    for version in versions:
        cumulative += version.percentage
        if bucket < cumulative:
            return version
    return versions[-1]


def _serialize_app(app) -> dict:
    return {
        "name": app.name,
        "position": app.position,
        "css": [file.link for file in app.files if file.type == FileType.CSS.value],
        "js": [file.link for file in app.files if file.type == FileType.JS.value],
    }


def build_snapshot(db: Session, visitor_id: str) -> dict:
    routes = []
    for route in db.query(Route).all():
        version = pick_version(visitor_id, route)
        routes.append({
            "link": route.link,
            "name": route.name,
            "apps": [_serialize_app(app) for app in version.apps] if version else [],
        })
    return {"routes": routes}
