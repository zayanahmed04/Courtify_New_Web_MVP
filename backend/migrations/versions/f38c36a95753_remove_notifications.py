"""remove notifications

Revision ID: f38c36a95753
Revises: bb729a447cba
Create Date: 2025-11-25 22:32:59.104102
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'f38c36a95753'
down_revision = 'bb729a447cba'
branch_labels = None
depends_on = None


def upgrade():
    # Drop notifications table
    op.drop_table('notifications')


def downgrade():
    # Recreate notifications table
    op.create_table(
        'notifications',
        sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
        sa.Column('user_id', sa.INTEGER(), nullable=True),
        sa.Column('booking_id', sa.INTEGER(), nullable=True),
        sa.Column('subject', sa.VARCHAR(length=255), nullable=False),
        sa.Column('message_body', sa.TEXT(), nullable=False),
        sa.Column('sent_via', postgresql.ENUM('email', name='notification_channel'), nullable=False),
        sa.Column('sent_at', postgresql.TIMESTAMP(), nullable=True),
        sa.ForeignKeyConstraint(['booking_id'], ['bookings.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
