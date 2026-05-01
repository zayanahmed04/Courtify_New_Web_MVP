"""update booking_status enum

Revision ID: bb729a447cba
Revises: 8b161a2b5c3c
Create Date: 2025-11-21 16:18:41.789141

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'bb729a447cba'
down_revision = '8b161a2b5c3c'
branch_labels = None
depends_on = None


def upgrade():
    op.execute("ALTER TYPE booking_status ADD VALUE 'approved';")
    op.execute("ALTER TYPE booking_status ADD VALUE 'rejected';")


def downgrade():
    pass
