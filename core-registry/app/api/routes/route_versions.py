from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.route_version import (
    RouteVersionCreate,
    RouteVersionRead,
    RouteVersionUpdate,
)
from app.services import route_version as route_version_service

router = APIRouter(prefix="/route-versions", tags=["route-versions"])


@router.post(
    "/", response_model=RouteVersionRead, status_code=status.HTTP_201_CREATED
)
def create_route_version(
    data: RouteVersionCreate, db: Session = Depends(get_db)
):
    return route_version_service.create_route_version(db, data)


@router.get("/", response_model=list[RouteVersionRead])
def read_route_versions(db: Session = Depends(get_db)):
    return route_version_service.get_route_versions(db)


@router.get("/{route_version_id}", response_model=RouteVersionRead)
def read_route_version(
    route_version_id: int, db: Session = Depends(get_db)
):
    route_version = route_version_service.get_route_version(
        db, route_version_id
    )
    if route_version is None:
        raise HTTPException(
            status_code=404, detail="Route version not found"
        )
    return route_version


@router.put("/{route_version_id}", response_model=RouteVersionRead)
def update_route_version(
    route_version_id: int,
    data: RouteVersionUpdate,
    db: Session = Depends(get_db),
):
    route_version = route_version_service.get_route_version(
        db, route_version_id
    )
    if route_version is None:
        raise HTTPException(
            status_code=404, detail="Route version not found"
        )
    return route_version_service.update_route_version(
        db, route_version, data
    )


@router.delete(
    "/{route_version_id}", status_code=status.HTTP_204_NO_CONTENT
)
def delete_route_version(
    route_version_id: int, db: Session = Depends(get_db)
):
    route_version = route_version_service.get_route_version(
        db, route_version_id
    )
    if route_version is None:
        raise HTTPException(
            status_code=404, detail="Route version not found"
        )
    route_version_service.delete_route_version(db, route_version)
