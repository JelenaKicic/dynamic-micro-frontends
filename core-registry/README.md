# Core Registry
The Core Registry is the backend that holds the configuration for the whole system. It stores which routes exist and which micro-applications each route loads, and serves that configuration to the UI Orchestrator over a live stream.

It is built with FastAPI and keeps its data in a database (SQLAlchemy models, migrated with Alembic):

- **Configuration store:** manages routes, their versions, the apps on each route, and the apps' files (JS/CSS) through REST endpoints.
- **Live stream:** exposes a Server-Sent Events endpoint (`/stream`) that pushes a full snapshot on connect and then only the changes as routes or apps are edited.
- **A/B testing:** a route can have several versions split by percentage; each visitor is assigned a stable version from their `ab_id` cookie.
- **Visit tracking:** records each visited route and reports per-route statistics.

## Project Setup

```sh
pip install -r requirements.txt
```

Apply database migrations:

```sh
alembic upgrade head
```

Seed some sample data (optional):

```sh
python seed.py
```

### Run for Development

```sh
fastapi dev main.py
```
