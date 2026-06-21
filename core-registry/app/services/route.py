from sqlalchemy.orm import Session

from app.models.route import Route
from app.schemas.route import RouteCreate, RouteUpdate


def get_routes(db: Session) -> list[Route]:
    return db.query(Route).all()


def get_route(db: Session, route_id: int) -> Route | None:
    return db.query(Route).filter(Route.id == route_id).first()


def create_route(db: Session, data: RouteCreate) -> Route:
    route = Route(link=data.link, name=data.name)
    db.add(route)
    db.commit()
    db.refresh(route)
    return route


def update_route(db: Session, route: Route, data: RouteUpdate) -> Route:
    route.link = data.link
    route.name = data.name
    db.commit()
    db.refresh(route)
    return route


def delete_route(db: Session, route: Route) -> None:
    db.delete(route)
    db.commit()
