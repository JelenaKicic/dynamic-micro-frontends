import asyncio
import json
from uuid import uuid4

from fastapi import APIRouter, Request
from fastapi.responses import StreamingResponse

from app.db.session import SessionLocal
from app.services.stream import build_snapshot

router = APIRouter(tags=["stream"])

AB_COOKIE_NAME = "ab_id"
COOKIE_MAX_AGE = 60 * 60 * 24 * 365
HEARTBEAT_SECONDS = 15


def _sse(event: str, data: dict) -> str:
    return f"event: {event}\ndata: {json.dumps(data)}\n\n"


@router.get("/stream")
async def stream(request: Request):
    visitor_id = request.cookies.get(AB_COOKIE_NAME)
    new_visitor = visitor_id is None
    if new_visitor:
        visitor_id = uuid4().hex

    database = SessionLocal()
    try:
        snapshot = build_snapshot(database, visitor_id)
    finally:
        database.close()

    async def event_generator():
        yield _sse("snapshot", snapshot)
        while not await request.is_disconnected():
            await asyncio.sleep(HEARTBEAT_SECONDS)
            yield ": keepalive\n\n"

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
