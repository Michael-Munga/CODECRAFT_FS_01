from app import app, db
from models import Role, User

with app.app_context():
  
    roles = ["Admin", "User"]
    for role_name in roles:
        role = Role.query.filter_by(role_name=role_name).first()
        if not role:
            role = Role(role_name=role_name)
            db.session.add(role)
    db.session.commit()

    # Fetch roles
    admin_role = Role.query.filter_by(role_name="Admin").first()
    user_role = Role.query.filter_by(role_name="User").first()

 
    users = [
        {"first_name": "James", "last_name": "Mwangi", "email": "james.mwangi@gmail.com", "password": "password123", "role": admin_role},
        {"first_name": "Grace", "last_name": "Njeri", "email": "grace.njeri@yahoo.com", "password": "password123", "role": admin_role},
        {"first_name": "Peter", "last_name": "Otieno", "email": "peter.otieno@hotmail.com", "password": "password123", "role": user_role},
        {"first_name": "Aisha", "last_name": "Abdi", "email": "aisha.abdi@gmail.com", "password": "password123", "role": user_role},
    ]

    for u in users:
        if not User.query.filter_by(email=u["email"]).first():
            new_user = User(
                first_name=u["first_name"],
                last_name=u["last_name"],
                email=u["email"],
                role=u["role"]
            )
            new_user.set_password(u["password"])
            db.session.add(new_user)

    db.session.commit()
    print("Roles and users seeded successfully!")
