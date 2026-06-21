import enum

from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.db.session import Base


class Position(str, enum.Enum):
    sidebar = "sidebar"
    center = "center"


class App(Base):
    __tablename__ = "apps"

    id = Column(Integer, primary_key=True)
    route_version_id = Column(
        Integer, ForeignKey("route_versions.id"), nullable=False
    )
    name = Column(String, nullable=False)
    # Stored as a string; allowed values are enforced by the Position enum
    # on the Pydantic schemas.
    position = Column(String, nullable=False)

    route_version = relationship("RouteVersion", back_populates="apps")
    files = relationship(
        "File", back_populates="app", cascade="all, delete-orphan"
    )
