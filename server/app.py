import os
from datetime import timedelta
from dotenv import load_dotenv
from flask import Flask
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS

from models import db,bcrypt

# Load env vars 
load_dotenv()

# Initialize app 
app = Flask(__name__)

# Config 
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URI")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET")
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=24)

# Extensions 
bcrypt.init_app(app)
jwt = JWTManager(app)
db.init_app(app)
migrate = Migrate(app, db)
CORS(app)



#  Entry Point 
if __name__ == "__main__":
    app.run(port=5555, debug=True)
