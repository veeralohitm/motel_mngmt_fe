import React, { useState, useEffect } from "react";
import axios from "axios";
import Tesseract from "tesseract.js";
import { BASE_URL } from "../../links";
import BookingPopup from "./bookingpopup";


const MOTEL_API_URL = `${BASE_URL}motels`;
const ROOMS_API_URL = `${BASE_URL}rooms`;
const ROOMTYPE_API_URL = `${BASE_URL}roomtypes`;

const Reserve = () => {
  const [step, setStep] = useState(1);
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
  const [currentPage, setCurrentPage] = useState(1);
  const roomsPerPage = 5;





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

  const handleChange = (e, section) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [name]: type === "checkbox" ? checked : value,
      },
    }));
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
  const indexOfLastRoom = currentPage * roomsPerPage;
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
  const currentRooms = availableRooms.slice(indexOfFirstRoom, indexOfLastRoom);
  const totalPages = Math.ceil(availableRooms.length / roomsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
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
      <div class="row">
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
          {currentRooms.map((room) => (
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
      <nav>
        <ul className="pagination">
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>
              Previous
            </button>
          </li>
          {[...Array(totalPages)].map((_, index) => (
            <li key={index} className={`page-item ${currentPage === index + 1 ? "active" : ""}`}>
              <button className="page-link" onClick={() => setCurrentPage(index + 1)}>
                {index + 1}
              </button>
            </li>
          ))}
          <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
            <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>
              Next
            </button>
          </li>
        </ul>
      </nav>
     

     <BookingPopup 
        selectedRooms={selectedRooms}
        showPopup={showPopup}
        setShowPopup={setShowPopup}
        />
    {/*   {showPopup && (
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
                <p>You are booking:</p>
<ul>
  {selectedRooms.map((room, index) => (
    <li key={index}>
      Room {room.roomnumber} - {room.roomtypename}
    </li>
  ))}
</ul>
                  </div>
                  {step === 1 && (
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
              </div> 
               )}
                {step === 2 && (
              <div>
                <h4>Rates</h4>
                {selectedMotel && (
        <div className="mb-3">
          <label className="form-label">Select Room Type:</label>
          <select className="form-select" value={formData.room.roomType} onChange={(e) => handleChange(e, "room")} >
            {roomTypes.map((type) => (
              <option key={type.roomtypename} value={type.roomtypename}>{type.roomtypename}</option>
            ))}
          </select>
        </div>
      )}
                <select name="rateType" className="form-select mb-2" value={formData.room.rateType} onChange={(e) => handleChange(e, "room")}>
                  <option value="weekday_rate">Weekday Rate</option>
                  <option value="weekend_rate">Weekend Rate</option>
                </select>
                <h4>Taxes & Discounts</h4>
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" name="taxExempt" checked={formData.billing.taxExempt} onChange={(e) => handleChange(e, "billing")} />
                  <label className="form-check-label">Tax Exempt</label>
                </div>
                {!formData.billing.taxExempt && (
                  <input name="taxRate" type="number" className="form-control mb-2" value={formData.billing.taxRate} onChange={(e) => handleChange(e, "billing")} />
                )}
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" name="discountApplied" checked={formData.billing.discountApplied} onChange={(e) => handleChange(e, "billing")} />
                  <label className="form-check-label">Apply Discount</label>
                </div>
                {formData.billing.discountApplied && (
                  <div>
                    <select name="discountType" className="form-select mb-2" value={formData.billing.discountType} onChange={(e) => handleChange(e, "billing")}>
                      <option value="Fixed Amount">Fixed Amount</option>
                      <option value="Percentage">Percentage</option>
                    </select>
                    <input name="discountValue" type="number" className="form-control" value={formData.billing.discountValue} onChange={(e) => handleChange(e, "billing")} />
                  </div>
                )}
              </div>
            )}
             {step === 3 && (
              <div>
                <h4>Payment</h4>
                <select name="paymentType" className="form-select mb-2" value={formData.billing.paymentType} onChange={(e) => handleChange(e, "billing")}>
                  <option value="Cash">Cash</option>
                  <option value="Card">Card</option>
                  <option value="Direct Billing">Direct Billing</option>
                </select>
                <h5>Total Amount: ${formData.billing.finalAmount}</h5>
              </div>
            )}
              </div></div>
              <div className="modal-footer">
              {step > 1 && <button className="btn btn-secondary" onClick={() => setStep(step - 1)}>Back</button>}
            {step < 3 && <button className="btn btn-primary" onClick={() => setStep(step + 1)}>Next</button>}
            {step === 3 && <button className="btn btn-success" onClick={() => alert("Reservation Submitted!")}>Submit</button>}
                <button type="button" className="btn btn-secondary" onClick={() => setShowPopup(false)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )} */}

    </div>
  );
};

export default Reserve;
