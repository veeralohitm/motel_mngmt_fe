import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from 'sweetalert2'

//const BASE_URL = "http://localhost:3000/";
const BASE_URL = "https://hotel-app-bk.onrender.com/"
const MOTEL_API_URL = `${BASE_URL}motels`;
const ROOMS_API_URL = `${BASE_URL}rooms`;
const ROOMTYPE_API_URL = `${BASE_URL}roomtypes`;


const MotelManagement = () => {
  const [motels, setMotels] = useState([]);
  const [selectedMotel, setSelectedMotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [selectedRoomType, setSelectedRoomType] = useState("");
  const [showRoomPopup, setShowRoomPopup] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newMotel, setNewMotel] = useState({ Name: "", Location: "", max_rooms:"", roomSets: [] });
  const [roomTypes, setRoomTypes] = useState([]);
  const [error, setError] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editMotel, setEditMotel] = useState(null);
  const [editRoomSets, setEditRoomSets] = useState([]);
  const [availableRoomTypes, setAvailableRoomTypes] = useState([]);
  const [newRoomType, setNewRoomType] = useState("");
  

  useEffect(() => {
    fetchMotelData();
    fetchRoomTypes();
  }, []);

  const fetchMotelData = async () => {
    try {
      const response = await axios.get(MOTEL_API_URL);
      setMotels(response.data);
    } catch (error) {
      console.error("Error fetching motels:", error);
    }
  };

  const fetchRoomTypes = async () => {
    try {
      const response = await axios.get(ROOMTYPE_API_URL);
      setRoomTypes(response.data);
      setAvailableRoomTypes(response.data);
    } catch (error) {
      console.error("Error fetching room types:", error);
    }
  };

  const fetchRooms = async (motelId) => {
    try {
      const response = await axios.get(`${ROOMS_API_URL}?motel_id=${motelId}`);
      setRooms(response.data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  const handleViewRooms = (motel) => {
    setSelectedMotel(motel);
    fetchRooms(motel.motel_id);
    setShowRoomPopup(true);
  };

  const handleCreateMotel = async () => {
    try {
      await axios.post(MOTEL_API_URL, newMotel);
      fetchMotelData();
      setShowCreateForm(false);
      Swal.fire({
        title: 'Success!',
        text: 'Motel and rooms created successfully.',
        icon: 'success',
        confirmButtonText: 'OK'
      });
    } catch (error) {
      console.error("Error creating motel:", error);
      Swal.fire({
        title: 'Error!',
        text: error.response.data.error,
        icon: 'error',
        confirmButtonText: 'Retry'
    });}
  };
  const handleDeleteMotel = async (motelId) => {
    // Confirm deletion
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!"
    });
  
    if (result.isConfirmed) {
      try {
        await axios.delete(`${MOTEL_API_URL}/${motelId}`);
        Swal.fire("Deleted!", "The motel has been deleted.", "success");
        fetchMotelData(); // Refresh the motel list
      } catch (error) {
        console.error("Error deleting motel:", error);
        Swal.fire("Error!", error.response.data.error, "error");
      }
    }
  };
//Edit 
const handleEditMotel = (motel) => {
    console.log(motel)
    setEditMotel(motel);
    setEditRoomSets(motel.room_types); // Load existing rooms
    setShowEditForm(true);
  };
  
const handleRoomChange = (index, field, value) => {
  const updatedRooms = [...editRoomSets];
  updatedRooms[index][field] = value;
  setEditRoomSets(updatedRooms);
};

const handleAdduRoomSet = () => {
  setEditRoomSets([...editRoomSets, { roomType: "", numRooms: 1, startNumber: "" }]);
};

const handleUpdateMotel = async () => {
  const totalRooms = editRoomSets.reduce((sum, room) => sum + parseInt(room.numRooms || 0), 0);

  if (totalRooms > editMotel.motel_max_rooms) {
    Swal.fire("Error!", `Cannot exceed max rooms (${editMotel.motel_max_rooms}).`, "error");
    return;
  }

  try {
    console.log(editRoomSets)
    await axios.put(`${MOTEL_API_URL}/${editMotel.motel_id}`, { roomSets: editRoomSets });
    Swal.fire("Updated!", "Motel room details updated successfully.", "success");
    setShowEditForm(false);
    fetchMotelData();
  } catch (error) {
    Swal.fire("Error!", error.response.data.error, "error");
  }
};
///////////////////////////
  const handleAddRoomSet = () => {
    setNewMotel((prevMotel) => ({
      ...prevMotel,
      roomSets: [
        ...prevMotel.roomSets,
        { roomType: "", numRooms: "", startNumber: "" },
      ],
    }));
  };

  const handleRoomSetChange = (index, field, value) => {
    const updatedRoomSets = [...newMotel.roomSets];
    updatedRoomSets[index][field] = value;
    setNewMotel({ ...newMotel, roomSets: updatedRoomSets });
  };

  const handleDeleteRoomSet = (index) => {
    const updatedRoomSets = newMotel.roomSets.filter((_, i) => i !== index);
    setNewMotel({ ...newMotel, roomSets: updatedRoomSets });
  };

  const filteredRooms = selectedRoomType
    ? rooms.filter((room) => room.roomtypename === selectedRoomType)
    : rooms;

  return (
    <div className="p-4">
      <h1 className="mb-4">Motel Management</h1>
      
      <button className="btn btn-primary mb-3" onClick={() => setShowCreateForm(true)}>
        Create Motel & Rooms
      </button>

      {showCreateForm && (
        <div className="card p-3 mb-3">
          <h3>Create New Motel</h3>
          <input
            className="form-control mb-2"
            placeholder="Motel Name"
            value={newMotel.Name}
            onChange={(e) => setNewMotel({ ...newMotel, Name: e.target.value })}
          />
          <input
            className="form-control mb-2"
            placeholder="Motel Location"
            value={newMotel.Location}
            onChange={(e) => setNewMotel({ ...newMotel, Location: e.target.value })}
          />
           <input
            className="form-control mb-2"
            placeholder="Max NumOfRooms"
            type="number"
            value={newMotel.max_rooms}
            onChange={(e) => setNewMotel({ ...newMotel, max_rooms: e.target.value })}
          />
          <button className="btn btn-success mb-3" onClick={handleAddRoomSet}>
            Add Room Set
          </button>
          {newMotel.roomSets.map((roomSet, index) => (
            <div key={index} className="mb-3">
              <select
                className="form-select mb-2"
                value={roomSet.roomType}
                onChange={(e) => handleRoomSetChange(index, "roomType", e.target.value)}
              >
                <option value="">Select Room Type</option>
                {roomTypes.map((type) => (
                  <option key={type.id} value={type.roomtypename}>
                    {type.roomtypename}
                  </option>
                ))}
              </select>
              <input
                className="form-control mb-2"
                placeholder="Number of Rooms"
                type="number"
                value={roomSet.numRooms}
                onChange={(e) => handleRoomSetChange(index, "numRooms", e.target.value)}
              />
              <input
                className="form-control mb-2"
                placeholder="Start Room Number (101-A)"
                type="text"
                value={roomSet.startNumber}
                onChange={(e) => handleRoomSetChange(index, "startNumber", e.target.value)}
              />
              <button
                className="btn btn-danger btn-sm mt-2"
                onClick={() => handleDeleteRoomSet(index)}
              >
                Delete Room Set
              </button>
            </div>
          ))}
         <div className="row">
  <div className="col d-flex gap-2">
    <button className="btn btn-success" onClick={handleCreateMotel}>Save</button>
    <button className="btn btn-danger" onClick={() => setShowCreateForm(false)}>Cancel</button>
  </div>
</div>
        </div>
      )}

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Motel Name</th>
            <th>Location</th>
            <th>Room Types</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {motels.map((motel) => (
            <tr key={motel.motel_id}>
              <td>{motel.motel_name}</td>
              <td>{motel.motel_location}</td>
              <td>
                {motel.room_types.map((roomType, i) => (
                  <span key={i} className="badge bg-secondary me-1">
                    {roomType.roomtypename} ({roomType.room_count})
                  </span>
                ))}
              </td>
              <td>
                <button className="btn btn-info btn-sm me-2" onClick={() => handleViewRooms(motel)}>
                  View Rooms
                </button>
                <button className="btn btn-warning btn-sm me-2" onClick={() => handleEditMotel(motel)}>
    Edit
  </button>
                <button className="btn btn-danger btn-sm mt-2" onClick={() => handleDeleteMotel(motel.motel_id)}>
                  Delete Motel
                </button>
              </td>
              
            </tr>
          ))}
        </tbody>
      </table>

      {showRoomPopup && selectedMotel && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Rooms in {selectedMotel.motel_name}</h5>
                <button type="button" className="btn-close" onClick={() => setShowRoomPopup(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Filter by Room Type</label>
                  <select
                    className="form-select"
                    value={selectedRoomType}
                    onChange={(e) => setSelectedRoomType(e.target.value)}
                  >
                    <option value="">All</option>
                    {[...new Set(rooms.map((room) => room.roomtypename))].map((type, i) => (
                      <option key={i} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <ul className="list-group">
                  {filteredRooms.map((room, index) => (
                    <li key={index} className="list-group-item">
                      Room : {room.roomnumber} - {room.roomtypename}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowRoomPopup(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showEditForm && editMotel && (
  <div className="modal show d-block">
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Edit {editMotel.motel_name} Rooms</h5>
          <button type="button" className="btn-close" onClick={() => setShowEditForm(false)}></button>
        </div>
        <div className="modal-body">
          <p><strong>Location:</strong> {editMotel.motel_location}</p>
          <p><strong>Max Rooms:</strong> {editMotel.motel_max_rooms}</p>

          {editRoomSets.map((room, index) => (
            <div key={index} className="mb-3 border p-2 rounded">
              <label className="form-label">Room Type</label>
              <select
                className="form-select"
                value={room.roomtypename}
                onChange={(e) => handleRoomChange(index, "roomtypename", e.target.value)}
              >
                <option value="">Select Room Type</option>
                {availableRoomTypes.map((type) => (
                  <option key={type.id} value={type.roomtypename}>{type.roomtypename}</option>
                ))}
              </select>

              <label className="form-label mt-2">Number of Rooms</label>
              <input
                type="number"
                className="form-control"
                min="1"
                value={room.room_count}
                onChange={(e) => handleRoomChange(index, "room_count", e.target.value)}
              />

              <label className="form-label mt-2">Start Room Number</label>
              <input
                type="text"
                className="form-control"
                placeholder="101-A"
                value={room.start_room_number}
                onChange={(e) => handleRoomChange(index, "start_room_number", e.target.value)}
              />

              <button className="btn btn-danger btn-sm mt-2" onClick={() => setEditRoomSets(editRoomSets.filter((_, i) => i !== index))}>
                Remove Room Set
              </button>
            </div>
          ))}

          <button className="btn btn-primary mt-3" onClick={handleAdduRoomSet}>
            Add New Room Type
          </button>
        </div>
        <div className="modal-footer">
          <button className="btn btn-success" onClick={handleUpdateMotel}>Save</button>
          <button className="btn btn-secondary" onClick={() => setShowEditForm(false)}>Cancel</button>
        </div>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default MotelManagement;
