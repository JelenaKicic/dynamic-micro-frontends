from datetime import datetime

from pydantic import BaseModel, ConfigDict


class VisitCreate(BaseModel):
    link: str


class VisitRead(BaseModel):
    id: int
    route_version_id: int
    client_cookie: str
    time: datetime

    model_config = ConfigDict(from_attributes=True)


class CookieVisits(BaseModel):
    client_cookie: str
    count: int


class VersionStatistics(BaseModel):
    route_version_id: int
    name: str
    percentage: int
    visits: list[CookieVisits]


class RouteStatistics(BaseModel):
    route_id: int
    versions: list[VersionStatistics]
