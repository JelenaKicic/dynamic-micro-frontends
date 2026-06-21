from pydantic import BaseModel, ConfigDict


class RouteVersionBase(BaseModel):
    route_id: int
    name: str


class RouteVersionCreate(RouteVersionBase):
    pass


class RouteVersionUpdate(RouteVersionBase):
    pass


class RouteVersionRead(RouteVersionBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
