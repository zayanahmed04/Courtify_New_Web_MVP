from flask_restx import Resource
from flask import request,render_template_string
from app import payments_ns, db,mail
from app.models.cf_models import Payments,Bookings,Users
import stripe
import os
from flask_mail import Message

from datetime import datetime
from dotenv import load_dotenv
from flask_jwt_extended import jwt_required, get_jwt_identity
load_dotenv()
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
frontend_url = os.getenv("FRONTEND_URL")

payment_email_template = """
<!DOCTYPE html>
<html>
<body style="font-family:Arial; background:#f5f5f5; padding:20px;">
  <div style="max-width:600px; margin:auto; background:white; padding:25px; border-radius:10px;">
  
    <h2 style="text-align:center; color:#4CAF50;">Payment Received 🎉</h2>
    
    <p>Hi {{name}},</p>
    
    <p>
      We have successfully received your payment for booking <b>#{{booking_id}}</b>.
    </p>

    <div style="background:#f0f0f0; padding:15px; border-radius:8px; margin:20px 0;">
      <p><b>Amount Paid:</b> {{amount}} PKR</p>
      <p><b>Status:</b> Confirmed ✔</p>
    </div>

    <p>
      You can view full booking details on your dashboard:
    </p>

    <a href="http://localhost:5173/user/dashboard" 
       style="display:inline-block; padding:12px 20px; background:#4CAF50; color:white; text-decoration:none; border-radius:6px;">
       View Dashboard
    </a>

    <br><br>

    <p>Thank you for booking with Courtify! 🏆</p>

  </div>
</body>
</html>
"""

def send_payment_email(to, name, amount, booking_id):
    html_body = render_template_string(
        payment_email_template,
        name=name,
        amount=amount,
        booking_id=booking_id
    )

    msg = Message(
        subject="Courtify — Payment Received ✔",
        recipients=[to],
        html=html_body,
        sender=os.getenv("MAIL_USERNAME")
    )

    mail.send(msg)

@payments_ns.route("/create-session")
class CreateCheckoutSession(Resource):
    @jwt_required()
    def post(self):
        

        data = request.json
        user_id = int(get_jwt_identity())  
        user=Users.query.get(user_id)
        print("Creating Stripe session with:", data, "user:", user.email)
        try:
            booking_id = data.get("booking_id")
            amount = float(data.get("amount", 0.0))
            currency = data.get("currency", "PKR")
            payment_method = data.get("payment_method", "card")  # enum: card, cash, etc.

          
            session = stripe.checkout.Session.create(
                payment_method_types=["card"],
                mode="payment",
                line_items=[
                    {
                        "price_data": {
                            "currency": currency.lower(),
                            "product_data": {
                                "name": data.get("court_name", "Court Booking")
                            },
                            "unit_amount": int(amount * 100),  # Stripe cents
                        },
                        "quantity": 1,
                    }
                ],
                metadata={
                    "booking_id": str(booking_id),
                    "user_id": str(user_id)
                },
                success_url=frontend_url+"/success",
                cancel_url= frontend_url + "/cancel",
                customer_email=user.email
            
            )

            
            payment = Payments(
                booking_id=booking_id,
                user_id=user_id,
                amount=amount,
                currency=currency,
                payment_method=payment_method,
                transaction_id=session.id,  # Stripe session ID
                payment_status="pending",
                payment_date=datetime.utcnow()
            )

            db.session.add(payment)
            db.session.commit()

            # 3️⃣ Return Stripe session URL to frontend
            return {"url": session.url}

        except Exception as e:
            return {"error": str(e)}, 400
        

@payments_ns.route("/webhook")
class StripeWebhook(Resource):
    def post(self):
        payload = request.get_data()
        sig_header = request.headers.get("Stripe-Signature")
        endpoint_secret =  os.getenv("STRIPE_WEBHOOK_SECRET")# or from .env

        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, endpoint_secret
            )
        except ValueError:
            return {"error": "Invalid payload"}, 400
        except stripe.error.SignatureVerificationError:
            return {"error": "Invalid signature"}, 400

        if event["type"] == "checkout.session.completed":
            session = event["data"]["object"]

            booking_id = session.get("metadata", {}).get("booking_id")
            user_id = session.get("metadata", {}).get("user_id")

            if booking_id and user_id:
                payment = Payments.query.filter_by(
                    booking_id=booking_id,
                    user_id=user_id,
                    transaction_id=session.get("id")
                ).first()
                user = Users.query.get(int(user_id))


                if payment:
                    payment.payment_status = "paid"
                    payment.payment_date = datetime.utcnow()
                    db.session.commit()

               

            send_payment_email(
            to=user.email,
            name=user.username,
            amount=payment.amount,
            booking_id=booking_id
            )

        return {"message": "success"}, 200
