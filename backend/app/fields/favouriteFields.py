from flask_restx import fields
from app import favs_ns  

favourite_data = favs_ns.model(
    "Favourite Data",
    {
        "id": fields.Integer(description="Favourite record ID"),
        "user_id": fields.Integer(required=True, description="User who favourited the court"),
        "court_id": fields.Integer(required=True, description="Court that is favourited"),
        "created_at": fields.DateTime(description="Timestamp when added to favourites"),
    }
)
