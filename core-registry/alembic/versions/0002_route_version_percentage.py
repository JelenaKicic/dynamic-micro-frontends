"""add percentage to route_versions

Revision ID: 0002
Revises: 0001
Create Date: 2026-06-21

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = "0002"
down_revision: Union[str, None] = "0001"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "route_versions",
        sa.Column(
            "percentage",
            sa.Integer(),
            nullable=False,
            server_default="100",
        ),
    )
    op.create_check_constraint(
        "ck_route_versions_percentage_range",
        "route_versions",
        "percentage >= 0 AND percentage <= 100",
    )


def downgrade() -> None:
    op.drop_constraint(
        "ck_route_versions_percentage_range",
        "route_versions",
        type_="check",
    )
    op.drop_column("route_versions", "percentage")
