from app import courts_ns, db, mail
from flask import request
from flask_restx import Resource
from app.fields.courtsFields import court_data
from app.models.cf_models import Courts, Users
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from flask_mail import Message
from decimal import Decimal
from datetime import datetime, time
import os

# -------------------------------
# HELPER FUNCTIONS
# -------------------------------
def parse_time(value):
    if not value:
        return None
    value = value.strip()
    try:
        return datetime.strptime(value, "%H:%M").time()
    except ValueError:
        try:
            t = datetime.strptime(value, "%H:%M:%S").time()
            return time(t.hour, t.minute)
        except ValueError:
            return None

def court_to_dict(court):
    def format_time(t):
        return t.strftime("%H:%M") if isinstance(t, time) else t

    return {
        "id": court.id,
        "name": court.name,
        "location": court.location,
        "hourly_rate": float(court.hourly_rate) if isinstance(court.hourly_rate, Decimal) else court.hourly_rate,
        "maintenance": float(court.maintenance) if isinstance(court.maintenance, Decimal) else court.maintenance,
        "status": court.status,
        "type": court.type,
        "opening_time": format_time(court.opening_time),
        "closing_time": format_time(court.closing_time),
        "description": court.description,
        "image_url": court.image_url,
        "owner_id": court.owner_id
    }

# -------------------------------
# REGISTER COURT
# -------------------------------
@courts_ns.route("/register")
class RegisterCourt(Resource):
    @courts_ns.doc('register a court')
    @courts_ns.expect(court_data)
    @jwt_required()
    def post(self):
        try:
            user_id = int(get_jwt_identity())
            role = get_jwt().get("role")
            user=Users.query.get(user_id)
            if not user:
                return {"message":"User not found or deleted please login again"}

            if role not in ["court_owner"]:
                return {"message": "Only court owners can create a court."}, 403

            data = request.get_json() or {}
            name = data.get("name", "").strip().lower()
            location = data.get("location", "").strip().lower()
            hourly_rate = data.get("hourly_rate")
            maintenance = data.get("maintenance", False)
            type_ = data.get("type", "").strip().lower()
            description = data.get("description", "").strip()
            image_url = data.get("image_url", "https://example.com/default-court.jpg").strip()

            opening_time = parse_time(data.get("opening_time"))
            closing_time = parse_time(data.get("closing_time"))

            if not opening_time or not closing_time:
                return {"message": "Invalid time format. Use HH:MM or HH:MM:SS"}, 400

            # Check duplicate name
            if Courts.query.filter_by(name=name).first():
                return {"message": "Court name already taken."}, 409

            new_court = Courts(
                name=name,
                location=location,
                hourly_rate=hourly_rate,
                maintenance=maintenance,
                status="pending",
                type=type_,
                owner_id=user_id,
                opening_time=opening_time,
                closing_time=closing_time,
                description=description,
                image_url=image_url
            )
            db.session.add(new_court)
            db.session.commit()

            owner = Users.query.get(user_id)
            msg = Message(
                subject="Courtify: Your Court Registration is Pending",
                sender=os.getenv("DEL_EMAIL"),
                recipients=[owner.email]
            )
            msg.html = f"""
            <div style="font-family: Arial, sans-serif; max-width:600px; margin:20px auto; padding:20px; background-color:#f9f9f9; border-radius:8px; text-align:center;">
                <h2 style="color:#4f46e5;">Hello {owner.username}!</h2>
                <p>Your court <strong>{new_court.name.title()}</strong> has been successfully registered and is <strong>pending approval</strong>.</p>
                <p><strong>Location:</strong> {new_court.location.title()}<br/>
                <strong>Hourly Rate:</strong> ${new_court.hourly_rate}<br/>
                <strong>Type:</strong> {new_court.type.title()}<br/>
                <strong>Opening Time:</strong> {new_court.opening_time.strftime('%H:%M')}<br/>
                <strong>Closing Time:</strong> {new_court.closing_time.strftime('%H:%M')}</p>
                <a href="https://your-frontend-url.com/dashboard" style="padding:10px 20px;background-color:#4f46e5;color:white;text-decoration:none;border-radius:5px;">Go to Dashboard</a>
            </div>
            """
            mail.send(msg)

            return {"message": "Court created successfully and is pending approval."}, 201

        except Exception as e:
            db.session.rollback()
            return {"error": "Something went wrong.", "details": str(e)}, 500

