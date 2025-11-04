from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from dotenv import load_dotenv
from werkzeug.security import generate_password_hash, check_password_hash
from flask_mail import Mail, Message
from flask_apscheduler import APScheduler
from datetime import datetime
from pathlib import Path
from flask import current_app
import os


# create database globally
database = SQLAlchemy()


class TimeCapsuleApp:
    # Initialize app for time capsule
    def __init__(self):
        self.app, self.database = self.initialize_app()

    def initialize_app(self):
        load_dotenv()
        print(os.getenv("SECRET_KEY"))

        app = Flask(__name__)

        #Configure settings for database and security
        app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///timecapsule.db"
        app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
        app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
        app.config["UPLOAD_FOLDER"] = os.path.join(os.getcwd(), "uploads")

        #Configure settings for the mail server
        app.config["MAIL_SERVER"] = "smtp.gmail.com"
        app.config["MAIL_PORT"] = 587
        app.config["MAIL_USE_TLS"] = True
        app.config["MAIL_USERNAME"] = os.getenv("MAIL_USERNAME")
        app.config["MAIL_PASSWORD"] = os.getenv("MAIL_PASSWORD")

        database.init_app(app)  
        jwt = JWTManager(app)

        return app, database


# Class to initialize database with user id, username, and password
class User(database.Model):
    id = database.Column(database.Integer, primary_key=True)
    username = database.Column(database.String(80), unique=True, nullable=False)
    password = database.Column(database.String(200), nullable=False)

    #Receive and extract username and password 
    @app.route('/login', methods=['POST'])
    def login():
        try:
            data = request.get_json() 

            username = data.get("username")  # safe access
            password = data.get("password")
            user = User.login_user(username, password)
            if user:
                token = create_access_token(identity=user.id)
                return jsonify({"access_token": token}), 200
            else: 
                return jsonify({"error": "Invalid credentials"}), 401
        except:
            print("An error occured")

    # Hashes the password and registers the user if the username is not already taken
    @classmethod
    def register_user(cls, username, password):
        if cls.username_exists(username):
            print("Username is taken")
        else:
            hashed_password = generate_password_hash(password)
            new_user = User(username=username, password=hashed_password)
            database.session.add(new_user)
            database.session.commit()
            print("Registration successful")

    # Check if username exist in database
    @classmethod
    def username_exists(cls, username):
        user = cls.query.filter(cls.username == username).first()
        if user is not None:
            return True
        else:
            return False

    # Verifies credentials and print if login was successful
    @classmethod
    def login_user(cls, username, password):
        user = cls.query.filter(cls.username == username).first()
        if user is None:
            print("Invalid username")
        else:
            password_check = check_password_hash(user.password, password)

            if password_check:
                print("Login successful")
            else:
                print("Invalid password")


class Capsule(database.Model):
    id = database.Column(database.Integer, primary_key=True)
    user_id = database.Column(database.Integer, nullable=False)
    content = database.Column(database.Text, nullable=False)
    file_path = database.Column(database.String(255))
    unlock_date = database.Column(database.DateTime, nullable=False)

    # Stores user message and file in capsule for a future date
    @classmethod
    def create_capsule(user_id, content, file, unlock_date):
        file_path = save_file_to_upload_folder(file)
        new_capsule = Capsule(
            user_id=user_id,
            content=content,
            file_path=file_path,
            unlock_date=unlock_date,
        )
        database.session.add(new_capsule)
        database.session.commit()

    @classmethod
    def view_capsules(cls, user_id):
        capsules = cls.query.filter(cls.user_id == user_id).all()
        return capsules

    @classmethod
    def open_capsule(cls, capsule_id):
        capsule = cls.query.filter(cls.id == capsule_id).first()
        if capsule is None:
            print("Capsule not found")
            return None
        current_date = datetime.now()
        if current_date >= capsule.unlock_date:
            return capsule
        else:
            print("Capsule locked")


def save_file_to_upload_folder(file):
    try:
        if file is None:
            print("No file provided")
            return None

        upload_folder = Path(current_app.config["UPLOAD_FOLDER"])

        if not upload_folder.exists():
            upload_folder.mkdir(parents=True, exist_ok=True)

        file_path = upload_folder / file.filename
        file.save(str(file_path))

        return file_path
    except:
        print("An exception occured")


if __name__ == "__main__":
    time_capsule_app = TimeCapsuleApp()
    with time_capsule_app.app.app_context():
        database.create_all()
    time_capsule_app.app.run(debug=True)
