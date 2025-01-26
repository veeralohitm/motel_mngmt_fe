import React, { useState } from 'react';

const GuestFolio = () => {
  // Sample guest data
  const [guests, setGuests] = useState([
    {
      id: 1,
      guestName: 'John Doe',
      roomNo: '101',
      checkIn: '2025-01-20',
      checkOut: '2025-01-25',
      comments: '',
    },
    {
      id: 2,
      guestName: 'Jane Smith',
      roomNo: '102',
      checkIn: '2025-01-22',
      checkOut: '2025-01-30',
      comments: '',
    },
    // Add more guests here
  ]);

  const [selectedGuest, setSelectedGuest] = useState(null);
  const [newComment, setNewComment] = useState('');

  const handleViewData = (guest) => {
    setSelectedGuest(guest);
  };

  const handleAddComment = (id) => {
    setGuests(guests.map((guest) =>
      guest.id === id ? { ...guest, comments: newComment } : guest
    ));
    setNewComment('');
  };

  return (
    <div>
      <h1>Guest Folio</h1>
      
      {/* Guest List */}
      <table>
        <thead>
          <tr>
            <th>Guest Name</th>
            <th>Room No</th>
            <th>Check-in Date</th>
            <th>Check-out Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {guests.map((guest) => (
            <tr key={guest.id}>
              <td>{guest.guestName}</td>
              <td>{guest.roomNo}</td>
              <td>{guest.checkIn}</td>
              <td>{guest.checkOut}</td>
              <td>
                <button onClick={() => handleViewData(guest)}>View Data</button>
                <button onClick={() => handleAddComment(guest.id)}>Add Comment</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Guest Details Modal */}
      {selectedGuest && (
        <div className="modal">
          <h2>{selectedGuest.guestName}'s Details</h2>
          <p>Room No: {selectedGuest.roomNo}</p>
          <p>Check-in Date: {selectedGuest.checkIn}</p>
          <p>Check-out Date: {selectedGuest.checkOut}</p>
          <p>Comments: {selectedGuest.comments || 'No comments yet.'}</p>
        </div>
      )}

      {/* Add Comment */}
      <div>
        <h3>Add a Comment</h3>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment"
        />
        <button onClick={() => handleAddComment(selectedGuest?.id)}>Save Comment</button>
      </div>
    </div>
  );
};

export default GuestFolio;
