// Mytrips.js is the component for the list of trips belonging to the user.
// when a trip is clicked on, a modal is opened to display the trip's itinerary and options to archive or delete it.
// when the '+' button is clicked, a modal prompts the user to enter the detail for a new trip.

// import statements
import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import '../styles/Mytrips.css';
import SelectedTripModal from '../components/SelectedTripModal'; 
import AddTripModal from '../components/AddTripModal';
import TripList from '../components/TripList';
import { categoriseTrips, getUserId, createTripPayload } from '../utils/Helpers';
import { addTrip, fetchTrips, deleteTrip, updateTripStatus, updateItinerary, updatePackingList} from '../api/tripApi';
import { validateTrip} from '../utils/Validation';

const MyTrips = () => {
  const [trips, setTrips] = useState([]); 
  const [isAddingTrip, setIsAddingTrip] = useState(false);
  const [newTrip, setNewTrip] = useState({ destination: '', startDate: '', endDate: '' }); 
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [error, setError] = useState('');
  const [deletedTrip, setDeletedTrip] = useState(null); 
  const [undoVisible, setUndoVisible] = useState(false);
  const [undoTimeout, setUndoTimeout] = useState(null); // Add state for storing the timeout ID


  // function to fetch trips from API
  // on success it stores the trip data in the 'trips' state.
  // on failure, it logs the error and updates the 'error' state to notify the user.
  const fetchTripsData = async () => {
    try {
      const userId = getUserId(); 
      const tripsData = await fetchTrips(userId); 
      setTrips(tripsData); 
    } catch (error) {
      console.error('Error fetching trips:', error);
      setError('Failed to fetch trips. Please try again later.');
    }
  };

  //  loading the list of trips when Mytrips mounts
  useEffect(() => {
    fetchTripsData();   
  }, []);

  
  // function to delete a selected trip. it first marks the trip as deleted in the local state,
  // then triggers a timeout to ensure a 5-second undo period. If the undo is not triggered in time,
  // it calls the `deleteTrip` API to permanently remove the trip from the database.
  // The `undoVisible` state is used to display an undo option, and the `setUndoTimeout` manages the timeout.
  const handleDiscardTrip = async () => {
    try {
      const tripId = selectedTrip._id.$oid;
      
      setDeletedTrip(selectedTrip);
      const updatedTrips = trips.filter(trip => trip._id.$oid !== tripId);
      setTrips(updatedTrips);
  
      setUndoVisible(true);
  
      const timeoutId = setTimeout(async () => {
        
        const finalTrips = updatedTrips.filter(trip => trip._id.$oid !== tripId);
        await deleteTrip(tripId);
        setTrips(finalTrips); 
        setUndoVisible(false);
        setSelectedTrip(null); 
      }, 5000); 
  
      setUndoTimeout(timeoutId);
  
      setSelectedTrip(null);
    } catch (err) {
      console.error('Failed to discard trip:', err);
      setError('Failed to discard trip. Please try again later.');
    }
  };
  
 // function to undo the deletion of a trip. It restores the trip that was deleted,
  // cancels the deletion timeout, and resets the related state.
  const handleUndoDelete = () => {
    setTrips(prevTrips => [...prevTrips, deletedTrip]);
  
    clearTimeout(undoTimeout);

    setDeletedTrip(null);
    setUndoVisible(false);
    setUndoTimeout(null);
  };
  
  // function to set the selected trip in the state. 
  // this is called when a user clicks on a trip to view its details in the modal.
  const handleSelectTrip = (trip) => {
  setSelectedTrip(trip);
  };


  // function to add a trip to the DB. it validates the user inputted data and if valid, it creates a payload
  // using the user ID and trip details, and calls the 'addTrip; function to send the data to the backend.
  // if validation fails, an error is displayed. 
  // after creation, the modal is closed, the form is reset and trips are refetched to update the UI.
const handleAddTrip = async () => {
  const validationError = validateTrip(newTrip);
  
  if (validationError) {
    setError(validationError);
    return; 
  }

  setError('');

  const tripData = createTripPayload(getUserId(), newTrip);

  try {
    await addTrip(tripData);
    setIsAddingTrip(false); 
    setNewTrip({ destination: '', startDate: '', endDate: '' });
    fetchTripsData(); 
  } catch (err) {
    console.error('Failed to add trip:', err);
    setError('Failed to add trip. Please try again.');
  }
};

  // function to archive the selected trip. it calls the `updateTripStatus` API function.
  // after archiving, it updates the trip's status locally to "archived" for immediate UI reflection and closes the modal.
  const handleArchiveTrip = async () => {
    try {
      const tripId = selectedTrip._id.$oid; 
      await updateTripStatus(tripId, 'archived');
    
      setTrips(trips.map(trip =>
        trip._id.$oid === tripId ? { ...trip, status: 'archived' } : trip
      ));
    
      setSelectedTrip(null);
    } catch (err) {
      console.error('Failed to archive trip:', err);
      setError('Failed to archive trip.');
    }
  };
  
    // function to update the itinerary of the selected trip. it sends the updated itinerary to the backend
  // using the `updateItinerary` API function. after updating, it updates the local `selectedTrip` state to reflect
  // the changes immediately. it then refetches all trips to ensure consistency with the backend.
 const handleUpdateItinerary = async (updatedItinerary) => {
      try {
        const tripId = selectedTrip._id.$oid;
        await updateItinerary(tripId, updatedItinerary);

        setSelectedTrip(prevState => ({
          ...prevState,
          itinerary: updatedItinerary
        }));
  
        fetchTripsData();
      } catch (err) {
        console.error('Failed to update itinerary:', err);
        setError('Failed to update itinerary. Please try again.');
      }
    };
  
      // function to update the packing list of a selected trip. it sends the updated packing list to the backend
      // using the `updatePackingList` API function. after updating, it immediately reflects the changes in the local
      // `selectedTrip` state. The `fetchTripsData` function is then called to refresh the trips data.
    const handleUpdatePackingList = async (updatedPackingList) => {
      try {
        const tripId = selectedTrip._id.$oid;
        
        await updatePackingList(tripId, updatedPackingList);
    
        setSelectedTrip(prevState => ({
          ...prevState,
          packingList: updatedPackingList 
        }));
        
        fetchTripsData();  

      } catch (err) {
        console.error('Failed to update packing list:', err);
        setError('Failed to update packing list. Please try again.');
      }
    };
    
  
  // categorising trips based on their status
  const { upcomingTrips, archivedTrips } = categoriseTrips(trips);


  return (
    <div>
      {/* rendering the navbar component at the top of the page */}
      <Navbar />
      <div className="my-trips-page">
        <h1>My Trips</h1>
        <div className="trips-container">

          {/* Upcoming Trips section */}
          <div className="trips-section">
            <div className="trips-header">
              <h2>Upcoming</h2>

              <button
                className="add-trip-button"
                onClick={() => {
                  setIsAddingTrip(true);
                }}
              >
                +
              </button>
            </div>
            {/* rendering TripList component, passing trips and setSelectedTrip */}
            <TripList trips={upcomingTrips} setSelectedTrip={handleSelectTrip} />
          </div>

          {/* Archived Trips section */}
          <div className="trips-section">
          <div className="trips-header">
            <h2>Archived</h2>
            </div>
            {/* rendering TripList component for archived trips */}
            <TripList trips={archivedTrips} setSelectedTrip={handleSelectTrip} />
          </div>
        </div>
        {/* conditionally rendering the AddTripModal when user wants to add a trip.
          receives props to control the modal visilibty, form data, and handling of add trip action.*/}
        <AddTripModal
          isAddingTrip={isAddingTrip}
          setIsAddingTrip={setIsAddingTrip}
          newTrip={newTrip}
          setNewTrip={setNewTrip}
          error={error}
          handleAddTrip={handleAddTrip}
        />

       {/* conditionally rendering the SelectedTripModal when user selects a trip.
          shows the details of the trip and provides options to archive/delete it, view and update the packing list and itinerary.*/}
        <SelectedTripModal
          selectedTrip={selectedTrip}
          handleDiscardTrip={handleDiscardTrip}
          handleArchiveTrip={handleArchiveTrip}
          closeTripModal={() => setSelectedTrip(null)}
          handleUpdateItinerary={handleUpdateItinerary} 
          updateSelectedTrip={handleUpdatePackingList}
        />
      
      {/* Undo Trip Discard button */}
      {undoVisible && deletedTrip && (
          <div className="undo-delete-container">
            <button className="undo-delete-button" onClick={handleUndoDelete}>
              Trip discarded. Undo?
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default MyTrips;
