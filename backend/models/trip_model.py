from bson import ObjectId
from pymongo.collection import Collection


def _generate_empty_itinerary(start_date, end_date):
    """
    helper method to generate an empty itinerary with placeholders for each date.
    """
    from datetime import datetime, timedelta

    start_date = datetime.strptime(start_date, "%Y-%m-%d")
    end_date = datetime.strptime(end_date, "%Y-%m-%d")

    # Generate all dates between start_date and end_date
    dates = [(start_date + timedelta(days=i)).strftime("%Y-%m-%d") for i in range((end_date - start_date).days + 1)]

    # Create empty itinerary with each date and empty note field
    return [{"date": date, "notes": ""} for date in dates]


class TripModel:
    """
        a model representing the operations related to trips in the DB.
    """
    def __init__(self, db):
        self.collection: Collection = db.trips

    def create_trip(self, data):
        """
                creates a new trip in the database
        """

        # generate an empty itinerary based on provided dates
        itinerary = _generate_empty_itinerary(data["start_date"], data["end_date"])
        packing_list = []

        # preparing trip data and inserting it into DB
        trip = {
            "user_id": ObjectId(data["user_id"]),
            "trip_name": data["trip_name"],
            "start_date": data["start_date"],
            "end_date": data["end_date"],
            "created_at": data["created_at"],
            "updated_at": data["updated_at"],
            "status": "upcoming",
            "itinerary": itinerary,
            "packing_list": packing_list
        }

        # inserting trip and returning its ID
        return self.collection.insert_one(trip).inserted_id

    def get_trip_by_id(self, trip_id):
        """
                retrieves a trip from the database by its ID.
        """
        return self.collection.find_one({"_id": ObjectId(trip_id)})

    def get_trips_by_user(self, user_id):
        """
                retrieves all trips associated with a particular user.
        """
        return self.collection.find({"user_id": ObjectId(user_id)})

    def update_trip_status(self, trip_id, status):
        """
               updates the status of a specific trip.
        """
        return self.collection.update_one(
            {"_id": ObjectId(trip_id)},
            {"$set": {"status": status}}
        ).modified_count

    def delete_trip(self, trip_id):
        """
        deletes a trip from the DB by its ID.
        """
        try:
            # ensure trip_id is ObjectId before deleting
            if not isinstance(trip_id, ObjectId):
                trip_id = ObjectId(trip_id)
        except Exception as e:
            return False

        result = self.collection.delete_one({"_id": trip_id})
        return result.deleted_count > 0

    def update_itinerary(self, trip_id, itinerary_data):
        """
        updates the itinerary for a specific trip.
        """
        return self.collection.update_one(
            {"_id": ObjectId(trip_id)},
            {"$set": {"itinerary": itinerary_data}}
        ).modified_count

    def update_packing_list(self, trip_id, packing_list_data):
        """
        updates the packing list for a specific trip.
        """
        return self.collection.update_one(
            {"_id": ObjectId(trip_id)},
            {"$set": {"packing_list": packing_list_data}}
        ).modified_count
