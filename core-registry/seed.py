"""Seed the registry with the demonstration configuration.

Run from the core-registry folder:
    python seed.py            # seeds only when the config is empty
    python seed.py --reset    # wipes config (and visits) and reseeds
"""
import argparse

from sqlalchemy import text

from app.db.session import SessionLocal
from app.models.app import App
from app.models.file import File
from app.models.route import Route
from app.models.route_version import RouteVersion

CONFIG = [
    {
        "link": "/",
        "name": "Огласи",
        "versions": [
            {
                "name": "Oglasi Vue",
                "percentage": 60,
                "apps": [
                    {
                        "name": "micro-announcements-vue",
                        "position": "center",
                        "files": [
                            ("JS", "http://localhost:3006/assets/index-DZAyKQQj.js"),
                            ("CSS", "http://localhost:3006/assets/index-q_Q0KSPj.css"),
                        ],
                    }
                ],
            },
            {
                "name": "Oglasi React",
                "percentage": 40,
                "apps": [
                    {
                        "name": "micro-announcements-react",
                        "position": "center",
                        "files": [
                            ("JS", "http://localhost:3007/static/js/main.a6a0b49a.js"),
                            ("CSS", "http://localhost:3007/static/css/main.b7549d4f.css"),
                        ],
                    }
                ],
            },
        ],
    },
    {
        "link": "/raspored-nastave",
        "name": "Распоред Наставе",
        "versions": [
            {
                "name": "Raspored nastave",
                "percentage": 100,
                "apps": [
                    {
                        "name": "micro-class-schedule",
                        "position": "center",
                        "files": [
                            ("JS", "http://localhost:3001/static/js/main.0da85fae.js"),
                            ("CSS", "http://localhost:3001/static/css/main.794b89d0.css"),
                        ],
                    }
                ],
            }
        ],
    },
    {
        "link": "/zauzetost-sala",
        "name": "Заузетост Сала",
        "versions": [
            {
                "name": "Zauzetost sala",
                "percentage": 100,
                "apps": [
                    {
                        "name": "micro-classrooms-schedule",
                        "position": "center",
                        "files": [
                            ("JS", "http://localhost:3002/static/js/main.5b68fc29.js"),
                            ("CSS", "http://localhost:3002/static/css/main.794b89d0.css"),
                        ],
                    }
                ],
            }
        ],
    },
    {
        "link": "/zavrsni-radovi",
        "name": "Завршни Радови",
        "versions": [
            {
                "name": "Zavrsni radovi",
                "percentage": 100,
                "apps": [
                    {
                        "name": "micro-graduation-theses",
                        "position": "center",
                        "files": [
                            ("JS", "http://localhost:3003/static/js/main.f28f6642.js"),
                            ("CSS", "http://localhost:3003/static/css/main.794b89d0.css"),
                        ],
                    }
                ],
            }
        ],
    },
    {
        "link": "**",
        "name": "all",
        "versions": [
            {
                "name": "Sidebar",
                "percentage": 100,
                "apps": [
                    {
                        "name": "micro-navigation",
                        "position": "navigation",
                        "files": [
                            ("JS", "http://localhost:3004/assets/index-YuoCg6Ge.js"),
                            ("CSS", "http://localhost:3004/assets/index-j5pukfUq.css"),
                        ],
                    },
                    {
                        "name": "micro-settings",
                        "position": "sidebar",
                        "files": [
                            ("JS", "http://localhost:3005/static/js/main.47905ec9.js"),
                            ("CSS", "http://localhost:3005/static/css/main.794b89d0.css"),
                        ],
                    },
                ],
            }
        ],
    },
]


def build_route(route_config):
    route = Route(link=route_config["link"], name=route_config["name"])
    for version_config in route_config["versions"]:
        version = RouteVersion(
            name=version_config["name"],
            percentage=version_config["percentage"],
        )
        for app_config in version_config["apps"]:
            app = App(name=app_config["name"], position=app_config["position"])
            for file_type, link in app_config["files"]:
                app.files.append(File(type=file_type, link=link))
            version.apps.append(app)
        route.versions.append(version)
    return route


def clear(db):
    db.execute(
        text(
            "TRUNCATE routes, route_versions, apps, files, visits "
            "RESTART IDENTITY CASCADE"
        )
    )
    db.commit()


def seed(reset=False):
    db = SessionLocal()
    try:
        if db.query(Route).count() > 0:
            if not reset:
                print("Configuration already present. Use --reset to reseed.")
                return
            clear(db)

        for route_config in CONFIG:
            db.add(build_route(route_config))
        db.commit()

        routes = db.query(Route).count()
        versions = db.query(RouteVersion).count()
        apps = db.query(App).count()
        files = db.query(File).count()
        print(
            f"Seeded {routes} routes, {versions} versions, "
            f"{apps} apps, {files} files."
        )
    finally:
        db.close()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Seed the registry database.")
    parser.add_argument(
        "--reset",
        action="store_true",
        help="Wipe existing config (and visits) before seeding.",
    )
    args = parser.parse_args()
    seed(reset=args.reset)
