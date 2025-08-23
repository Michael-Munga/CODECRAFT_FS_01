from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from sqlalchemy_serializer import SerializerMixin
from flask_bcrypt import Bcrypt

# naming convention
db = SQLAlchemy(metadata=MetaData(naming_convention={
    "ix": "ix_%(column_0_label)s",
    "uq": "uq_%(table_name)s_%(column_0_name)s",
    "ck": "ck_%(table_name)s_%(constraint_name)s",
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    "pk": "pk_%(table_name)s"
}))
bcrypt = Bcrypt()
# user model
# ----------------------

class User(db.Model,SerializerMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer,primary_key= True)
    first_name = db.Column(db.String(50), nullable = False)
    last_name = db.Column(db.String(50), nullable = False)
    email = db.Column(db.String(100) ,unique=True ,nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    
    role_id = db.Column(db.Integer, db.ForeignKey('roles.id'), nullable=False)

    role = db.relationship("Role", back_populates="users")

    serialize_rules = ('-password_hash', '-role.users',)

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"
    
    # password methods
    def set_password(self, password):
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)
  
    

# role model
# ----------------------
class Role(db.Model, SerializerMixin):
    __tablename__ = 'roles'

    id = db.Column(db.Integer, primary_key=True)
    role_name = db.Column(db.String(50), unique=True, nullable=False)

    # one to many---> one role many users
    users = db.relationship("User", back_populates="role")

    