# -------------------------------
# GET ALL COURTS (INCLUDING ALL STATUSES)
# -------------------------------
@courts_ns.route("/all")
class AllCourts(Resource):
    @courts_ns.doc("get all courts including pending, approved, and rejected")
    def get(self):
        try:
            courts = Courts.query.all()
            return {"courts": [court_to_dict(c) for c in courts]}, 200
        except Exception as e:
            return {"error": "Something went wrong.", "details": str(e)}, 500

# -------------------------------
# GET ALL APPROVED COURTS
# -------------------------------
@courts_ns.route("/all/approved")
class AllApprovedCourts(Resource):
    @courts_ns.doc("get all approved courts")
    def get(self):
        try:
            courts = Courts.query.filter_by(status="approved").all()
            return {"courts": [court_to_dict(c) for c in courts]}, 200
        except Exception as e:
            return {"error": "Something went wrong.", "details": str(e)}, 500

# -------------------------------
# GET COURTS BY USER
# -------------------------------
@courts_ns.route("/byuser")
class CourtsByUser(Resource):
    @jwt_required()
    def get(self):
        try:
            user_id = int(get_jwt_identity())
            user_courts = Courts.query.filter_by(owner_id=user_id).all()
            return {"courts": [court_to_dict(c) for c in user_courts]}, 200
        except Exception as e:
            return {"error": "Something went wrong.", "details": str(e)}, 500

# -------------------------------
# GET, UPDATE, DELETE COURT BY ID
# -------------------------------
@courts_ns.route("/<int:court_id>")
class CourtResource(Resource):
    @courts_ns.doc("get court by ID")
    def get(self, court_id):
        try:
            court = Courts.query.get(court_id)
            if not court:
                return {"message": "Court not found"}, 404
            return {"court": court_to_dict(court)}, 200
        except Exception as e:
            return {"error": str(e)}, 500

    @courts_ns.doc("update court by ID")
    @jwt_required()
    def put(self, court_id):
        try:
            user_id = get_jwt_identity()
            role = get_jwt().get("role")
            court = Courts.query.get(court_id)
            if not court:
                return {"message": "Court not found"}, 404

            if role != "admin" and court.owner_id != int(user_id):
                return {"message": "You are not allowed to update this court."}, 403

            data = request.get_json() or {}
            for field in ["name", "location", "hourly_rate", "maintenance", "type", "description", "image_url"]:
                if field in data:
                    setattr(court, field, str(data[field]).strip().lower() if isinstance(data[field], str) else data[field])

            if "status" in data and role == "admin":
                court.status = data["status"].strip().lower()

            if "opening_time" in data:
                parsed = parse_time(data["opening_time"])
                if parsed:
                    court.opening_time = parsed
            if "closing_time" in data:
                parsed = parse_time(data["closing_time"])
                if parsed:
                    court.closing_time = parsed

            db.session.commit()
            return {"message": f"Court ID {court_id} updated successfully."}, 200
        except Exception as e:
            db.session.rollback()
            return {"error": str(e)}, 500

    @jwt_required()
    def delete(self, court_id):
        try:
            user_id = int(get_jwt_identity())
            role = get_jwt().get("role")
            court = Courts.query.get(court_id)
            if not court:
                return {"message": "Court not found"}, 404

            if role != "admin" and court.owner_id != int(user_id):
                return {"message": "You are not allowed to delete this court."}, 403

            owner = Users.query.get(court.owner_id)

            db.session.delete(court)
            db.session.commit()

            # Send email to owner
            msg = Message(
                subject="Courtify: Your Court Has Been Deleted",
                sender=os.getenv("DEL_EMAIL"),
                recipients=[owner.email]
            )
            msg.html = f"""
            <div style="font-family: Arial, sans-serif; max-width:600px; margin:20px auto; padding:20px; background-color:#f9f9f9; border-radius:8px; text-align:center;">
                <h2 style="color:#4f46e5;">Hello {owner.username}!</h2>
                <p>Your court <strong>{court.name.title()}</strong> has been <strong>deleted</strong> successfully.</p>
                <p>If you think this is a mistake, please contact support.</p>
            </div>
            """
            mail.send(msg)

            return {"message": f"Court ID {court_id} has been deleted successfully."}, 200
        except Exception as e:
            db.session.rollback()
            return {"error": str(e)}, 500

# -------------------------------
# GET ALL PENDING COURTS
# -------------------------------
@courts_ns.route("/all/pending")
class AllPendingCourts(Resource):
    @courts_ns.doc("get all pending courts")
    def get(self):
        try:
            pending_courts = Courts.query.filter_by(status="pending").all()
            return {"courts": [court_to_dict(c) for c in pending_courts]}, 200
        except Exception as e:
            return {"error": str(e)}, 500