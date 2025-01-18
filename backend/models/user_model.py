from bson import ObjectId
from pymongo.collection import Collection

class UserModel:
    def __init__(self, db):
        self.collection: Collection = db.users

    def create_user(self, data):
        user = {
            "username": data["username"],
            "email": data["email"],
            "password_hash": data["password_hash"],
            "created_at": data["created_at"]
        }
        return self.collection.insert_one(user)

    def get_user_by_id(self, user_id):
        # return self.collection.find_one({"_id": user_id})
        return self.collection.find_one({"_id": ObjectId(user_id)})

    def get_user_by_email(self, email):
        return self.collection.find_one({"email": email})