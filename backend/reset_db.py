from app import flask_app, db
from app.models.cf_models import *

with flask_app.app_context():
    print("⛔ Dropping all tables...")
    db.drop_all()

    print("🆕 Creating all tables...")
    db.create_all()

    print("✅ Database reset done!")
