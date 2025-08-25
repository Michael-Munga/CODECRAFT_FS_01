from flask import request
from flask_restful import Resource
from flask_jwt_extended import create_access_token
from models import User, Role, db
import re

EMAIL_RE = re.compile(r"^[\w\.-]+@[\w\.-]+\.\w+$")

class AuthResource(Resource):
    def post(self, action):
        data = request.get_json() or {}
        email = data.get("email", "").strip().lower()
        password = data.get("password", "")
        first_name = data.get("first_name", "").strip()
        last_name = data.get("last_name", "").strip()

        # Validate email and password presence
        if not email or not password:
            return {"error": "Email and password are required"}, 400
        if not EMAIL_RE.match(email):
            return {"error": "Invalid email format"}, 400

        # LOGIN
        
        if action == "login":
            user = User.query.filter_by(email=email).first()
            if not user or not user.check_password(password):
                return {"error": "Invalid email or password"}, 401

            token = create_access_token(identity=user.id)

            redirect_url = "/admin/dashboard" if user.role.role_name == "Admin" else "/user/dashboard"

            return {
                "user": {
                    "id": user.id,
                    "email": user.email,
                    "full_name": user.full_name,
                    "role": user.role.role_name
                },
                "access_token": token,
                "redirect_url": redirect_url
            }, 200

        # REGISTER (self-signup only normal users)
        elif action == "register":
            if not first_name or not last_name:
                return {"error": "First and last name are required"}, 400
            if User.query.filter_by(email=email).first():
                return {"error": "Email already exists"}, 409

            # Assign default "User" role
            role = Role.query.filter_by(role_name="User").first()
            if not role:
                return {"error": "Default role 'User' does not exist"}, 500

            new_user = User(
                first_name=first_name,
                last_name=last_name,
                email=email,
                role=role
            )
            new_user.set_password(password)

            db.session.add(new_user)
            db.session.commit()

            token = create_access_token(identity=new_user.id)

            return {
                "user": {
                    "id": new_user.id,
                    "email": new_user.email,
                    "full_name": new_user.full_name,
                    "role": new_user.role.role_name
                },
                "access_token": token,
                "redirect_url": "/user/dashboard",
                "message": "User signed up successfully"
            }, 201

        # UNSUPPORTED ACTION
        else:
            return {"error": "Unsupported auth action"}, 400
