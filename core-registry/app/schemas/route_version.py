from pydantic import BaseModel, ConfigDict, Field


class RouteVersionBase(BaseModel):
    route_id: int
    name: str
    percentage: int = Field(default=100, ge=0, le=100)


class RouteVersionCreate(RouteVersionBase):
    pass


class RouteVersionUpdate(RouteVersionBase):
    pass


class RouteVersionRead(RouteVersionBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
