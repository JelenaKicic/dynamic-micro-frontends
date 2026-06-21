from sqlalchemy.orm import Session

from app.models.route_version import RouteVersion
from app.schemas.route_version import RouteVersionCreate, RouteVersionUpdate


def get_route_versions(db: Session) -> list[RouteVersion]:
    return db.query(RouteVersion).all()


def get_route_version(db: Session, route_version_id: int) -> RouteVersion | None:
    return (
        db.query(RouteVersion)
        .filter(RouteVersion.id == route_version_id)
        .first()
    )


def create_route_version(
    db: Session, data: RouteVersionCreate
) -> RouteVersion:
    route_version = RouteVersion(
        route_id=data.route_id, name=data.name, percentage=data.percentage
    )
    db.add(route_version)
    db.commit()
    db.refresh(route_version)
    return route_version


def update_route_version(
    db: Session, route_version: RouteVersion, data: RouteVersionUpdate
) -> RouteVersion:
    route_version.route_id = data.route_id
    route_version.name = data.name
    route_version.percentage = data.percentage
    db.commit()
    db.refresh(route_version)
    return route_version


def delete_route_version(db: Session, route_version: RouteVersion) -> None:
    db.delete(route_version)
    db.commit()
