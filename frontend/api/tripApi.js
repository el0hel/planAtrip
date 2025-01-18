// functions to make API calls

import axios from 'axios';

// base url for api
const API_URL = 'http://localhost:5000';

// registering the user
export const registerUser = async (userData) => { 
  try {
    const response = await axios.post(`${API_URL}/users/register`, userData);
    console.log('Successful registration:', response.data);
    return response.data; 
  } catch (error) { 
    console.error('Registration unsuccessful:', error);
    throw error;
  }
}; 

// logging in the user
export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/users/login`, { email, password });
    console.log('Login successful', response.data);
    if (response.data.user_id) {
      localStorage.setItem('userId', response.data.user_id); // saving userId
      return response.data; 
    }
    return null;
  } catch (error) {
    console.error('Unsuccessful login:', error);
    throw error;
  }
};

// fetching trips for a user
export const fetchTrips = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/trips/user/${userId}`); 
    console.log('Fetched trips:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching trips:', error);
    throw error;
  }
};


// creating a new trip for a user 
export const addTrip = async (tripData) => {
  try {
    const response = await axios.post(`${API_URL}/trips`, tripData); 
    console.log('Trip added successfully:', response.data);
    return response.data; 
  } catch (error) {
    console.error('Error adding trip:', error);
    throw error; 
  }
};


// archiving a trip 
export const updateTripStatus = async (tripId, status) => {
  try {
    const response = await axios.patch(`${API_URL}/trips/${tripId}`, { status });
    console.log(response.data.message);
    return response.data; 
  } catch (error) {
    console.error('Error updating trip status:', error);
    throw error; 
  }
};


// deleting a trip
export const deleteTrip = async (tripId) => {
  try {
    const response = await axios.delete(`${API_URL}/trips/${tripId}`);
    console.log('Trip deleted successfully:', response.data);
    return response.data; 
  } catch (error) {
    console.error('Error deleting trip:', error);
    throw error;
  }
};

// updating the itinerary for a trip
export const updateItinerary = async (tripId, itineraryData) => {
  try {
    const response = await axios.patch(`${API_URL}/trips/${tripId}/itinerary`, { itinerary: itineraryData });
    console.log('Itinerary updated successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating itinerary:', error);
    throw error;
  }
};

// updating the packing list for a trip
export const updatePackingList = async (tripId, packingListData) => {
  try {
    const response = await axios.patch(`${API_URL}/trips/${tripId}/packing-list`, { packing_list: packingListData });
    console.log('Packing list updated successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating packing list:', error);
    throw error;
  }
};