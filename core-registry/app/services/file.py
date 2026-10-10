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
    existing = {
        f.id: f
        for f in db.query(File).filter(File.app_id == app_id).all()
    }

    result = []
    payload_ids = set()
    to_create = []
    for f in files:
        db_file = existing.get(f.id) if f.id is not None else None
        if db_file is not None:
            db_file.link = f.link
            db_file.type = f.type
            payload_ids.add(f.id)
            result.append(db_file)
        else:
            to_create.append(f)

    for db_file in existing.values():
        if db_file.id not in payload_ids:
            db.delete(db_file)

    result.extend(create_files(db, app_id, to_create))
    return result
