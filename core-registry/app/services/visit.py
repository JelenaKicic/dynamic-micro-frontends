from datetime import datetime, timezone

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.route import Route
from app.models.route_version import RouteVersion
from app.models.visit import Visit


def create_visit(db: Session, route_version_id: int, client_cookie: str) -> Visit:
    visit = Visit(
        route_version_id=route_version_id,
        client_cookie=client_cookie,
        time=datetime.now(timezone.utc),
    )
    db.add(visit)
    db.commit()
    db.refresh(visit)
    return visit


def get_route_statistics(db: Session, route: Route) -> dict:
    rows = (
        db.query(
            Visit.route_version_id,
            Visit.client_cookie,
            func.count(Visit.id).label("count"),
        )
        .join(RouteVersion, Visit.route_version_id == RouteVersion.id)
        .filter(RouteVersion.route_id == route.id)
        .group_by(Visit.route_version_id, Visit.client_cookie)
        .all()
    )

    counts = {}
    for route_version_id, client_cookie, count in rows:
        counts.setdefault(route_version_id, []).append(
            {"client_cookie": client_cookie, "count": count}
        )

    versions = []
    for version in sorted(route.versions, key=lambda version: version.id):
        versions.append(
            {
                "route_version_id": version.id,
                "name": version.name,
                "percentage": version.percentage,
                "visits": counts.get(version.id, []),
            }
        )

    return {"route_id": route.id, "versions": versions}
