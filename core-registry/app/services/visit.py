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
            RouteVersion.id,
            RouteVersion.name,
            RouteVersion.percentage,
            Visit.client_cookie,
            func.count(Visit.id).label("count"),
        )
        .outerjoin(Visit, Visit.route_version_id == RouteVersion.id)
        .filter(RouteVersion.route_id == route.id)
        .group_by(
            RouteVersion.id,
            RouteVersion.name,
            RouteVersion.percentage,
            Visit.client_cookie,
        )
        .order_by(RouteVersion.id)
        .all()
    )

    versions = {}
    for version_id, name, percentage, client_cookie, count in rows:
        version = versions.get(version_id)
        if version is None:
            version = {
                "route_version_id": version_id,
                "name": name,
                "percentage": percentage,
                "visits": [],
            }
            versions[version_id] = version
        if client_cookie is not None:
            version["visits"].append(
                {"client_cookie": client_cookie, "count": count}
            )

    return {"route_id": route.id, "versions": list(versions.values())}
