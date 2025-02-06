import React, { useState, useEffect } from "react";
import axios from "axios";

//const BASE_URL = "http://localhost:3000/"
const BASE_URL = "https://hotel-app-bk.onrender.com/"
const API_URL = `${BASE_URL}rooms`;

const Reserve = () => {
  const [rooms, setRooms] = useState([]);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [filter, setFilter] = useState("");
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}rooms`); // Fetch all rooms
      const { data: bookings } = await axios.get("/api/book_a_room"); // Fetch booked rooms
      const bookedRoomIds = new Set(bookings.map((booking) => booking.room_id));
      const filteredRooms = data.filter((room) => !bookedRoomIds.has(room.id)); // Filter out booked rooms
      setRooms(data);
      setAvailableRooms(filteredRooms);
    } catch (error) {
      console.error("Error fetching rooms: ", error);
    }
  };

  const handleFilterChange = (e) => {
    const selectedType = e.target.value;
    setFilter(selectedType);
    if (selectedType) {
      setAvailableRooms(rooms.filter((room) => room.type === selectedType && !bookedRoomIds.has(room.id)));
    } else {
      setAvailableRooms(rooms.filter((room) => !bookedRoomIds.has(room.id)));
    }
  };

  const handleSelectRoom = (room) => {
    if (selectedRooms.length < 2) {
      setSelectedRooms([...selectedRooms, room]);
    }
  };

  const handleBookRooms = () => {
    setShowPopup(true);
  };

  return (
    <div className="p-4">
      <h1 className="mb-4">Available Rooms</h1>

      <div className="mb-3">
        <label htmlFor="filter" className="form-label">
          Filter by Room Type:
        </label>
        <select
          id="filter"
          value={filter}
          onChange={handleFilterChange}
          className="form-select"
        >
          <option value="">All</option>
          <option value="Single">Single</option>
          <option value="Double">Double</option>
          <option value="Suite">Suite</option>
        </select>
      </div>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Room Name</th>
            <th>Type</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {availableRooms.map((room) => (
            <tr key={room.id}>
              <td>{room.name}</td>
              <td>{room.type}</td>
              <td>
                <button className="btn btn-primary" onClick={() => handleSelectRoom(room)}>
                  Add
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-3">
        <h4>Selected Rooms:</h4>
        <p>{selectedRooms.map((room) => room.name).join(", ") || "None"}</p>
        {selectedRooms.length === 2 && (
          <button className="btn btn-success" onClick={handleBookRooms}>
            Book
          </button>
        )}
      </div>

      {showPopup && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Book Selected Rooms</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowPopup(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>You are booking: {selectedRooms.map((room) => room.name).join(", ")}</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowPopup(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reserve;
