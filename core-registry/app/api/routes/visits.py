from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.route import Route
from app.schemas.visit import RouteStatistics, VisitCreate, VisitRead
from app.services import route as route_service
from app.services import visit as visit_service
from app.services.stream import pick_version

router = APIRouter(tags=["visits"])

AB_COOKIE_NAME = "ab_id"
COOKIE_MAX_AGE = 60 * 60 * 24 * 365


@router.post("/visits", response_model=VisitRead, status_code=status.HTTP_201_CREATED)
def create_visit(
    data: VisitCreate,
    request: Request,
    response: Response,
    db: Session = Depends(get_db),
):
    visitor_id = request.cookies.get(AB_COOKIE_NAME)
    if visitor_id is None:
        visitor_id = uuid4().hex
        response.set_cookie(
            AB_COOKIE_NAME,
            visitor_id,
            max_age=COOKIE_MAX_AGE,
            httponly=True,
            samesite="lax",
        )

    route = db.query(Route).filter(Route.link == data.link).first()
    if route is None:
        raise HTTPException(status_code=404, detail="Route not found")

    version = pick_version(visitor_id, route)
    if version is None:
        raise HTTPException(status_code=400, detail="Route has no active version")

    return visit_service.create_visit(db, version.id, visitor_id)


@router.get("/route-statistics/{route_id}", response_model=RouteStatistics)
def route_statistics(route_id: int, db: Session = Depends(get_db)):
    route = route_service.get_route(db, route_id)
    if route is None:
        raise HTTPException(status_code=404, detail="Route not found")

    return visit_service.get_route_statistics(db, route)
