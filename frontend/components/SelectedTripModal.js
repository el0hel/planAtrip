import React, { useState, useEffect } from 'react';
import '../styles/SelectedTripModal.css'; 
import PackingListModal from '../components/PackingListModal';

const SelectedTripModal = ({ selectedTrip, handleDiscardTrip, handleArchiveTrip, closeTripModal, handleUpdateItinerary, updateSelectedTrip }) => {
    const [itinerary, setItinerary] = useState([]);
    const [message, setMessage] = useState('');
    const [isPackingListOpen, setIsPackingListOpen] = useState(false);

    // effect hook to set the itinerary of the selected trip when the 'selectedTrip' prop changes.
    useEffect(() => {
        if (selectedTrip) {
          setItinerary(selectedTrip.itinerary);
        }
    }, [selectedTrip]);
    
    // function to handle changes in the itinerary notes section. 
    // updated notes for a specific date are stored in the state.
    const handleNoteChange = (index, event) => {
        const updatedItinerary = [...itinerary];
        updatedItinerary[index].notes = event.target.value; 
        setItinerary(updatedItinerary);
    };
    
    // function to save the updated itinerary to the backend. displays a message on success,
    // or an error otherwise.
    const saveItineraryChanges = async () => {
        try {
            await handleUpdateItinerary(itinerary);
            setMessage('Itinerary updated successfully!'); 
            setTimeout(() => setMessage(''), 3000); 
        } catch (error) {
            setMessage('Failed to update itinerary. Please try again.'); 
            console.error(error);
            setTimeout(() => setMessage(''), 3000); 
        }
    };

    // function to open the packing list modal
    const handleOpenPackingList = () => {
        setIsPackingListOpen(true);
    };
    
    // function to close the packing list modal
    const handleClosePackingList = () => {
        setIsPackingListOpen(false);
    };

    return (
        selectedTrip && ( // only render the modal if a trip is selected
            <div className="modal2">
                {/* overlay that closes the modal when clicked */}
                <div className="modal2-overlay" onClick={closeTripModal}></div>

                {/* modal content, prevents event propagation so that clicking inside modal won't close it */}
                <div className="modal2-content" onClick={(e) => e.stopPropagation()}>
                    <h2>{selectedTrip.trip_name}</h2>

                    <button className="close-btn" onClick={closeTripModal}>
                        X
                    </button>

                    {/* packing list modal */}
                    {isPackingListOpen && (
                    <PackingListModal
                        selectedTrip={selectedTrip}
                        handleClosePackingList={handleClosePackingList}
                        updateSelectedTrip={updateSelectedTrip}  
                    />
                    )}

                    {/* itinerary section */}
                    <div className="itinerary-section">
                        <div className="header-container">
                            <h3>Itinerary</h3>
                            {/* button to open packing List */}
                            <button className="packing-list-btn" onClick={handleOpenPackingList}>
                                Packing List
                            </button>
                        </div>
                        
                        <div className="itinerary-list">
                            {itinerary.map((item, index) => (
                                <div key={index} className="itinerary-item">
                                    <div className="itinerary-date">
                                        <strong>{item.date}</strong>
                                    </div>
                                    <div className="itinerary-notes">
                                        <textarea
                                            value={item.notes}
                                            onChange={(e) => handleNoteChange(index, e)}
                                            rows={5}
                                            cols={30}
                                            // if trip is archived, setting notes to read only state
                                            readOnly={selectedTrip.status === 'archived'}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* display message */}
                    {message && <div className="modal-message">{message}</div>}

                    {/* buttons for Discard, Archive, and Save */}
                    <div className="modal2-buttons">
                        <button className="discard-btn" onClick={handleDiscardTrip}>
                            Discard Trip
                        </button>

                        {/* only show "Archive Trip" button if the trip is upcoming */}
                        {selectedTrip.status === 'upcoming' && (
                            <button className="archive-btn" onClick={handleArchiveTrip}>
                                Archive Trip
                            </button>
                        )}
                        {selectedTrip.status === 'upcoming' && (
                        <button className="save-btn" onClick={saveItineraryChanges}>
                            Save Changes
                        </button>
                        )}
                    </div>
                </div>
            </div>
        )
    );
};

export default SelectedTripModal;
