import React from 'react';
import '../styles/TripList.css';

// component responsible for rendering the list of trips.
// it maps through the `trips` array and displays each trip as a card. when a trip card is clicked,
// it sets the selected trip by calling the `setSelectedTrip` function passed as a prop.
 
const TripList = ({ trips, setSelectedTrip }) => {
  // if there are no trips, displaying a message to indicate so
  if (trips.length === 0) {
    return <p>No trips found.</p>;
  }

  return (
    <div className="trip-list">
      {/* mapping through the trips array to render each trip as a card */}
      {trips.map((trip) => (
        <div
          className="trip-card"
          key={trip._id}
          onClick={() => setSelectedTrip(trip)} // when a trip card is clicked, setting it as the selected trip
        >
          <h3>{trip.trip_name}</h3>
          <p>
            {/* formatting the start and end dates into a readable format (en-GB style) */}
            {new Date(trip.start_date).toLocaleDateString('en-GB')} -{' '}
            {new Date(trip.end_date).toLocaleDateString('en-GB')}
          </p>
        </div>
      ))}
    </div>
  );
};

export default TripList;
