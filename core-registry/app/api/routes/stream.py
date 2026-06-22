import asyncio
import json
from uuid import uuid4

from fastapi import APIRouter, Request
from fastapi.responses import StreamingResponse

from app.db.session import SessionLocal
from app.services.broker import broker
from app.services.stream import build_view, diff_views

router = APIRouter(tags=["stream"])

AB_COOKIE_NAME = "ab_id"
COOKIE_MAX_AGE = 60 * 60 * 24 * 365
HEARTBEAT_SECONDS = 15


def _sse(event: str, data: dict) -> str:
    return f"event: {event}\ndata: {json.dumps(data)}\n\n"


def _view_for(visitor_id: str) -> dict:
    database = SessionLocal()
    try:
        return build_view(database, visitor_id)
    finally:
        database.close()


@router.get("/stream")
async def stream(request: Request):
    visitor_id = request.cookies.get(AB_COOKIE_NAME)
    new_visitor = visitor_id is None
    if new_visitor:
        visitor_id = uuid4().hex

    broker.bind_loop(asyncio.get_running_loop())

    async def event_generator():
        queue = broker.subscribe()
        try:
            view = _view_for(visitor_id)
            yield _sse("snapshot", {"routes": list(view.values())})

            while not await request.is_disconnected():
                try:
                    await asyncio.wait_for(queue.get(), timeout=HEARTBEAT_SECONDS)
                except asyncio.TimeoutError:
                    yield ": keepalive\n\n"
                    continue

                new_view = _view_for(visitor_id)
                for change in diff_views(view, new_view):
                    yield _sse("change", change)
                view = new_view
        finally:
            broker.unsubscribe(queue)

    response = StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )
    if new_visitor:
        response.set_cookie(
            AB_COOKIE_NAME,
            visitor_id,
            max_age=COOKIE_MAX_AGE,
            httponly=True,
            samesite="lax",
        )
    return response
