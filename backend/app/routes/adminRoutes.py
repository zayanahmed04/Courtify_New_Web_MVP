from app import admin_ns, db, mail
from flask_restx import Resource
from app.models.cf_models import Users, Courts
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_mail import Message
from flask import request
import os


@admin_ns.route("/dashboard-stats")
class AdminDashboardStats(Resource):
    @jwt_required()
    def get(self):
        try:
            current_user_id = get_jwt_identity()
            current_user = Users.query.get(current_user_id)
            
            if not current_user or current_user.role != "admin":
                return {"error": "Unauthorized"}, 401

            total_users = Users.query.filter(Users.role == "user").count()
            total_owners = Users.query.filter(Users.role == "court_owner").count()
            total_courts = Courts.query.count()

            all_users = Users.query.filter(Users.role != "admin").all()
            users_info = [
                {
                    "user_id": u.id,
                    "username": u.username,
                    "email": u.email,
                    "role": u.role,
                    "phone": u.phone_number,
                }
                for u in all_users
            ]

            return {
                "total_users": total_users,
                "total_court_owners": total_owners,
                "total_courts": total_courts,
                "users": users_info,
            }, 200

        except Exception as e:
            return {"error": str(e)}, 500


# -----------------------------------
# DELETE USER
# -----------------------------------
@admin_ns.route("/delete-user/<int:user_id>")
class DeleteUser(Resource):
    @jwt_required()
    def delete(self, user_id):
        try:
            current_user_id = get_jwt_identity()
            current_user = Users.query.get(current_user_id)

            if not current_user or current_user.role != "admin":
                return {"error": "Unauthorized"}, 401

            user = Users.query.get_or_404(user_id)

            if user.role == "admin":
                return {"error": "Cannot delete Admin"}, 400

            db.session.delete(user)
            db.session.commit()

            return {"message": f"{user.username} deleted successfully"}, 200

        except Exception as e:
            return {"error": str(e)}, 500


# -----------------------------------
# UPDATE COURT STATUS + SEND EMAIL
# -----------------------------------
@admin_ns.route("/update-court-status/<int:court_id>")
class UpdateCourtStatus(Resource):
    @jwt_required()
    def put(self, court_id):
        try:
            current_user_id = get_jwt_identity()
            current_user = Users.query.get(current_user_id)

            if not current_user or current_user.role != "admin":
                return {"error": "Unauthorized"}, 401

            data = request.get_json()
            new_status = data.get("status")

            if new_status not in ["approved", "rejected", "pending"]:
                return {"error": "Invalid status"}, 400

            court = Courts.query.get(court_id)
            if not court:
                return {"error": "Court not found"}, 404

            court.status = new_status
            db.session.commit()

            # Email Notification
            court_owner = Users.query.get(court.owner_id)
            if court_owner and court_owner.email:
                status_color = {
                    "approved": "#16a34a",
                    "rejected": "#dc2626",
                    "pending": "#f59e0b",
                }.get(new_status, "#000000")

                html_body = f"""
                <div style='font-family: Arial; max-width:600px; margin:auto; padding:20px;'>
                    <h2 style='color:{status_color}; text-align:center;'>Court Status Update</h2>
                    <p>Hello <strong>{court_owner.username}</strong>,</p>
                    <p>Your court '<strong>{court.name}</strong>' status has been updated to:</p>
                    <p style='text-align:center; font-size: 18px; font-weight:bold; color:{status_color};'>
                        {new_status.upper()}
                    </p>
                    <p>Please visit the dashboard for details.</p>
                    <hr/>
                    <p style='font-size: 12px; color: #555;'>Regards,<br>Admin Team</p>
                </div>
                """

                msg = Message(
                    subject=f"Court Status Updated: {new_status.upper()}",
                    recipients=[court_owner.email],
                    html=html_body,
                    sender=os.getenv("DEL_EMAIL"),
                )

                mail.send(msg)

            return {"message": f"Court status updated to {new_status}"}, 200

        except Exception as e:
            return {"error": str(e)}, 500