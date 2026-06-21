import enum

from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.db.session import Base


class FileType(str, enum.Enum):
    CSS = "CSS"
    JS = "JS"


class File(Base):
    __tablename__ = "files"

    id = Column(Integer, primary_key=True)
    app_id = Column(Integer, ForeignKey("apps.id"), nullable=False)
    link = Column(String, nullable=False)
    # Stored as a string; allowed values are enforced by the FileType enum
    # on the Pydantic schemas.
    type = Column(String, nullable=False)

    app = relationship("App", back_populates="files")
