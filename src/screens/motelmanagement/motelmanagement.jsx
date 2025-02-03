import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const BASE_URL = "http://localhost:3000/"
//const BASE_URL = "https://hotel-app-bk.onrender.com"
const MOTEL_API_URL = `${BASE_URL}motels`;

const MotelManagement = () => {
  const [motels, setMotels] = useState([]);
  const [roomTypes, setRoomTypes] = useState(["Single", "Double", "Suite"]);
  const [showPopup, setShowPopup] = useState(false);
  const [showRoomTypePopup, setShowRoomTypePopup] = useState(false);
  const [newRoomType, setNewRoomType] = useState("");
  const [newMotel, setNewMotel] = useState({
    name: "",
    location: "",
    rooms: [],
  });

  const handleAddRoom = () => {
    setNewMotel((prev) => ({
      ...prev,
      rooms: [
        ...prev.rooms,
        { type: "", numberOfRooms: 0, startNumber: 0, endNumber: 0 },
      ],
    }));
  };

  const handleRoomChange = (index, field, value) => {
    const updatedRooms = newMotel.rooms.map((room, i) =>
      i === index ? { ...room, [field]: value } : room
    );
    setNewMotel({ ...newMotel, rooms: updatedRooms });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    // Validate room data
    for (const room of newMotel.rooms) {
      const { startNumber, endNumber, numberOfRooms } = room;
      const rangeCount = endNumber - startNumber + 1;

      if (numberOfRooms !== rangeCount) {
        alert(
          `Room type ${room.type} has mismatch between number of rooms and numbering range.`
        );
        return;
      }
    }

    // Add motel to the list
    setMotels([...motels, newMotel]);
    setNewMotel({ name: "", location: "", rooms: [] });
    setShowPopup(false);
  };

  const handleAddRoomType = (e) => {
    e.preventDefault();
    setRoomTypes([...roomTypes, newRoomType]);
    setNewRoomType("");
    setShowRoomTypePopup(false);
  };

  return (
    <div className="p-4">
      <h1 className="mb-4">Motel Management</h1>
      <button
        className="btn btn-primary mb-3 me-2"
        onClick={() => setShowPopup(true)}
      >
        Create Motel
      </button>
      <button
        className="btn btn-secondary mb-3"
        onClick={() => setShowRoomTypePopup(true)}
      >
        Add Room Type
      </button>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Motel Name</th>
            <th>Location</th>
            <th>Room Details</th>
          </tr>
        </thead>
        <tbody>
          {motels.map((motel, index) => (
            <tr key={index}>
              <td>{motel.name}</td>
              <td>{motel.location}</td>
              <td>
                {motel.rooms.map((room, i) => (
                  <div key={i}>
                    {room.type}: {room.numberOfRooms} rooms (
                    {room.startNumber} - {room.endNumber})
                  </div>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showPopup && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Create Motel</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowPopup(false)}
                ></button>
              </div>
              <form onSubmit={handleFormSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Motel Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newMotel.name}
                      onChange={(e) =>
                        setNewMotel({ ...newMotel, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Location</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newMotel.location}
                      onChange={(e) =>
                        setNewMotel({ ...newMotel, location: e.target.value })
                      }
                      required
                    />
                  </div>

                  <h6>Room Details</h6>
                  {newMotel.rooms.map((room, index) => (
                    <div key={index} className="mb-3">
                      <div className="d-flex align-items-center">
                        <select
                          className="form-select me-2"
                          value={room.type}
                          onChange={(e) =>
                            handleRoomChange(index, "type", e.target.value)
                          }
                          required
                        >
                          <option value="">Select Room Type</option>
                          {roomTypes.map((type, i) => (
                            <option key={i} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                        <input
                          type="number"
                          className="form-control me-2"
                          placeholder="Number of Rooms"
                          value={room.numberOfRooms}
                          onChange={(e) =>
                            handleRoomChange(
                              index,
                              "numberOfRooms",
                              parseInt(e.target.value) || 0
                            )
                          }
                          required
                        />
                      </div>
                      <div className="d-flex align-items-center mt-2">
                        <input
                          type="number"
                          className="form-control me-2"
                          placeholder="Start Number"
                          value={room.startNumber}
                          onChange={(e) =>
                            handleRoomChange(
                              index,
                              "startNumber",
                              parseInt(e.target.value) || 0
                            )
                          }
                          required
                        />
                        <input
                          type="number"
                          className="form-control"
                          placeholder="End Number"
                          value={room.endNumber}
                          onChange={(e) =>
                            handleRoomChange(
                              index,
                              "endNumber",
                              parseInt(e.target.value) || 0
                            )
                          }
                          required
                        />
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleAddRoom}
                  >
                    Add Room
                  </button>
                </div>

                <div className="modal-footer">
                  <button type="submit" className="btn btn-success">
                    Create Motel
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowPopup(false)}
                  >
                    Close
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {showRoomTypePopup && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Room Type</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowRoomTypePopup(false)}
                ></button>
              </div>
              <form onSubmit={handleAddRoomType}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Room Type Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newRoomType}
                      onChange={(e) => setNewRoomType(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="submit" className="btn btn-success">
                    Save Room Type
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowRoomTypePopup(false)}
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

export default MotelManagement;
