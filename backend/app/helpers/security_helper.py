# auth_utils.py
import jwt
import datetime
from functools import wraps
from flask import current_app, request, jsonify, g



def generate_jwt(user_id, username, role):
    """
    Generate a JWT token for a user_id, username, and role with 1 hour expiry.
    """
    try:
        payload = {
            "user_id": user_id,
            "username": username,
            "role": role,
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1),
            "iat": datetime.datetime.utcnow(),
        }
        token = jwt.encode(payload, current_app.config["SECRET_KEY"], algorithm="HS256")
        return token
    except Exception as e:
        raise RuntimeError(f"Failed to generate JWT: {str(e)}")


def verify_jwt(token):
    """
    Verify and decode a JWT token; return the payload if valid.
    Raises ValueError on invalid or expired token.
    """
    try:
        payload = jwt.decode(
            token, current_app.config["SECRET_KEY"], algorithms=["HS256"]
        )
        return payload
    except jwt.ExpiredSignatureError:
        raise ValueError("Token expired. Please log in again")
    except jwt.InvalidTokenError:
        raise ValueError("Invalid token")

# =========================
# GENERIC JWT REQUIRED
# =========================

def jwt_required(f):
    """
    Decorator to check if JWT token is valid. Sets g.user_id.
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return {"status": "error", "message": "Authorization header missing"}, 401

        token = auth_header.split(" ")[1]

        try:
            payload = verify_jwt(token)
            g.user_id = payload["user_id"]
            g.user_role = payload.get("role")
            return f(*args, **kwargs)
        except ValueError as e:
            return {"status": "error", "message": str(e)}, 401

    return decorated_function

# =========================
# ROLE-BASED DECORATORS
# =========================

def admin_required(f):
    """
    Decorator to enforce admin role.
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return jsonify({"status": "error", "message": "Authorization header missing"}), 401

        token = auth_header.split(" ")[1]

        try:
            payload = verify_jwt(token)
            if payload.get("role") != "admin":
                return jsonify({"status": "error", "message": "Admins only"}), 403
            g.user_id = payload["user_id"]
            g.user_role = payload.get("role")
            return f(*args, **kwargs)
        except ValueError as e:
            return jsonify({"status": "error", "message": str(e)}), 401

    return decorated_function


def court_owner_required(f):
    """
    Decorator to enforce court_owner role.
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return jsonify({"status": "error", "message": "Authorization header missing"}), 401

        token = auth_header.split(" ")[1]

        try:
            payload = verify_jwt(token)
            if payload.get("role") != "court_owner":
                return jsonify({"status": "error", "message": "Court owners only"}), 403
            g.user_id = payload["user_id"]
            g.user_role = payload.get("role")
            return f(*args, **kwargs)
        except ValueError as e:
            return jsonify({"status": "error", "message": str(e)}), 401

    return decorated_function


def user_required(f):
    """
    Decorator to enforce normal user role.
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return jsonify({"status": "error", "message": "Authorization header missing"}), 401

        token = auth_header.split(" ")[1]

        try:
            payload = verify_jwt(token)
            if payload.get("role") != "user":
                return jsonify({"status": "error", "message": "Users only"}), 403
            g.user_id = payload["user_id"]
            g.user_role = payload.get("role")
            return f(*args, **kwargs)
        except ValueError as e:
            return jsonify({"status": "error", "message": str(e)}), 401

    return decorated_function
