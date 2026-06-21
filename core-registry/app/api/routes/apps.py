from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.app import AppCreate, AppRead, AppUpdate
from app.services import app as app_service

router = APIRouter(prefix="/apps", tags=["apps"])


@router.post("/", response_model=AppRead, status_code=status.HTTP_201_CREATED)
def create_app(data: AppCreate, db: Session = Depends(get_db)):
    return app_service.create_app(db, data)


@router.get("/", response_model=list[AppRead])
def read_apps(db: Session = Depends(get_db)):
    return app_service.get_apps(db)


@router.get("/{app_id}", response_model=AppRead)
def read_app(app_id: int, db: Session = Depends(get_db)):
    app = app_service.get_app(db, app_id)
    if app is None:
        raise HTTPException(status_code=404, detail="App not found")
    return app


@router.put("/{app_id}", response_model=AppRead)
def update_app(app_id: int, data: AppUpdate, db: Session = Depends(get_db)):
    app = app_service.get_app(db, app_id)
    if app is None:
        raise HTTPException(status_code=404, detail="App not found")
    return app_service.update_app(db, app, data)


@router.delete("/{app_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_app(app_id: int, db: Session = Depends(get_db)):
    app = app_service.get_app(db, app_id)
    if app is None:
        raise HTTPException(status_code=404, detail="App not found")
    app_service.delete_app(db, app)
