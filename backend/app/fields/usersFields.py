# api/models/users_api_model.py
from flask_restx import fields
from app import users_ns  # assume users_ns is your namespace

users_data = users_ns.model(
    "Users Data",
    {   
        "username": fields.String(required=True, description="Full name of the user"),
        "email": fields.String(required=True, description="Unique email address"),
        "password_hash": fields.String(required=True, description="Hashed password"),
        "phone_number": fields.String(required=False, description="Phone number of the user"),
        "gender": fields.String(required=False, description="Gender of the user"),
        "role": fields.String(required=True, description="Role of the user, e.g., 'user', 'admin', 'court_owner'"),
        "date_joined": fields.DateTime(description="Date and time when user joined"),
        "is_active": fields.Boolean(description="User active status"),
    }
)
