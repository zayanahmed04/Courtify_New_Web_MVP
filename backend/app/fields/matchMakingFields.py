# api/models/matchmaking_api_model.py
from flask_restx import fields
from app import matches_ns  # <-- your matchmaking namespace

matchmaking_data = matches_ns.model(
    "Matchmaking Data",
    {
        "user_id": fields.Integer(required=True, description="User ID of the person creating the match"),
        "sport": fields.String(required=True, description="Sport type e.g. football, badminton"),
        "location": fields.String(required=True, description="Full address or location of the match"),
        "date_time": fields.DateTime(required=True, description="Date and time of the match (YYYY-MM-DD HH:MM:SS)"),
        "contact_number": fields.String(description="Contact number for coordination"),
        "match_details": fields.String(required=True, description="Additional details about the match"),
        "created_at": fields.DateTime(description="Matchmaking creation timestamp"),
    }
)
