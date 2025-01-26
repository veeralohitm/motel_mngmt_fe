import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const MotelManagement = () => {
  const [motels, setMotels] = useState([]);
  const [roomTypes, setRoomTypes] = useState(["Single", "Double", "Suite"]);
  const [showPopup, setShowPopup] = useState(false);
  const [showRoomTypePopup, setShowRoomTypePopup] = useState(false);
  const [newRoomType, setNewRoomType] = useState("");
  const [newMotel, setNewMotel] = useState({
    name: "",
    city: "",
    rooms: []
  });

  const handleAddRoom = () => {
    setNewMotel((prev) => ({
      ...prev,
      rooms: [...prev.rooms, { type: "", count: 0 }],
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
    setMotels([...motels, newMotel]);
    setNewMotel({ name: "", city: "", rooms: [] });
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
            <th>City</th>
            <th>Room Details</th>
          </tr>
        </thead>
        <tbody>
          {motels.map((motel, index) => (
            <tr key={index}>
              <td>{motel.name}</td>
              <td>{motel.city}</td>
              <td>
                {motel.rooms.map((room, i) => (
                  <div key={i}>
                    {room.type}: {room.count} rooms
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
                    <label className="form-label">City Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newMotel.city}
                      onChange={(e) =>
                        setNewMotel({ ...newMotel, city: e.target.value })
                      }
                      required
                    />
                  </div>

                  <h6>Room Details</h6>
                  {newMotel.rooms.map((room, index) => (
                    <div key={index} className="mb-3 d-flex align-items-center">
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
                        value={room.count}
                        onChange={(e) =>
                          handleRoomChange(index, "count", e.target.value)
                        }
                        required
                      />
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
