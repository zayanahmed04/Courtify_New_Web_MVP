"""updated models

Revision ID: fd7228cd3277
Revises: f38c36a95753
Create Date: 2025-12-05 18:06:54.158804
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers
revision = 'fd7228cd3277'
down_revision = 'f38c36a95753'
branch_labels = None
depends_on = None


def upgrade():
    # 1. Rename existing ENUM
    op.execute("ALTER TYPE payment_method_new RENAME TO payment_method_old;")

    # 2. Create NEW enum type
    new_enum = postgresql.ENUM('stripe', 'card', name='payment_method')
    new_enum.create(op.get_bind())

    # 3. Alter column using CAST
    op.execute("""
        ALTER TABLE payments 
        ALTER COLUMN payment_method 
        TYPE payment_method 
        USING payment_method::text::payment_method;
    """)

    # 4. Drop old enum
    op.execute("DROP TYPE payment_method_old;")

    # USERS NEW COLUMN
    with op.batch_alter_table('users') as batch_op:
        batch_op.add_column(sa.Column('img_url', sa.String(length=100), nullable=True))


def downgrade():
    # 1. Recreate OLD enum
    old_enum = postgresql.ENUM('card', name='payment_method_old')
    old_enum.create(op.get_bind())

    # 2. Convert column back
    op.execute("""
        ALTER TABLE payments 
        ALTER COLUMN payment_method 
        TYPE payment_method_old 
        USING payment_method::text::payment_method_old;
    """)

    # 3. Drop new enum
    op.execute("DROP TYPE payment_method;")

    # 4. Rename enum back
    op.execute("ALTER TYPE payment_method_old RENAME TO payment_method_new;")

    # DROP COLUMN
    with op.batch_alter_table('users') as batch_op:
        batch_op.drop_column('img_url')
