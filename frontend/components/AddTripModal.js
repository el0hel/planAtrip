import React from 'react';
import '../styles/AddTripModal.css'; 

// component to add a new trip, where user can input trip details.
const AddTripModal = ({ isAddingTrip, setIsAddingTrip, newTrip, setNewTrip, error, handleAddTrip }) => {
  return (
    // modal is displayed only if isAddingTrip is true
    isAddingTrip && (
      <div className="modal1-overlay" onClick={() => setIsAddingTrip(false)}>

        {/* modal content. stops the click event from propagating to the overlay */}
        <div className="modal1-content" onClick={(e) => e.stopPropagation()}>
          <h2>Add New Trip</h2>

          {/*destination input field */}
          <label htmlFor="destination">Destination</label>
          <input
            id="destination"
            name="destination"
            type="text"
            value={newTrip.destination}
            onChange={(e) => setNewTrip({ ...newTrip, destination: e.target.value })}
          />

          {/*start date input field*/}
          <label htmlFor="startDate">Start Date</label>
          <input
            id="startDate"
            name="startDate"
            type="date"
            value={newTrip.startDate}
            onChange={(e) => setNewTrip({ ...newTrip, startDate: e.target.value })}
          />

          {/*end date input field*/}
          <label htmlFor="endDate">End Date</label>
          <input
            id="endDate"
            name="endDate"
            type="date"
            value={newTrip.endDate}
            onChange={(e) => setNewTrip({ ...newTrip, endDate: e.target.value })}
          />

          {error && <p className="error-message">{error}</p>}

          {/* modal action buttons */}
          <div className="modal1-buttons">
            <button onClick={() => setIsAddingTrip(false)}>Cancel</button>
            <button onClick={handleAddTrip}>Next</button>
          </div>
        </div>
      </div>
    )
  );
};

export default AddTripModal;
