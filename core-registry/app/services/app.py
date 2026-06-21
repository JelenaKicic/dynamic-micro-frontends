from sqlalchemy.orm import Session

from app.models.app import App
from app.schemas.app import AppCreate, AppUpdate
from app.services import file as file_service


def get_apps(db: Session) -> list[App]:
    return db.query(App).all()


def get_app(db: Session, app_id: int) -> App | None:
    return db.query(App).filter(App.id == app_id).first()


def create_app(db: Session, data: AppCreate) -> App:
    app = App(
        route_version_id=data.route_version_id,
        name=data.name,
        position=data.position,
    )
    db.add(app)
    db.flush()  # assigns app.id without committing yet

    # Files are created together with the app, in the same transaction.
    file_service.create_files(db, app.id, data.files)

    db.commit()
    db.refresh(app)
    return app


def update_app(db: Session, app: App, data: AppUpdate) -> App:
    app.route_version_id = data.route_version_id
    app.name = data.name
    app.position = data.position

    # Files are replaced on update, in the same transaction.
    file_service.replace_files(db, app.id, data.files)

    db.commit()
    db.refresh(app)
    return app


def delete_app(db: Session, app: App) -> None:
    db.delete(app)
    db.commit()
