from pydantic import BaseModel, ConfigDict

from app.models.file import FileType


class FileBase(BaseModel):
    link: str
    type: FileType


class FileCreate(FileBase):
    pass


class FileRead(FileBase):
    id: int
    app_id: int

    model_config = ConfigDict(from_attributes=True)
