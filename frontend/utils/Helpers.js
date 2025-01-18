// function to filter trips by status (upcoming or archived)
export const categoriseTrips = (trips) => {
    const upcomingTrips = trips.filter(trip => trip.status === 'upcoming');
    const archivedTrips = trips.filter(trip => trip.status === 'archived');
    return { upcomingTrips, archivedTrips };
  };

// function to get the locally stored user id
export const getUserId = () => {
    const userId = localStorage.getItem("userId");
    if (!userId) throw new Error("User ID not found in localStorage");
    return userId;
  };
  
// function to create the payload to send to backend for a new trip 
export const createTripPayload = (userId, newTrip) => ({
    user_id: userId,
    trip_name: newTrip.destination,
    start_date: newTrip.startDate,
    end_date: newTrip.endDate,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });
  
