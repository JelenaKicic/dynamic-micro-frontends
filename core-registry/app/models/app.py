import enum

from sqlalchemy import CheckConstraint, Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.db.session import Base


class Position(str, enum.Enum):
    navigation = "navigation"
    sidebar = "sidebar"
    center = "center"


class App(Base):
    __tablename__ = "apps"

    id = Column(Integer, primary_key=True)
    route_version_id = Column(
        Integer,
        ForeignKey("route_versions.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    name = Column(String, nullable=False)
    position = Column(String, nullable=False)

    __table_args__ = (
        CheckConstraint(
            "position IN ('navigation', 'sidebar', 'center')",
            name="ck_apps_position",
        ),
    )

    route_version = relationship("RouteVersion", back_populates="apps")
    files = relationship(
        "File",
        back_populates="app",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )
