from sqlalchemy import Column, DateTime, ForeignKey, Index, Integer, String, func

from app.db.session import Base


class Visit(Base):
    __tablename__ = "visits"

    id = Column(Integer, primary_key=True)
    route_version_id = Column(
        Integer,
        ForeignKey("route_versions.id", ondelete="CASCADE"),
        nullable=False,
    )
    client_cookie = Column(String, nullable=False)
    time = Column(DateTime(timezone=True), nullable=False, server_default=func.now())

    __table_args__ = (
        Index(
            "ix_visits_route_version_id_client_cookie",
            "route_version_id",
            "client_cookie",
        ),
    )
