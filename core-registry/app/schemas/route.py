from pydantic import BaseModel, ConfigDict


class RouteBase(BaseModel):
    link: str
    name: str


class RouteCreate(RouteBase):
    pass


class RouteUpdate(RouteBase):
    pass


class RouteRead(RouteBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
