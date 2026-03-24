from flask import request
from flask_restx import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity,get_jwt
from datetime import datetime
from sqlalchemy.exc import IntegrityError
from app import bookings_ns, db,mail
from app.models.cf_models import Bookings, Courts,Users  # Make sure your models are correct
from flask_mail import Message
import os
# -------------------------------
# Helper function to serialize booking with court details
# -------------------------------
def booking_to_dict(booking, court=None):
    result = {
        "id": booking.id,
        "user_id": booking.user_id,
        "court_id": booking.court_id,
        "booking_date": booking.booking_date.isoformat(),
        "start_time": booking.start_time.strftime("%H:%M"),
        "end_time": booking.end_time.strftime("%H:%M"),
        "booking_status": booking.booking_status,
        "advance_payment": float(booking.advance_payment),
        "total_amount": float(booking.total_amount),
        "remaining_cash": float(booking.remaining_cash),
        "cancellation_reason": booking.cancellation_reason,
        "created_at": booking.created_at.isoformat(),
    }
    if court:
        result["court"] = {
            "id": court.id,
            "name": court.name,
            "location": court.location,
            "hourly_rate": float(court.hourly_rate),
            "maintenance": float(court.maintenance) if court.maintenance else 0,
            "status": court.status,
            "type": court.type,
            "opening_time": court.opening_time.strftime("%H:%M"),
            "closing_time": court.closing_time.strftime("%H:%M"),
            "description": court.description,
            "image_url": court.image_url,
        }
    return result

# -------------------------------
# Create a new booking
# -------------------------------
@bookings_ns.route("/create")
class CreateBooking(Resource):
    @jwt_required()
    def post(self):
        user_id = int(get_jwt_identity())
        data = request.json

        try:
            # -------------------------
            # Parse date/time
            # -------------------------
            booking_date = datetime.strptime(data["booking_date"], "%Y-%m-%d").date()
            start_time = datetime.strptime(data["start_time"], "%H:%M").time()
            end_time = datetime.strptime(data["end_time"], "%H:%M").time()

            # -------------------------
            # Fetch court by ID
            # -------------------------
            court = Courts.query.get_or_404(data["court_id"])

            total_amount = float(court.hourly_rate)
            advance_payment = 0.00
            remaining_cash = total_amount - advance_payment

            # -------------------------
            # Create booking
            # -------------------------
            booking = Bookings(
                user_id=user_id,
                court_id=court.id,
                booking_date=booking_date,
                start_time=start_time,
                end_time=end_time,
                total_amount=total_amount,
                advance_payment=advance_payment,
                remaining_cash=remaining_cash,
                booking_status="pending"
            )

            db.session.add(booking)
            db.session.commit()

            # -------------------------
            # Fetch user & owner USING IDs
            # -------------------------
            user = Users.query.get(user_id)
            owner = Users.query.get(court.owner_id)  # <--- Court owner id

            # -------------------------
            # Email to the user
            # -------------------------
            msg_user = Message(
                subject="Courtify: Booking Received",
                sender=os.getenv("DEL_EMAIL"),
                recipients=[user.email]
            )

            msg_user.html = f"""
            <div style="font-family:Arial,sans-serif; max-width:600px; margin:20px auto; padding:20px; background-color:#f9f9f9; border-radius:8px; text-align:center;">
                <h2 style="color:#4f46e5;">Hello {user.username}!</h2>
                <p>Thank you for booking <strong>{court.name.title()}</strong>.</p>
                <p>Your booking is <strong>pending approval</strong> from the court owner.</p>
                <p>
                    <strong>Date:</strong> {booking.booking_date}<br/>
                    <strong>Time:</strong> {booking.start_time.strftime('%H:%M')} - {booking.end_time.strftime('%H:%M')}<br/>
                    <strong>Total Amount:</strong> ${booking.total_amount}
                </p>
            </div>
            """

            mail.send(msg_user)

            # -------------------------
            # Email to court owner
            # -------------------------
            msg_owner = Message(
                subject="Courtify: New Booking Request",
                sender=os.getenv("DEL_EMAIL"),
                recipients=[owner.email]
            )

            msg_owner.html = f"""
            <div style="font-family:Arial,sans-serif; max-width:600px; margin:20px auto; padding:20px; background-color:#f9f9f9; border-radius:8px; text-align:center;">
                <h2 style="color:#4f46e5;">Hello {owner.username}!</h2>
                <p>A new booking request has been made for your court <strong>{court.name.title()}</strong>.</p>
                <p>
                    <strong>User:</strong> {user.username} ({user.email})<br/>
                    <strong>Date:</strong> {booking.booking_date}<br/>
                    <strong>Time:</strong> {booking.start_time.strftime('%H:%M')} - {booking.end_time.strftime('%H:%M')}<br/>
                    <strong>Total Amount:</strong> ${booking.total_amount}
                </p>
            </div>
            """

            mail.send(msg_owner)

            # -------------------------
            # Success Response
            # -------------------------
            return {
                "message": "Booking created successfully",
                "booking": booking_to_dict(booking)
            }, 201

        except IntegrityError:
            db.session.rollback()
            return {"error": "Court is already booked for this slot"}, 409

        except KeyError as e:
            return {"error": f"Missing field {str(e)}"}, 400

        except ValueError as e:
            return {"error": "Invalid date/time format", "details": str(e)}, 400

        except Exception as e:
            db.session.rollback()
            return {"error": "Failed to create booking", "details": str(e)}, 500


