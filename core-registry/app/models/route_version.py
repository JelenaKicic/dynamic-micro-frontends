from sqlalchemy import CheckConstraint, Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.db.session import Base


class RouteVersion(Base):
    __tablename__ = "route_versions"

    id = Column(Integer, primary_key=True)
    route_id = Column(Integer, ForeignKey("routes.id"), nullable=False)
    name = Column(String, nullable=False)
    percentage = Column(Integer, nullable=False, server_default="100")

    __table_args__ = (
        CheckConstraint(
            "percentage >= 0 AND percentage <= 100",
            name="ck_route_versions_percentage_range",
        ),
    )

    route = relationship("Route", back_populates="versions")
    apps = relationship(
        "App", back_populates="route_version", cascade="all, delete-orphan"
    )
