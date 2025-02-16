import React, { useState, useEffect } from "react";
import axios from "axios";
import Tesseract from "tesseract.js";


//const BASE_URL = "http://localhost:3000/";
const BASE_URL = "https://hotel-app-bk.onrender.com/"
const MOTEL_API_URL = `${BASE_URL}motels`;
const ROOMS_API_URL = `${BASE_URL}rooms`;
const ROOMTYPE_API_URL = `${BASE_URL}roomtypes`;

const Reserve = () => {
  const [motels, setMotels] = useState([]);
  const [selectedMotel, setSelectedMotel] = useState("");
  const [roomTypes, setRoomTypes] = useState([]);
  const [selectedRoomType, setSelectedRoomType] = useState("");
  const [rooms, setRooms] = useState([]);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [file, setFile] = useState(null);
  const [customerDetails, setCustomerDetails] = useState({});
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [showIdPopup, setShowIdPopup] = useState(false);
  const [nights, setNights] = useState(1);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);

  const handleIdScan = (file) => {
    // Simulating ID scan and extracting details
    const scannedData = {
      firstName: "John",
      lastName: "Doe",
      streetName: "123 Main St",
      city: "New York",
      state: "NY",
      zipcode: "10001",
      country: "USA",
      phone: "123-456-7890",
    };
    setCustomerDetails(scannedData);
  };
  const handleNightsChange = (e) => {
    setNights(Number(e.target.value));
    if (checkInDate) {
      const newCheckout = new Date(checkInDate);
      newCheckout.setDate(newCheckout.getDate() + Number(e.target.value));
      setCheckOutDate(newCheckout.toISOString().split("T")[0]);
    }
  };

  const handleCheckInChange = (e) => {
    setCheckInDate(e.target.value);
    const newCheckout = new Date(e.target.value);
    newCheckout.setDate(newCheckout.getDate() + nights);
    setCheckOutDate(newCheckout.toISOString().split("T")[0]);
  };


  useEffect(() => {
    fetchMotels();
  }, []);

  const fetchMotels = async () => {
    try {
      const response = await axios.get(MOTEL_API_URL);
      setMotels(response.data);
    } catch (error) {
      console.error("Error fetching motels:", error);
    }
  };

  const fetchRoomTypes = async (motelId) => {
    try {
      const { data } = await axios.get(`${ROOMS_API_URL}?motel_id=${motelId}`);
      setRoomTypes(data);
    } catch (error) {
      console.error("Error fetching room types: ", error);
    }
  };

  const fetchRooms = async (motelId, roomType) => {
    try {
      console.log(motelId,roomType)
      const { data } = await axios.get(`${BASE_URL}avl_rooms?motel_id=${motelId}&roomtypename=${roomType}`);
      //const { data: bookings } = await axios.get("/api/book_a_room");
      //const bookedRoomIds = new Set(bookings.map((booking) => booking.room_id));
      //const filteredRooms = data.filter((room) => !bookedRoomIds.has(room.id));
      console.log(data.available_rooms);
      setRooms(data);
      setAvailableRooms(data.available_rooms);
    } catch (error) {
      console.error("Error fetching rooms: ", error);
    }
  };

  const handleMotelChange = (e) => {
    const motelId = e.target.value;
    console.log(motelId)
    setSelectedMotel(motelId);
    const selectedMotelData = motels.find(motel => motel.motel_name === motelId);
    if (selectedMotelData) {
      console.log(selectedMotelData)
      setRoomTypes(selectedMotelData.room_types);
    }
  };

  const handleRoomTypeChange = (e) => {
    const roomType = e.target.value;
    setSelectedRoomType(roomType);
    fetchRooms(selectedMotel, roomType);
  };

  const handleSelectRoom = (room) => {
    setSelectedRooms([...selectedRooms, room]);
    //console.log(selectedRooms)
  };

  const handleRemoveRoom = (roomId) => {
    setSelectedRooms(selectedRooms.filter(room => room.room_id !== roomId));
  };
  const handleFileUpload = (event) => {
    setFile(event.target.files[0]);
    // Placeholder for OCR logic to extract details
    if (file) {
      const reader = new FileReader();
      reader.onload = async () => {
        const imageUrl = reader.result;
        
        // Perform OCR
        Tesseract.recognize(imageUrl, "eng", {
          logger: (m) => console.log(m), // Shows progress
        }).then(({ data: { text } }) => {
          console.log("OCR Text:", text);
  
          // Extract details from text (adjust regex based on license format)
          const firstNameMatch = text.match(/First Name:\s*([A-Za-z]+)/i);
          const lastNameMatch = text.match(/Last Name:\s*([A-Za-z]+)/i);
          const addressMatch = text.match(/Address:\s*(.+)/i);
  
          setCustomerDetails({
            firstName: firstNameMatch ? firstNameMatch[1] : "",
            lastName: lastNameMatch ? lastNameMatch[1] : "",
            address: addressMatch ? addressMatch[1] : "",
            photo: imageUrl, // Store the uploaded image
          });
          console.log(customerDetails)
        }).catch((error) => {
          console.error("OCR Error:", error);
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBookRooms = () => {
    setShowPopup(true);
  };

  return (
    <div className="p-4">
      <h1 className="mb-4">Reserve a Room</h1>
      <div className="mb-3">
        <label className="form-label">Select Motel:</label>
        <select className="form-select" onChange={handleMotelChange} value={selectedMotel}>
          <option value="">Select a Motel</option>
          {motels.map((motel) => (
            <option key={motel.id} value={motel.id}>{motel.motel_name}</option>
          ))}
        </select>
      </div>
      {selectedMotel && (
        <div className="mb-3">
          <label className="form-label">Select Room Type:</label>
          <select className="form-select" onChange={handleRoomTypeChange} value={selectedRoomType}>
          <option value="">All</option>
            {roomTypes.map((type) => (
              <option key={type.roomtypename} value={type.roomtypename}>{type.roomtypename}</option>
            ))}
          </select>
        </div>
      )}
       <div className="mt-3 mb-3">
        <h4>Selected Rooms ({selectedRooms.length}):</h4>
        <ul>
          {selectedRooms.map((room) => (
            <li key={room.room_id} className="mt-2">
              {room.roomnumber} <button className="btn btn-danger btn-sm" onClick={() => handleRemoveRoom(room.room_id)}>Remove</button>
            </li>
          ))}
        </ul>
        {selectedRooms.length > 0 && (
          <button className="btn btn-success" onClick={handleBookRooms}>Book</button>
        )}
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
            <tr key={room.room_id}>
              <td>{room.roomnumber}</td>
              <td>{room.roomtypename}</td>
              <td>
                <button className="btn btn-primary" onClick={() => handleSelectRoom(room)}>Add</button>
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
                <h5 className="modal-title">Book Selected Rooms</h5>
                <button type="button" className="btn-close" onClick={() => setShowPopup(false)}></button>
              </div>
              <div className="modal-body d-flex">
                <div class="container">
                <div class="row">
                <p>You are booking: {selectedRooms.map((room) => room.roomnumber).join(", ")}</p>
                  </div>
<div class="row">
          
              <div className="w-50 pe-3">
                <div className="mb-3">
                  <label className="form-label">Check-in Date</label>
                  <input type="date" className="form-control" value={checkInDate} onChange={handleCheckInChange} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Nights</label>
                  <input type="number" className="form-control" value={nights} onChange={handleNightsChange} min="1" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Check-out Date</label>
                  <input type="date" className="form-control" value={checkOutDate} readOnly />
                </div>
                <div className="mb-3">
                  <label className="form-label">Rooms Selected: {selectedRooms.length}</label>
                </div>
                <div className="mb-3">
                  <label className="form-label">Adults</label>
                  <input type="number" className="form-control" value={adults} onChange={(e) => setAdults(e.target.value)} min="1" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Children</label>
                  <input type="number" className="form-control" value={children} onChange={(e) => setChildren(e.target.value)} min="0" />
                </div>
              </div>
              <div className="w-50 ps-3">
                <button className="btn btn-primary mb-3" onClick={() => setShowIdPopup(true)}>Scan ID</button>
                {showIdPopup && (
                  <div className="modal show d-block" tabIndex="-1">
                    <div className="modal-dialog">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h5 className="modal-title">Upload Driving License</h5>
                          <button type="button" className="btn-close" onClick={() => setShowIdPopup(false)}></button>
                        </div>
                        <div className="modal-body">
                          <input type="file" className="form-control" onChange={(e) => handleIdScan(e.target.files[0])} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div className="mb-3">
                  <label className="form-label">First Name</label>
                  <input type="text" className="form-control" value={customerDetails.firstName || ""} readOnly />
                </div>
                <div className="mb-3">
                  <label className="form-label">Last Name</label>
                  <input type="text" className="form-control" value={customerDetails.lastName || ""} readOnly />
                </div>
                <div className="mb-3">
                  <label className="form-label">Street Name</label>
                  <input type="text" className="form-control" value={customerDetails.streetName || ""} readOnly />
                </div>
                <div className="mb-3">
                  <label className="form-label">City</label>
                  <input type="text" className="form-control" value={customerDetails.city || ""} readOnly />
                </div>
                <div className="mb-3">
                  <label className="form-label">State</label>
                  <input type="text" className="form-control" value={customerDetails.state || ""} readOnly />
                </div>
                <div className="mb-3">
                  <label className="form-label">Zip Code</label>
                  <input type="text" className="form-control" value={customerDetails.zipcode || ""} readOnly />
                </div>
                <div className="mb-3">
                  <label className="form-label">Phone</label>
                  <input type="text" className="form-control" value={customerDetails.phone || ""} readOnly />
                </div>
              </div>
              </div> </div></div>
              <div className="modal-footer">
              <button type="button" className="btn btn-primary">Submit</button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowPopup(false)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reserve;