# -------------------------------
# Get all bookings for current user (with court info)
# -------------------------------
@bookings_ns.route("/mybookings")
class MyBookings(Resource):
    @jwt_required()
    def get(self):
        user_id = int(get_jwt_identity())

        # Fetch bookings with related court
        bookings = (
            db.session.query(Bookings, Courts)
            .join(Courts, Bookings.court_id == Courts.id)
            .filter(Bookings.user_id == user_id)
            .all()
        )

        result = [booking_to_dict(b, c) for b, c in bookings]
        return {"bookings": result}, 200

# -------------------------------
# Get booking by id
# -------------------------------
@bookings_ns.route("/<int:booking_id>")
class BookingById(Resource):
    @jwt_required()
    def get(self, booking_id):
        booking = Bookings.query.get_or_404(booking_id)
        court = Courts.query.get(booking.court_id)
        return {"booking": booking_to_dict(booking, court)}, 200

# -------------------------------
# Cancel booking with reason
# -------------------------------
from flask_mail import Message
import os

@bookings_ns.route("/cancel/<int:booking_id>")
class CancelBooking(Resource):
    @jwt_required()
    def put(self, booking_id):
        booking = Bookings.query.get_or_404(booking_id)
        data = request.json or {}

        # Debugging
        print("DEBUG: Current booking status =", booking.booking_status)

        if booking.booking_status in ["completed", "cancelled"]:
            return {"error": "This booking cannot be cancelled."}, 400

        try:
            # Update booking status
            booking.booking_status = "cancelled"
            booking.cancellation_reason = data.get("cancellation_reason", "")
            db.session.commit()

            # Fetch court + owner
            court = Courts.query.get(booking.court_id)
            owner = Users.query.get(court.owner_id)

            owner_email = owner.email if owner else None
            owner_name = owner.username if owner else "Court Owner"

            
            msg = Message(
                subject=f"Booking #{booking.id} Cancelled",
                sender=os.getenv("MAIL_USERNAME"),
                recipients=[owner_email],
            )

            msg.html = f"""
            <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
                <h2 style="color: #BF5C10;">Booking Cancelled</h2>

                <p>Hello <strong>{owner_name}</strong>,</p>

                <p>The booking <strong>#{booking.id}</strong> for your court 
                "<strong>{court.name}</strong>" has been 
                <span style="color: red; font-weight: bold;">cancelled</span> by the user.</p>

                <p><strong>Reason:</strong> {booking.cancellation_reason or 'No reason provided'}</p>

                <hr style="border: none; border-top: 1px solid #ccc;"/>

                <p style="color: #555;">Best regards,<br/>Courtify Team</p>
            </div>
            """

            mail.send(msg)

            return {
                "message": "Booking cancelled & email sent.",
                "booking": booking_to_dict(booking, court),
            }, 200

        except Exception as e:
            db.session.rollback()
            return {
                "error": "Failed to cancel booking",
                "details": str(e),
            }, 500


@bookings_ns.route("/bycourt/<int:court_id>")
class BookingsByCourt(Resource):
    @jwt_required()
    def get(self, court_id):
        try:
            # Court exists?
            court = Courts.query.get_or_404(court_id)

            # Only ACTIVE bookings fetch karo
            active_status = ["pending", "approved"]

            bookings = (
                Bookings.query
                .filter(
                    Bookings.court_id == court_id,
                    Bookings.booking_status.in_(active_status)
                )
                .all()
            )

            result = [booking_to_dict(b, court) for b in bookings]

            return {"bookings": result}, 200

        except Exception as e:
            return {
                "error": "Failed to fetch bookings for this court",
                "details": str(e)
            }, 500

        
