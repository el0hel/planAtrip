from flask import Blueprint, request, jsonify
from werkzeug.security import check_password_hash, generate_password_hash
from planAtrip.models.user_model import UserModel
from planAtrip.db import db  # from db.py

user_blueprint = Blueprint('user', __name__)
user_model = UserModel(db)


@user_blueprint.route('/register', methods=['POST'])
def register_user():
    """
    registers a new user by accepting user details, hashes the password and stores info in db
    """
    data = request.json
    password_hash = generate_password_hash(data['password'])  # hash password
    data['password_hash'] = password_hash
    result = user_model.create_user(data)
    user_id = str(result.inserted_id)
    return jsonify({"message": "User created", "user_id": user_id})


@user_blueprint.route('/login', methods=['POST'])
def login_user():
    """
    authenticates the user b verifying email and password
    """
    data = request.json
    email = data.get('email')
    password = data.get('password')

    user = user_model.get_user_by_email(email)
    if user and check_password_hash(user["password_hash"], password):
        return jsonify({
            "message": "Login successful",
            "user_id": str(user["_id"]),
            "username": user["username"]
        })
    else:
        return jsonify({"message": "Invalid email or password"}), 401


@user_blueprint.route('/<user_id>', methods=['GET'])
def get_user(user_id):
    """
    retrieves user details from db by id
    """
    user = user_model.get_user_by_id(user_id)
    if user:
        return jsonify({
            "user_id": str(user["_id"]),  # convert ObjectId back to string
            "username": user["username"],
            "email": user["email"],
            "created_at": user["created_at"]
        })
    return jsonify({"message": "User not found"}), 404
