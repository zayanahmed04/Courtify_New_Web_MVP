from app import users_ns, db, bcrypt,mail
from flask import request, jsonify, Response,json
from flask_restx import Resource
from app.fields.usersFields import users_data
from app.models.cf_models import Users
from flask_jwt_extended import create_access_token, set_access_cookies, jwt_required, get_jwt_identity, get_jwt
from datetime import timedelta
from dotenv import load_dotenv
from flask_mail import Mail,Message
import os

load_dotenv()
# --------------------------
# LOGIN ROUTE
# --------------------------

@users_ns.route("/login")
class LoginUser(Resource):
    @users_ns.doc('login a user')
    @users_ns.expect(users_data)
    def post(self):
        data = request.get_json()
        email = data.get("email")
        password = data.get("password")

        user = Users.query.filter_by(email=email).first()
        if user and bcrypt.check_password_hash(user.password_hash, password):
            # Generate JWT
            access_token = create_access_token(
                identity=str (user.id),
                additional_claims={"role": user.role},
                expires_delta=timedelta(hours=24)
            )


            # Prepare JSON data manually
            response_data = {
                "status": "success",
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "role": user.role,
                    "token": access_token
                }
            }

            # Create Response object manually
            response = Response(
                response=json.dumps(response_data),
                status=200,
                mimetype='application/json'
            )

            # Set HTTP-only cookie
            response.set_cookie(
                "access_token_cookie",  # must match JWT config
                access_token,
                httponly=True,
                secure=True,   # True in production with HTTPS
                samesite="None",
                max_age=24*3600,
                path="/"
            )

            return response
        
        else:
            error_response = Response(
                response=json.dumps({"status": "error", "message": "Invalid credentials"}),
                status=401,
                mimetype='application/json'
            )
            return error_response
# --------------------------
# LOGOUT ROUTE
# --------------------------
@users_ns.route('/logout')
class UserLogout(Resource):
    @users_ns.doc('logout a user')
    @jwt_required()  # parentheses required
    def post(self):
        response = jsonify({"status": "success", "message": "Logged out successfully"})
        # Clear the cookie
        response.delete_cookie("access_token_cookie")
        return response, 200

# --------------------------
# REGISTER ROUTE
# --------------------------
@users_ns.route('/register')
class RegisterUser(Resource):
    @users_ns.doc('register a new user')
    @users_ns.expect(users_data)
    def post(self):
        try:
            data = request.get_json() or {}

            # Validation
            if not data.get("username"):
                return {"status": "error", "message": "Username is required"}, 400
            if not data.get("email"):
                return {"status": "error", "message": "Email is required"}, 400
            if not data.get("password"):
                return {"status": "error", "message": "Password is required"}, 400
            if not data.get("phone_number"):
                return {"status": "error", "message": "Phone Number is required"}, 400

            role = data.get("role")
            if role not in ["user", "admin", "court_owner"]:
                return {"status": "error", "message": "Invalid role specified"}, 400

            existing_user = Users.query.filter_by(email=data["email"]).first()
            if existing_user:
                return {"status": "error", "message": "Email already registered"}, 400

            hashed_password = bcrypt.generate_password_hash(data["password"]).decode('utf-8')

            new_user = Users(
                username=data["username"],
                email=data["email"],
                password_hash=hashed_password,
                role=role,
                phone_number=data["phone_number"]
            )

            db.session.add(new_user)
            db.session.commit()
            msg=Message(subject="Welcome to Courtify",sender=os.getenv("DEL_EMAIL"),recipients=[new_user.email])
            msg.body=f"Hello {new_user.username},\n\nThank you for registering at Courtify! We're excited to have you on board.\n\nBest regards,\nCourtify Team"
            mail.send(msg)

            return {
                "status": "success",
                "message": "User registered successfully",
                "user": {
                    "id": new_user.id,
                    "username": new_user.username,
                    "email": new_user.email,
                    "role": new_user.role
                }
            }, 201

        except Exception as e:
            db.session.rollback()
            return {"status": "error", "message": str(e)}, 500
        
        

@users_ns.route('/current')
class CurrentUser(Resource):
    @users_ns.doc('current user')
    @jwt_required()  
    def get(self):
        user_id = get_jwt_identity()
        user = Users.query.get(int(user_id))
        if not user:
            return {"status": "error", "message": "User not found"}, 404

        return {
            "status": "success",
            "user": {
                "img_url":user.img_url,
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "role": user.role,
                "gender":user.gender,
                "phone_number":user.phone_number
            }
        }, 200
    
@users_ns.route('/update')
class UpdateUser(Resource):
    @jwt_required()
    def put(self):
        user_id = get_jwt_identity()
        user = Users.query.get(int(user_id))

        if not user:
            return {"message": "User not found"}, 404

        data = request.get_json()

        # Allowed fields only (role not allowed)
        allowed_fields = ["img_url", "username", "email", "phone_number", "gender"]

        # --------- Email Duplication Check ---------
        if "email" in data and data["email"] != user.email:
            email_exists = Users.query.filter_by(email=data["email"]).first()
            if email_exists:
                return {"message": "Email already taken"}, 400

        # --------- Update Fields ---------
        for field in allowed_fields:
            if field in data:
                setattr(user, field, data[field])

        try:
            db.session.commit()
            return {
                "message": "User updated successfully",
                "user": {
                    "id": user.id,
                    "img_url": user.img_url,
                    "username": user.username,
                    "email": user.email,
                    "phone_number": user.phone_number,
                    "gender": user.gender,
                    
                   
                }
            }, 200

        except Exception as e:
            db.session.rollback()
            return {"message": "Error while updating user", "error": str(e)}, 500
