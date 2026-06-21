from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import apps, route_versions, routes, stream

app = FastAPI(title="Core Registry")

# Explicit origin (not "*") so the orchestrator can send the ab_id cookie.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(routes.router)
app.include_router(route_versions.router)
app.include_router(apps.router)
app.include_router(stream.router)


@app.get("/")
def read_root():
    return {"status": "ok"}
