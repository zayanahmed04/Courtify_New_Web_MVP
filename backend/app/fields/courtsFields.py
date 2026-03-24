# api/models/court_api_model.py
from flask_restx import fields
from app import courts_ns   # <-- your courts namespace

court_data = courts_ns.model(
    "Court Data",
    {
        "name": fields.String(required=True, description="Name of the court"),
        "location": fields.String(required=True, description="Full address of the court"),
        "hourly_rate": fields.Float(required=True, description="Hourly booking rate"),
        "maintenance": fields.Boolean(description="Whether the court is under maintenance"),
        "status": fields.String(description="Court status e.g. pending, approved, rejected"),
        "type": fields.String(description="Type of court e.g. futsal, badminton, tennis"),
        "owner_id": fields.Integer(required=True, description="Owner user ID"),
        "opening_time": fields.String(required=True, description="Opening time (HH:MM)"),
        "closing_time": fields.String(required=True, description="Closing time (HH:MM)"),
        "created_at": fields.DateTime(description="Court creation timestamp"),
        "description": fields.String(description="Detailed description of the court"),
        "image_url": fields.String(description="Court image URL"),
    }
)