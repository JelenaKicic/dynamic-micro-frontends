from sqlalchemy.orm import Session

from app.models.file import File
from app.schemas.file import FileCreate


def create_files(
    db: Session, app_id: int, files: list[FileCreate]
) -> list[File]:
    created = []
    for f in files:
        db_file = File(app_id=app_id, link=f.link, type=f.type)
        db.add(db_file)
        created.append(db_file)
    return created


def replace_files(
    db: Session, app_id: int, files: list[FileCreate]
) -> list[File]:
    # Drop the app's current files, then recreate from the new payload
    db.query(File).filter(File.app_id == app_id).delete()
    return create_files(db, app_id, files)
