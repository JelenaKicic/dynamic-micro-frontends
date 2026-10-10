import json

from app.db.session import SessionLocal
from app.services.stream import build_snapshot


def main():
    db = SessionLocal()
    try:
        snapshot = build_snapshot(db)
    finally:
        db.close()

    output = {
        "routes": snapshot.routes,
    }

    with open("config_snapshot.json", "w") as f:
        json.dump(output, f, indent=2, ensure_ascii=False)

    print(f"Wrote {len(snapshot.routes)} routes to config_snapshot.json")


if __name__ == "__main__":
    main()
