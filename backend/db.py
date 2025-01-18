from pymongo import MongoClient
from planAtrip.config import MONGO_URI

client = MongoClient(MONGO_URI)
db = client.get_database()   # database name

try:
    client.admin.command('ping')  # ping the admin command to check the connection
    print("MongoDB connection successful!")
except Exception as e:
    print(f"Failed to connect to MongoDB: {str(e)}")
