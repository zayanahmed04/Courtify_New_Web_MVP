# app/routes/matchmaking_routes.py
from app import db, matches_ns
from flask import request
from flask_restx import Resource
from app.fields.matchMakingFields import matchmaking_data
from app.models.cf_models import Matchmaking,Users
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from flask_mail import Message
from app import mail
import os

@matches_ns.route("/create")
class MatchmakingList(Resource):
    @jwt_required()
    @matches_ns.expect(matchmaking_data)
    def post(self):
        user_id = int(get_jwt_identity())
        data = request.get_json()

        try:
            new_match = Matchmaking(
                user_id=user_id,
                sport=data.get("sport"),
                location=data.get("location"),
                date_time=datetime.fromisoformat(data.get("dateTime")),
                contact_number=data.get("whatsappNumber"),
                match_details=data.get("message")
            )
            
            db.session.add(new_match)
            db.session.commit()

            # --------------------
            # Fetch user manually since no relationship
            # --------------------
           
            user = Users.query.get(user_id)  # user_id se email aur username fetch

            
           

            msg = Message(
                subject="Courtify: New Match Created",
                sender=os.getenv("DEL_EMAIL"),
                recipients=[user.email]  # use fetched user
            )
            msg.html = f"""
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 20px auto; padding: 20px; background-color: #f9f9f9; border-radius: 8px;">
                <h2 style="color:#4f46e5;">Hello {user.username}!</h2>
                <p>Your matchmaking entry has been <strong>created successfully</strong>.</p>
                <p>
                    <strong>Sport:</strong> {new_match.sport}<br/>
                    <strong>Location:</strong> {new_match.location}<br/>
                    <strong>Date & Time:</strong> {new_match.date_time.strftime('%Y-%m-%d %H:%M')}<br/>
                    <strong>Details:</strong> {new_match.match_details}
                </p>
                <a href="https://your-frontend-url.com/dashboard" style="display:inline-block;padding:10px 20px;background-color:#4f46e5;color:white;text-decoration:none;border-radius:5px;">Go to Dashboard</a>
            </div>
            """
            mail.send(msg)

            return {"message": "Match created successfully", "match_id": new_match.id}, 201

        except Exception as e:
            db.session.rollback()
            return {"error": str(e)}, 400



@matches_ns.route("/byuser")
class MatchmakingByUser(Resource):
    @jwt_required()
    def get(self):
        """Fetch all matchmaking entries for logged-in user"""
        user_id = get_jwt_identity()
        matches = Matchmaking.query.filter_by(user_id=user_id).all()

        result = [
            {
                "id": match.id,
                "sport": match.sport,
                "location": match.location,
                "date_time": match.date_time.isoformat(),
                "contact_number": match.contact_number,
                "match_details": match.match_details,
                "created_at": match.created_at.isoformat(),
                "user_id": match.user_id,
            }
            for match in matches
        ]
        return {"matches": result}, 200


@matches_ns.route("/all")
class MatchmakingAll(Resource):
    @jwt_required()
    def get(self):
        """Fetch all matchmaking entries"""
        matches = Matchmaking.query.all()
        result = [
            {
                "id": match.id,
                "sport": match.sport,
                "location": match.location,
                "date_time": match.date_time.isoformat(),
                "contact_number": match.contact_number,
                "match_details": match.match_details,
                "created_at": match.created_at.isoformat(),
                "user_id": match.user_id,
            }
            for match in matches
        ]
        return {"matches": result}, 200


@matches_ns.route("/<int:id>")
class MatchmakingDelete(Resource):
    @jwt_required()
    def delete(self, id):
        """Delete a matchmaking entry by ID (only owner can delete)"""
        user_id = int(get_jwt_identity())
        match = Matchmaking.query.filter_by(id=id, user_id=user_id).first()
        if not match:
            return {"error": "Match not found or you are not authorized"}, 404

        try:
            # --------------------
            # Fetch user manually
            # --------------------
            from app.models.cf_models import Users
            user = Users.query.get(user_id)  # get email & username

            # --------------------
            # Send email to user
            # --------------------
           

            msg = Message(
                subject="Courtify: Match Deleted",
                sender=os.getenv("DEL_EMAIL"),
                recipients=[user.email]
            )
            msg.html = f"""
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 20px auto; padding: 20px; background-color: #f9f9f9; border-radius: 8px;">
                <h2 style="color:#4f46e5;">Hello {user.username}!</h2>
                <p>Your matchmaking entry has been <strong>deleted successfully</strong>.</p>
                <p>
                    <strong>Sport:</strong> {match.sport}<br/>
                    <strong>Location:</strong> {match.location}<br/>
                    <strong>Details:</strong> {match.match_details}
                </p>
                <a href="https://your-frontend-url.com/dashboard" style="display:inline-block;padding:10px 20px;background-color:#4f46e5;color:white;text-decoration:none;border-radius:5px;">Go to Dashboard</a>
            </div>
            """
            mail.send(msg)

            # --------------------
            # Delete match
            # --------------------
            db.session.delete(match)
            db.session.commit()

            return {"message": "Match deleted successfully"}, 200

        except Exception as e:
            db.session.rollback()
            return {"error": str(e)}, 400
