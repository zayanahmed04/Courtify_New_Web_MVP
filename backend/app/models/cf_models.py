from app import db

from sqlalchemy.dialects.postgresql import ENUM
from decimal import Decimal
from datetime import time, datetime

# ENUMS
user_role_enum = ENUM("user", "admin", "court_owner", name="user_role", create_type=True)
court_status_enum = ENUM("approved", "rejected", "pending", name="court_status", create_type=True)
booking_status_enum = ENUM("approved", "rejected", "completed", "pending", "cancelled", "confirmed", name="booking_status", create_type=True)
payment_method_enum = ENUM("stripe", "card", name="payment_method", create_type=True)

# 🔥 notification ENUM removed


# =========================
# Users Table
# =========================
class Users(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    img_url=db.Column(db.String(100),nullable=True)
    username = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(150), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    phone_number = db.Column(db.String(20), nullable=True)
    gender = db.Column(db.String(10))
    role = db.Column(user_role_enum, nullable=False)
    date_joined = db.Column(db.DateTime, default=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)

    courts = db.relationship("Courts", backref="owner",
                             cascade="all, delete-orphan", passive_deletes=True)

    bookings = db.relationship("Bookings", backref="user",
                               cascade="all, delete-orphan", passive_deletes=True)

    payments = db.relationship("Payments", backref="payer",
                               cascade="all, delete-orphan", passive_deletes=True)

    # 🔥 notifications relationship removed

    matchmaking = db.relationship("Matchmaking", backref="match_user",
                                  cascade="all, delete-orphan", passive_deletes=True)

    favourites = db.relationship("Favourites", backref="fav_user",
                                 cascade="all, delete-orphan", passive_deletes=True)

    reviews = db.relationship("Reviews", backref="review_user",
                              cascade="all, delete-orphan", passive_deletes=True)


# =========================
# Courts Table
# =========================
class Courts(db.Model):
    __tablename__ = "courts"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    location = db.Column(db.String(255), nullable=False)
    hourly_rate = db.Column(db.Numeric(10, 2), nullable=False)
    maintenance = db.Column(db.Boolean, default=False)
    status = db.Column(court_status_enum, nullable=False, default="approved")
    type = db.Column(db.String(50))
    owner_id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    opening_time = db.Column(db.Time, nullable=False)
    closing_time = db.Column(db.Time, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    description = db.Column(db.Text)
    image_url = db.Column(db.String(255))

    def to_dict(self):
        def format_time(t):
            if isinstance(t, (time, datetime)):
                return t.strftime("%H:%M")
            return t

        return {
            "id": self.id,
            "name": self.name,
            "location": self.location,
            "hourly_rate": float(self.hourly_rate) if isinstance(self.hourly_rate, Decimal) else self.hourly_rate,
            "maintenance": float(self.maintenance) if isinstance(self.maintenance, Decimal) else self.maintenance,
            "status": self.status,
            "type": self.type,
            "opening_time": format_time(self.opening_time),
            "closing_time": format_time(self.closing_time),
            "description": self.description,
            "image_url": self.image_url
        }

    bookings = db.relationship("Bookings", backref="court",
                               cascade="all, delete-orphan", passive_deletes=True)

    favourites = db.relationship("Favourites", backref="fav_court",
                                 cascade="all, delete-orphan", passive_deletes=True)

    reviews = db.relationship("Reviews", backref="review_court",
                              cascade="all, delete-orphan", passive_deletes=True)


class Bookings(db.Model):
    __tablename__ = "bookings"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    court_id = db.Column(db.Integer, db.ForeignKey("courts.id", ondelete="CASCADE"), nullable=False)
    booking_date = db.Column(db.Date, nullable=False)
    start_time = db.Column(db.Time, nullable=False)
    end_time = db.Column(db.Time, nullable=False)
    booking_status = db.Column(booking_status_enum, nullable=False, default="pending")
    advance_payment = db.Column(db.Numeric(10, 2), nullable=False, default=0.00)
    total_amount = db.Column(db.Numeric(10, 2), nullable=False, default=0.00)
    remaining_cash = db.Column(db.Numeric(10, 2), nullable=False, default=0.00)
    cancellation_reason = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    __table_args__ = (
        db.UniqueConstraint(
            'court_id',
            'booking_date',
            'start_time',
            'end_time',
            name='unique_slot'
        ),
    )

    payments = db.relationship("Payments", backref="booking",
                               cascade="all, delete-orphan", passive_deletes=True)



class Payments(db.Model):
    __tablename__ = "payments"

    id = db.Column(db.Integer, primary_key=True)
    booking_id = db.Column(db.Integer, db.ForeignKey("bookings.id", ondelete="CASCADE"), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    amount = db.Column(db.Numeric(10, 2), nullable=False, default=0.00)
    payment_method = db.Column(payment_method_enum, nullable=False)
    transaction_id = db.Column(db.String(100))
    payment_status = db.Column(db.String(20), nullable=False, default="pending")
    payment_date = db.Column(db.DateTime, default=datetime.utcnow)
    currency = db.Column(db.String(10), nullable=False, default="USD")


class Matchmaking(db.Model):
    __tablename__ = "matchmaking"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    sport = db.Column(db.String(50), nullable=False)
    location = db.Column(db.String(255), nullable=False)
    date_time = db.Column(db.DateTime, nullable=False)
    contact_number = db.Column(db.String(20))
    match_details = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


# =========================
# Favourites Table
# =========================
class Favourites(db.Model):
    __tablename__ = "favourites"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    court_id = db.Column(db.Integer, db.ForeignKey("courts.id", ondelete="CASCADE"), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class Reviews(db.Model):
    __tablename__ = "reviews"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    court_id = db.Column(db.Integer, db.ForeignKey("courts.id", ondelete="CASCADE"), nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
