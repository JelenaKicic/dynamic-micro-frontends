from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.route import RouteCreate, RouteRead, RouteUpdate
from app.services import route as route_service
from app.services.broker import broker

router = APIRouter(prefix="/routes", tags=["routes"])


@router.post("/", response_model=RouteRead, status_code=status.HTTP_201_CREATED)
def create_route(data: RouteCreate, db: Session = Depends(get_db)):
    route = route_service.create_route(db, data)
    broker.publish()
    return route


@router.get("/", response_model=list[RouteRead])
def read_routes(db: Session = Depends(get_db)):
    return route_service.get_routes(db)


@router.get("/{route_id}", response_model=RouteRead)
def read_route(route_id: int, db: Session = Depends(get_db)):
    route = route_service.get_route(db, route_id)
    if route is None:
        raise HTTPException(status_code=404, detail="Route not found")
    return route


@router.put("/{route_id}", response_model=RouteRead)
def update_route(
    route_id: int, data: RouteUpdate, db: Session = Depends(get_db)
):
    route = route_service.get_route(db, route_id)
    if route is None:
        raise HTTPException(status_code=404, detail="Route not found")
    updated = route_service.update_route(db, route, data)
    broker.publish()
    return updated


@router.delete("/{route_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_route(route_id: int, db: Session = Depends(get_db)):
    route = route_service.get_route(db, route_id)
    if route is None:
        raise HTTPException(status_code=404, detail="Route not found")
    route_service.delete_route(db, route)
    broker.publish()
