import enum

from sqlalchemy import CheckConstraint, Column, ForeignKey, Integer, String
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
    type = Column(String, nullable=False)

    __table_args__ = (
        CheckConstraint("type IN ('CSS', 'JS')", name="ck_files_type"),
    )

    app = relationship("App", back_populates="files")
