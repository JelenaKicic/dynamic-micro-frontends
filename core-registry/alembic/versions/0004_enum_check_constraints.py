"""add enum check constraints for apps.position and files.type

Revision ID: 0004
Revises: 0003
Create Date: 2026-07-08

"""
from typing import Sequence, Union

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "0004"
down_revision: Union[str, None] = "0003"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_check_constraint(
        "ck_apps_position",
        "apps",
        "position IN ('navigation', 'sidebar', 'center')",
    )
    op.create_check_constraint(
        "ck_files_type",
        "files",
        "type IN ('CSS', 'JS')",
    )


def downgrade() -> None:
    op.drop_constraint("ck_files_type", "files", type_="check")
    op.drop_constraint("ck_apps_position", "apps", type_="check")
