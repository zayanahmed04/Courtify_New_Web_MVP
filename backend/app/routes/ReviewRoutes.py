from app import db, reviews_ns
from flask import request
from flask_restx import Resource
from app.models.cf_models import Reviews, Users, Courts
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from sqlalchemy import func

# -------------------------------
# HELPER FUNCTION
# -------------------------------
def review_to_dict(review):
    return {
        "id": review.id,
        "user_id": review.user_id,
        "court_id": review.court_id,
        "rating": int(review.rating),
        "created_at": review.created_at.strftime("%Y-%m-%d %H:%M:%S")
    }

# -------------------------------
# GIVE OR UPDATE RATING
# -------------------------------
@reviews_ns.route("/rate")
class GiveRating(Resource):
    @jwt_required()
    def post(self):
        try:
            user_id = int(get_jwt_identity())
            user = Users.query.get(user_id)
            if not user:
                return {"message": "User not found. Please login again."}, 401

            data = request.get_json() or {}
            court_id = data.get("court_id")
            rating = data.get("rating")

            if not court_id or not rating:
                return {"message": "court_id and rating are required."}, 400

            court = Courts.query.get(court_id)
            if not court:
                return {"message": "Court not found."}, 404

            review = Reviews.query.filter_by(user_id=user_id, court_id=court_id).first()
            if review:
                review.rating = rating
                review.created_at = datetime.utcnow()
                message = "Review updated successfully."
            else:
                review = Reviews(user_id=user_id, court_id=court_id, rating=rating)
                db.session.add(review)
                message = "Review added successfully."

            db.session.commit()
            return {"message": message, "review": review_to_dict(review)}, 201

        except Exception as e:
            db.session.rollback()
            return {"error": str(e)}, 500

# -------------------------------
# GET RATINGS BY COURT ID WITH AVERAGE
# -------------------------------

@reviews_ns.route("/court/<int:court_id>")
class RatingsByCourt(Resource):
    def get(self, court_id):
        try:
            court = Courts.query.get(court_id)
            if not court:
                return {"message": "Court not found."}, 404

            reviews = Reviews.query.filter_by(court_id=court_id).all()
            avg_rating = db.session.query(func.avg(Reviews.rating)).filter_by(court_id=court_id).scalar()
            avg_rating = float(round(avg_rating, 2)) if avg_rating else None  # <-- convert Decimal to float

            return {
                "court_id": court_id,
                "average_rating": avg_rating,
                "reviews": [review_to_dict(r) for r in reviews]
            }, 200

        except Exception as e:
            return {"error": str(e)}, 500

# -------------------------------
# GET CURRENT USER REVIEWS
# -------------------------------
@reviews_ns.route("/my-reviews")
class MyReviews(Resource):
    @jwt_required()
    def get(self):
        try:
            user_id = int(get_jwt_identity())
            user = Users.query.get(user_id)
            if not user:
                return {"message": "User not found. Please login again."}, 401

            # Fetch all courts
            all_courts = Courts.query.all()
            user_reviews = Reviews.query.filter_by(user_id=user_id).all()
            reviews_dict = {r.court_id: r for r in user_reviews}

            result = []
            for court in all_courts:
                if court.id in reviews_dict:
                    result.append({
                        "court_id": court.id,
                        "court_name": court.name.title(),
                        "rating": reviews_dict[court.id].rating,
                        "created_at": reviews_dict[court.id].created_at.strftime("%Y-%m-%d %H:%M:%S")
                    })
                else:
                    result.append({
                        "court_id": court.id,
                        "court_name": court.name.title(),
                        "message": "Give Review!"
                    })

            return {"reviews": result}, 200

        except Exception as e:
            return {"error": str(e)}, 500
