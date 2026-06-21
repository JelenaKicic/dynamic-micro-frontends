from pydantic import BaseModel, ConfigDict

from app.models.app import Position
from app.schemas.file import FileCreate, FileRead


class AppBase(BaseModel):
    route_version_id: int
    name: str
    position: Position


class AppCreate(AppBase):
    files: list[FileCreate] = []


class AppUpdate(AppBase):
    files: list[FileCreate] = []


class AppRead(AppBase):
    id: int
    files: list[FileRead] = []

    model_config = ConfigDict(from_attributes=True)
