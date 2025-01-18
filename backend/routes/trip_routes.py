from bson import ObjectId
from bson.json_util import dumps
from flask import Blueprint, request, jsonify
from planAtrip.models.trip_model import TripModel
from planAtrip.db import db  # to avoid circular import error

trip_blueprint = Blueprint('trip', __name__)
trip_model = TripModel(db)


@trip_blueprint.route('/', methods=['POST'])
def create_trip():
    """
       creates a new trip in the database. request must contain user_id and trip_name.
    """
    data = request.json
    if not data or "user_id" not in data or "trip_name" not in data:
        return jsonify({"message": "Invalid trip data."}), 400

    trip_id = trip_model.create_trip(data)
    if not trip_id:
        return jsonify({"message": "Failed to create trip."}), 500

    return jsonify({"message": "Trip created successfully.", "trip_id": str(trip_id)})


@trip_blueprint.route('/<trip_id>/', methods=['GET'])
def get_trip(trip_id):
    """
    gets a specific trip by its ID.
    :param trip_id:
    :return:
    """
    trip_id = ObjectId(trip_id)
    trip = trip_model.get_trip_by_id(trip_id)
    if trip:
        return jsonify(trip), 200
    return jsonify({"message": "Trip not found"}), 404


@trip_blueprint.route('/user/<user_id>/', methods=['GET'])
def get_trips_by_user(user_id):
    """
    gets all trips for a user by their ID.
    :param user_id:
    :return:
    """
    try:
        user_id = ObjectId(user_id)
    except Exception:
        return jsonify({"message": "Invalid user ID."}), 400

    trips = trip_model.get_trips_by_user(user_id)
    trips_list = [trip for trip in trips]
    return dumps(trips_list), 200


@trip_blueprint.route('/<trip_id>/', methods=['PATCH'])
def update_trip_status(trip_id):
    """
    updates a trip's status in database.
    """
    data = request.json
    if "status" not in data:
        return jsonify({"message": "Status is required."}), 400

    updated_count = trip_model.update_trip_status(trip_id, data["status"])
    if updated_count:
        return jsonify({"message": "Trip status updated."}), 200
    return jsonify({"message": "Trip not found."}), 404


@trip_blueprint.route('/<trip_id>/', methods=['DELETE'])
def delete_trip(trip_id):
    """
    deletes a specific trip by its ID.
    """
    try:
        # Convert the trip_id to ObjectId to validate it
        trip_object_id = ObjectId(trip_id)
    except Exception:
        # If trip_id is not valid, return an error
        return jsonify({"message": "Invalid trip ID."}), 400

    result = trip_model.delete_trip(trip_object_id)

    if result:
        return jsonify({"message": "Trip deleted successfully."}), 200
    return jsonify({"message": "Trip not found."}), 404


@trip_blueprint.route('/<trip_id>/itinerary', methods=['PATCH'])
def update_itinerary(trip_id):
    """
    updates the itinerary for a specific trip by adding text for each date.
    """
    data = request.json
    if "itinerary" not in data:
        return jsonify({"message": "Itinerary data is required."}), 400

    updated_count = trip_model.update_itinerary(trip_id, data["itinerary"])
    if updated_count:
        return jsonify({"message": "Itinerary updated."}), 200
    return jsonify({"message": "Trip not found."}), 404


@trip_blueprint.route('/<trip_id>/packing-list', methods=['PATCH'])
def update_packing_list(trip_id):
    """
    updates the packing list for a specific trip.
    """
    data = request.json
    if "packing_list" not in data:
        return jsonify({"message": "Packing list data is required."}), 400

    updated_count = trip_model.update_packing_list(trip_id, data["packing_list"])
    if updated_count:
        return jsonify({"message": "Packing list updated."}), 200
    return jsonify({"message": "Trip not found."}), 404
