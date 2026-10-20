"""add foreign-key indexes, visit stats index, and on-delete cascades

Revision ID: 0005
Revises: 0004
Create Date: 2026-10-18

"""
from typing import Sequence, Union

from alembic import op

revision: str = "0005"
down_revision: Union[str, None] = "0004"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_index(
        "ix_route_versions_route_id", "route_versions", ["route_id"]
    )
    op.create_index(
        "ix_apps_route_version_id", "apps", ["route_version_id"]
    )
    op.create_index("ix_files_app_id", "files", ["app_id"])
    op.create_index(
        "ix_visits_route_version_id_client_cookie",
        "visits",
        ["route_version_id", "client_cookie"],
    )

    op.drop_constraint(
        "route_versions_route_id_fkey", "route_versions", type_="foreignkey"
    )
    op.create_foreign_key(
        "route_versions_route_id_fkey",
        "route_versions",
        "routes",
        ["route_id"],
        ["id"],
        ondelete="CASCADE",
    )

    op.drop_constraint(
        "apps_route_version_id_fkey", "apps", type_="foreignkey"
    )
    op.create_foreign_key(
        "apps_route_version_id_fkey",
        "apps",
        "route_versions",
        ["route_version_id"],
        ["id"],
        ondelete="CASCADE",
    )

    op.drop_constraint("files_app_id_fkey", "files", type_="foreignkey")
    op.create_foreign_key(
        "files_app_id_fkey",
        "files",
        "apps",
        ["app_id"],
        ["id"],
        ondelete="CASCADE",
    )


def downgrade() -> None:
    op.drop_constraint("files_app_id_fkey", "files", type_="foreignkey")
    op.create_foreign_key(
        "files_app_id_fkey", "files", "apps", ["app_id"], ["id"]
    )

    op.drop_constraint(
        "apps_route_version_id_fkey", "apps", type_="foreignkey"
    )
    op.create_foreign_key(
        "apps_route_version_id_fkey",
        "apps",
        "route_versions",
        ["route_version_id"],
        ["id"],
    )

    op.drop_constraint(
        "route_versions_route_id_fkey", "route_versions", type_="foreignkey"
    )
    op.create_foreign_key(
        "route_versions_route_id_fkey",
        "route_versions",
        "routes",
        ["route_id"],
        ["id"],
    )

    op.drop_index(
        "ix_visits_route_version_id_client_cookie", table_name="visits"
    )
    op.drop_index("ix_files_app_id", table_name="files")
    op.drop_index("ix_apps_route_version_id", table_name="apps")
    op.drop_index("ix_route_versions_route_id", table_name="route_versions")
