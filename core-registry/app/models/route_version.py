from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.db.session import Base


class RouteVersion(Base):
    __tablename__ = "route_versions"

    id = Column(Integer, primary_key=True)
    route_id = Column(Integer, ForeignKey("routes.id"), nullable=False)
    name = Column(String, nullable=False)

    route = relationship("Route", back_populates="versions")
    apps = relationship(
        "App", back_populates="route_version", cascade="all, delete-orphan"
    )
