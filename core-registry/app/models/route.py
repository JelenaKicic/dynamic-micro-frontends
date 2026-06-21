from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

from app.db.session import Base


class Route(Base):
    __tablename__ = "routes"

    id = Column(Integer, primary_key=True)
    link = Column(String, nullable=False)
    name = Column(String, nullable=False)

    versions = relationship(
        "RouteVersion", back_populates="route", cascade="all, delete-orphan"
    )
