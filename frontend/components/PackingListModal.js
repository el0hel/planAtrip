import React, { useState, useEffect } from 'react';
import '../styles/PackingListModal.css';

const PackingListModal = ({ selectedTrip, handleClosePackingList, updateSelectedTrip }) => {
  const [packingList, setPackingList] = useState("");  
  const [message, setMessage] = useState('');  

  // effect that runs whenever the selected trip changes to update the packing list
  useEffect(() => {
    if (selectedTrip) {
      setPackingList(selectedTrip.packing_list);
    }
  }, [selectedTrip]);  

  // function to update the packing list based on user input.
  const handlePackingListChange = (event) => {
    setPackingList(event.target.value);
  };

  // function to save the updated packing list through the parent handler  (updatedSelectedTrip)
  const handleSavePackingList = async () => {
    try {
      await updateSelectedTrip(packingList);  
  
      setMessage('Packing list saved successfully!');
      setTimeout(() => setMessage(''), 3000); 
    } catch (error) {
      console.error('Error saving packing list:', error);
      setMessage('Failed to save packing list.');
    }
  };
  

  return (
    <div className="packing-list-modal">
      <div className="modal-content">
        <button onClick={handleClosePackingList} className="close-btn">X</button>

        <h2>Packing List</h2>

        <textarea
          value={packingList}
          onChange={handlePackingListChange}
          placeholder="Write your packing list here..."
          rows={10}
          cols={50}
          readOnly={selectedTrip.status === 'archived'}
        />

        {message && <div className="success-message">{message}</div>}

        <div className="modal-footer">
          {/*only show Save button if trip is upcoming */}
          {selectedTrip.status === 'upcoming' && 
          <button onClick={handleSavePackingList}>Save List</button>
          }
          </div>
      </div>
    </div>
  );
};

export default PackingListModal;
