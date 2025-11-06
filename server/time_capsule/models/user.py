from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from werkzeug.security import generate_password_hash, check_password_hash
from time_capsule_app import database # import shared database

# Blueprint to organize route, user is the name of the blueprint
# and __name__ refers to the current file
user_bp = Blueprint("user", __name__)

# Class to initialize database with user id, username, and password
class User(database.Model):
    id = database.Column(database.Integer, primary_key=True)
    username = database.Column(database.String(80), unique=True, nullable=False)
    password = database.Column(database.String(200), nullable=False)

    @classmethod
    def username_exists(cls, username):
        return cls.query.filter_by(username=username).first() is not None

    @classmethod
    def login_user(cls, username, password):
        # Search for user
        user = cls.query.filter_by(username=username).first()
        # If user found and password matches
        if user and check_password_hash(user.password, password):
            return user
        return None

# POST means the backend is receiving the data from the frontend
@user_bp.route("/register", methods=["POST"])
def register():
    # Parses data sent from frontend
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    # Checks if either username or password are present
    # This is checked on the frontend so this is redundant
    if not username or not password:
        return jsonify({"message": "Missing credentials"}), 400 # 400 means bad request
    # Checks if username is unique
    if User.username_exists(username):
        return jsonify({"message": "Username is taken."}), 400

    # Creates a new user and adds it to the database
    hashed_pw = generate_password_hash(password)
    new_user = User(username=username, password=hashed_pw)
    database.session.add(new_user)
    database.session.commit()

    return jsonify({"message": "Registration successful"}), 201 # 201 means resource created

@user_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    user = User.login_user(username, password)
    if not user: # user is None
        return jsonify({"message": "Invalid credentials"}), 401 # 401 means Unauthorized

    token = create_access_token(identity=user.id)
    return jsonify({"access_token": token}), 200 # 200 means OK
