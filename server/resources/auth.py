from flask import request
from flask_restful import Resource
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
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
        role_name = data.get("role", "User")  # default role = User

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

            # role-based redirect
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

        # REGISTER (Admin only)
       
        elif action == "register":
            @jwt_required()
            def register_user():
                current_user_id = get_jwt_identity()
                current_user = User.query.get(current_user_id)
                if not current_user or current_user.role.role_name != "Admin":
                    return {"error": "Admin privileges required"}, 403

                # validate new user data
                if not first_name or not last_name:
                    return {"error": "First and last name are required"}, 400
                if User.query.filter_by(email=email).first():
                    return {"error": "Email already exists"}, 409

                # get role
                role = Role.query.filter_by(role_name=role_name).first()
                if not role:
                    return {"error": f"Role '{role_name}' does not exist"}, 400

                # create user
                new_user = User(
                    first_name=first_name,
                    last_name=last_name,
                    email=email,
                    role=role
                )
                new_user.set_password(password)

                db.session.add(new_user)
                db.session.commit()

                return {
                    "user": {
                        "id": new_user.id,
                        "email": new_user.email,
                        "full_name": new_user.full_name,
                        "role": new_user.role.role_name
                    },
                    "message": "User created successfully"
                }, 201

            return register_user()  

        # UNSUPPORTED ACTION
        
        else:
            return {"error": "Unsupported auth action"}, 400
