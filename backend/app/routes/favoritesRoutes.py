from app import favs_ns, db
from flask import request, jsonify
from flask_restx import Resource
from app.fields.favouriteFields import favourite_data
from app.models.cf_models import Favourites
from flask_jwt_extended import get_jwt_identity, jwt_required
from datetime import datetime


@favs_ns.route("/all")
class UserFavourites(Resource):

    @favs_ns.doc('get user favourites')
    @jwt_required()
    def get(self):
        try:
            current_user_id = int(get_jwt_identity())

            # Fetch user favourites
            favourites = Favourites.query.filter_by(user_id=current_user_id).all()

            result = []
            for fav in favourites:
                result.append({
                    "id": fav.id,
                    "user_id": fav.user_id,
                    "court_id": fav.court_id,
                    "created_at": fav.created_at.isoformat() if fav.created_at else None
                })

            return {"favourites": result}, 200

        except Exception as e:
            return {"error": "Something went wrong.", "details": str(e)}, 500
        
@favs_ns.route("/add")
class AddFavourite(Resource):

    @favs_ns.doc("add favourite court")
    @jwt_required()
    def post(self):
        try:
            current_user_id = int(get_jwt_identity())
            data = request.get_json()

            court_id = data.get("court_id")

            if not court_id:
                return {"error": "court_id is required"}, 400

            # Check if already favourited
            existing = Favourites.query.filter_by(
                user_id=current_user_id,
                court_id=court_id
            ).first()

            if existing:
                return {"message": "Court already in favourites"}, 200

            # Add new favourite
            fav = Favourites(
                user_id=current_user_id,
                court_id=court_id
            )

            db.session.add(fav)
            db.session.commit()

            return {"message": "Added to favourites successfully"}, 201

        except Exception as e:
            return {"error": "Something went wrong", "details": str(e)}, 500


@favs_ns.route("/delete/<int:court_id>")
class DeleteFavourite(Resource):

    @favs_ns.doc("delete favourite court")
    @jwt_required()
    def delete(self, court_id):
        try:
            current_user_id = int(get_jwt_identity())

            fav = Favourites.query.filter_by(
                user_id=current_user_id,
                court_id=court_id
            ).first()

            if not fav:
                return {"error": "Favourite not found"}, 404

            db.session.delete(fav)
            db.session.commit()

            return {"message": "Favourite removed successfully"}, 200

        except Exception as e:
            return {"error": "Something went wrong", "details": str(e)}, 500