@bookings_ns.route("/all-with-courts")
class AllBookingsWithCourts(Resource):
    @jwt_required()
    def get(self):
        try:
            owner_id = int(get_jwt_identity())

            
            records = (
                db.session.query(Bookings, Courts, Users)
                .join(Courts, Bookings.court_id == Courts.id)
                .join(Users, Bookings.user_id == Users.id)
                .filter(Courts.owner_id == owner_id)   # Only owner’s courts
                .all()
            )

            result = []
            for booking, court, user in records:
                # merge user info
                data = booking_to_dict(booking, court)
                data["user"] = {
                    "id": user.id,
                    "name": user.username,
                    "email": user.email,
                    "phone": user.phone_number if hasattr(user, "phone") else None
                }
                result.append(data)

            return {"bookings": result}, 200

        except Exception as e:
            return {"error": "Failed to fetch bookings", "details": str(e)}, 500
        

@bookings_ns.route("/reject/<int:booking_id>")
class RejectBooking(Resource):
    @jwt_required()
    def put(self, booking_id):
        data = request.json or {}
        
        user_id = int(get_jwt_identity())
        claims = get_jwt()
        role = claims.get("role")

        booking = Bookings.query.get_or_404(booking_id)
        court = Courts.query.get_or_404(booking.court_id)

        try:
            if role != "court_owner":
                return {"error": "Only court owners can reject bookings"}, 403

            if court.owner_id != user_id:
                return {"error": "You do not own this court"}, 403

            # Update status
            booking.booking_status = "rejected"
            booking.cancellation_reason = data.get("cancellation_reason", "")
            db.session.commit()

            # -------------------------
            # Send email to user
            # -------------------------
            user = Users.query.get(booking.user_id)

            msg_user = Message(
                subject="Courtify: Booking Rejected",
                sender=os.getenv("DEL_EMAIL"),
                recipients=[user.email]
            )

            msg_user.html = f"""
            <div style="font-family:Arial; max-width:600px; margin:20px auto; padding:20px; background:#ffe6e6; border-radius:8px;">
                <h2 style="color:#d32f2f; text-align:center;">Booking Rejected</h2>
                <p>Hello {user.username},</p>
                <p>Your booking for <strong>{court.name.title()}</strong> has been <strong>rejected</strong>.</p>

                <p><strong>Date:</strong> {booking.booking_date}<br/>
                <strong>Time:</strong> {booking.start_time} - {booking.end_time}</p>

                <p><strong>Reason:</strong> {booking.cancellation_reason or "No reason provided"}</p>
            </div>
            """

            mail.send(msg_user)

            return {
                "message": "Booking rejected successfully",
                "booking": booking_to_dict(booking, court)
            }, 200

        except Exception as e:
            db.session.rollback()
            return {"error": "Failed to reject booking", "details": str(e)}, 500

        

@bookings_ns.route("/approve/<int:booking_id>")
class ApproveBooking(Resource):
    @jwt_required()
    def put(self, booking_id):
        user_id = int(get_jwt_identity())
        claims = get_jwt()
        role = claims.get("role")

        booking = Bookings.query.get_or_404(booking_id)
        court = Courts.query.get_or_404(booking.court_id)

        try:
            if role != "court_owner":
                return {"error": "Only court owners can approve bookings"}, 403

            if court.owner_id != user_id:
                return {"error": "You do not own this court"}, 403

            # Update booking
            booking.booking_status = "approved"
            db.session.commit()

            # -------------------------
            # Email to user
            # -------------------------
            user = Users.query.get(booking.user_id)

            msg_user = Message(
                subject="Courtify: Booking Approved",
                sender=os.getenv("DEL_EMAIL"),
                recipients=[user.email]
            )

            msg_user.html = f"""
            <div style="font-family:Arial; max-width:600px; margin:20px auto; padding:20px; background:#e8f5e9; border-radius:8px;">
                <h2 style="color:#2e7d32; text-align:center;">Booking Approved</h2>
                <p>Hello {user.username},</p>
                <p>Your booking for <strong>{court.name.title()}</strong> has been <strong>approved</strong>!</p>

                <p><strong>Date:</strong> {booking.booking_date}<br/>
                <strong>Time:</strong> {booking.start_time} - {booking.end_time}</p>
            </div>
            """

            mail.send(msg_user)

            return {
                "message": "Booking approved successfully",
                "booking": booking_to_dict(booking, court)
            }, 200

        except Exception as e:
            db.session.rollback()
            return {"error": "Failed to approve booking", "details": str(e)}, 500