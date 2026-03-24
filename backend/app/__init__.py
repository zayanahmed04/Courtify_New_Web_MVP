from flask import Flask, jsonify
from flask_restx import Api, Namespace
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from datetime import timedelta
from flask_mail import Mail
from dotenv import load_dotenv
import os
import stripe

load_dotenv()

# ---------------------------
# CONFIG
# ---------------------------
class Config:
    SECRET_KEY = os.getenv("SECRET_KEY")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URI")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)

    JWT_TOKEN_LOCATION = ["cookies"]
    JWT_ACCESS_COOKIE_NAME = "access_token_cookie"
    JWT_COOKIE_SECURE = False
    JWT_COOKIE_SAMESITE = "Lax"
    JWT_COOKIE_CSRF_PROTECT = False


# ---------------------------
# FLASK APP INIT
# ---------------------------
flask_app = Flask(__name__)
flask_app.config.from_object(Config)

db = SQLAlchemy(flask_app)
bcrypt = Bcrypt(flask_app)
migrate = Migrate(flask_app, db)
jwt = JWTManager(flask_app)

# Email Settings
flask_app.config['MAIL_SERVER'] = 'smtp.gmail.com'
flask_app.config['MAIL_PORT'] = 587
flask_app.config['MAIL_USE_TLS'] = True
flask_app.config['MAIL_USE_SSL'] = False
flask_app.config['MAIL_USERNAME'] = os.getenv("DEL_EMAIL")
flask_app.config['MAIL_PASSWORD'] = os.getenv("MAIL_PASSWORD")
mail = Mail(flask_app)

# Stripe Keys
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

# ---------------------------
# SWAGGER API
# ---------------------------
authorizations = {"bearer": {"type": "apiKey", "in": "header", "name": "Authorization"}}

api = Api(
    flask_app,
    version="1.0",
    title="Courtify API",
    authorizations=authorizations,
    security="bearer"
)

# ---------------------------
# CORS
# ---------------------------
frontend_origins = os.getenv("FRONTEND_URL")

CORS(
    flask_app,
    supports_credentials=True,
    origins=frontend_origins,
    allow_headers=["Content-Type", "Authorization"],
    methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],

)

# ---------------------------
# Test Route
# ---------------------------
@flask_app.route("/test")
def test():
    return {"message": "Flask merged app is running!"}


# ---------------------------
# Namespaces
# ---------------------------
users_ns = Namespace("Users", description="User related operations")
courts_ns = Namespace("Courts", description="Court related operations")
matches_ns = Namespace("Matchmaking", description="Matchmaking related operations")
favs_ns = Namespace("Favorites", description="Favorites related operations")
bookings_ns = Namespace("Bookings", description="Bookings related operations")
payments_ns = Namespace("Payments", description="Payment related operations")
admin_ns = Namespace("Admin", description="Admin related operations")
reviews_ns = Namespace("Reviews", description="Review related operations")
chat_ns = Namespace("chat", description="RAG Chatbot endpoints")


api.add_namespace(users_ns, path="/users")
api.add_namespace(courts_ns, path="/courts")
api.add_namespace(matches_ns, path="/matchmaking")
api.add_namespace(favs_ns, path="/favs")
api.add_namespace(bookings_ns, path="/bookings")
api.add_namespace(reviews_ns, path="/reviews")
api.add_namespace(payments_ns, path="/payments")
api.add_namespace(admin_ns, path="/admin")
api.add_namespace(chat_ns, path="/chat")

# ---------------------------
# ROUTES + MODELS
# ---------------------------
import app.models.cf_models
import app.routes.userRoutes
import app.routes.courtsRoutes
import app.routes.matchMakingRoutes
import app.routes.favoritesRoutes
import app.routes.bookingRoutes
import app.routes.paymentRoutes
import app.routes.adminRoutes
import app.routes.ReviewRoutes
import app.routes.chatRoutes


# ---------------------------
# SCHEDULER (IMPORT AT END)
# ---------------------------
from apscheduler.schedulers.background import BackgroundScheduler
from app.tasks.scheduler import update_completed_bookings

scheduler = BackgroundScheduler()
scheduler.add_job(
    func=lambda: update_completed_bookings(flask_app),
    trigger="interval",
    minutes=1
)
scheduler.start()

import atexit
atexit.register(lambda: scheduler.shutdown())
