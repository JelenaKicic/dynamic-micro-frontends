from fastapi import FastAPI

from app.api.routes import apps, route_versions, routes

app = FastAPI(title="Core Registry")

app.include_router(routes.router)
app.include_router(route_versions.router)
app.include_router(apps.router)


@app.get("/")
def read_root():
    return {"status": "ok"}
