import { AreaCards, AreaCharts, AreaTable, AreaTop } from "../../components";
import React, { useState } from "react";

const Reserve = () => {
    const [rooms, setRooms] = useState([
        { id: 1, name: "Room A", type: "Single" },
        { id: 2, name: "Room B", type: "Double" },
        { id: 3, name: "Room C", type: "Suite" },
      ]);
      const [selectedRoom, setSelectedRoom] = useState(null);
      const [filter, setFilter] = useState("");
    
      const handleReserve = (room) => {
        setSelectedRoom(room);
      };
    
      const handleFormSubmit = (e) => {
        e.preventDefault();
        alert(`Room ${selectedRoom.name} reserved successfully!`);
        setSelectedRoom(null);
      };
    
      const handleScanID = () => {
        alert("Simulating ID scan...");
        // Simulate scanning and parsing ID
        setTimeout(() => {
          const mockData = {
            firstName: "John",
            lastName: "Doe",
            licenseNumber: "AB123456",
            photo: "https://via.placeholder.com/100"
          };
          document.getElementById("firstName").value = mockData.firstName;
          document.getElementById("lastName").value = mockData.lastName;
          document.getElementById("licenseNumber").value = mockData.licenseNumber;
          document.getElementById("photo").src = mockData.photo;
        }, 1000);
      };
    
      const filteredRooms = filter
        ? rooms.filter((room) => room.type === filter)
        : rooms;
    
      return (
        <div className="p-4">
          <h1 className="mb-4">Reserve a Room</h1>
    
          <div className="mb-3">
            <label htmlFor="filter" className="form-label">Filter by Room Type:</label>
            <select
              id="filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
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
              {filteredRooms.map((room) => (
                <tr key={room.id}>
                  <td>{room.name}</td>
                  <td>{room.type}</td>
                  <td>
                    <button
                      onClick={() => handleReserve(room)}
                      className="btn btn-primary"
                    >
                      Reserve
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
    
          {selectedRoom && (
            <div className="modal show d-block" tabIndex="-1">
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Reserve {selectedRoom.name}</h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setSelectedRoom(null)}
                    ></button>
                  </div>
                  <form onSubmit={handleFormSubmit}>
                    <div className="modal-body row">
                      <div className="col-md-6 border-end">
                        <h6 className="mb-3">Room Information</h6>
                        <p><strong>Name:</strong> {selectedRoom.name}</p>
                        <p><strong>Type:</strong> {selectedRoom.type}</p>
                        <div className="mb-3">
                          <label className="form-label">Check-in Date</label>
                          <input
                            type="date"
                            required
                            className="form-control"
                          />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Check-out Date</label>
                          <input
                            type="date"
                            required
                            className="form-control"
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <h6 className="mb-3">Customer Information</h6>
                        <div className="mb-3">
                          <label className="form-label">First Name</label>
                          <input
                            type="text"
                            id="firstName"
                            required
                            className="form-control"
                          />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Last Name</label>
                          <input
                            type="text"
                            id="lastName"
                            required
                            className="form-control"
                          />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Driving License</label>
                          <input
                            type="text"
                            id="licenseNumber"
                            required
                            className="form-control"
                          />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Photo</label>
                          <div className="d-flex align-items-center">
                            <img
                              id="photo"
                              src="https://via.placeholder.com/100"
                              alt="User"
                              className="me-3 rounded"
                            />
                            <button
                              type="button"
                              className="btn btn-secondary"
                              onClick={handleScanID}
                            >
                              Scan ID
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button type="submit" className="btn btn-success">
                        Confirm Reservation
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setSelectedRoom(null)}
                      >
                        Close
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
  );
};

export default Reserve;
