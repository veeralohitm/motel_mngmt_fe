import React, { useState, useEffect } from "react";
import { BASE_URL } from "../../links";
import axios from "axios";
import Swal from 'sweetalert2';

const RATE_API_URL = `${BASE_URL}get-room-rate`;
const RESERVE_API_URL = `${BASE_URL}reserve`;

const BookingPopup = ({ selectedRooms, showPopup, setShowPopup }) => {
  if (!showPopup) return null;

  const [step, setStep] = useState(1);
  const [rates, setRates] =useState([]);
  const [showIdPopup, setShowIdPopup] = useState(false);
  const [selectedRateType, setSelectedRateType] = useState("weekday_rate"); // Default selection
  const [baseAmount, setBaseAmount] = useState(0);

  const [formData, setFormData] = useState({
    guest: {
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
      street: "",
      city: "",
      state: "",
      zip_code: "",
      id_type: "",
      id_number: "",
      profile_id:"",
    },
    room: {
      roomnumber: selectedRooms[0]?.roomnumber || "",
      roomtypename: selectedRooms[0]?.roomtypename,
      rateType: "",
    },
    reservation:{
      nights: 1,
      check_in_date: "",
      check_out_date: "",
      reference:"",
      adults: 0,
      children: 0,
      rooms: selectedRooms.length,
    },
    billing: {
      taxExempt: false,
      tax_name: "City Tax",
      tax_rate: 7.5,
      discountApplied: false,
      discount_type: "Fixed Amount",
      discount_rate: 10,
      payment_type: "Cash",
      base_amount: 0,
      tax_amount: 0,
      discount_amount: 0,
      final_amount: 0,
      totalAfterTax: 0,
      totalBeforeTax: 0,
    },
  });

  useEffect(() => {
    //console.log(selectedRooms)
    const roomtypename = selectedRooms[0].roomtypename;
    fetchRates(roomtypename);
  }, []);

  const fetchRates = async (roomtypename) => {
    try {
      const response = await axios.post(RATE_API_URL,{roomtypename});
      setRates(response.data);
    } catch (error) {
      console.error("Error fetching motels:", error);
    }
  };
  const handleRateChange = (e) => {
    const rateType = e.target.value;
    
    setFormData((prev) => {
      const updatedBaseAmount = rates[0][rateType] || 0;
      const BaseAmount = Number(updatedBaseAmount);
      return calculateBilling({
        ...prev,
        room: { ...prev.room, rateType },
        billing: { ...prev.billing, base_amount: BaseAmount },
      });
    });
  };

  const calculateBilling = (data) => {
    let { base_amount, taxExempt, tax_rate, discountApplied, discount_type, discount_rate } = data.billing;
    let {nights} = data.reservation;
    //console.log(base_amount)
    nights = Number(nights);
    base_amount = Number(base_amount);
    tax_rate = Number(tax_rate);
    discount_rate = Number(discount_rate);
    //console.log(nights)
    // Calculate total before tax
    let totalBeforeTax = base_amount * nights;
    //console.log(totalBeforeTax)
    // Calculate tax if not exempt
    let taxAmount = taxExempt ? 0 : (totalBeforeTax * tax_rate) / 100;
    let totalAfterTax = totalBeforeTax + taxAmount;
  
    // Apply discount if applicable
    let discountAmount = 0;
    if (discountApplied) {
      if (discount_type === "Fixed Amount") {
        discountAmount = discount_rate;
      } else if (discount_type === "Percentage") {
        discountAmount = (totalAfterTax * discount_rate) / 100;
      }
    }
  
    let final_amount = totalAfterTax - discountAmount;
    //console.log(final_amount)
    return {
      ...data,
      billing: {
        ...data.billing,
        totalBeforeTax,
        totalAfterTax,
        final_amount,
      },
    };
  };
  const handleChange = (e, section) => {
    const { value, name } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [section]: {
        ...prevData[section],
        [name]: value,
      },
    }));
  };
  const handlecheckChange = (e, section) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => {
      const newValue = type === "checkbox" ? checked : value;
      const updatedData = {
        ...prev,
        [section]: {
          ...prev[section],
          [name]: newValue,
        },
      };
  
      // Recalculate totals whenever billing data changes
      return calculateBilling(updatedData);
    });
  };
  
  useEffect(() => {
    setFormData((prev) => calculateBilling(prev));
  }, [formData.room.nights, formData.billing.base_amount, formData.billing.taxExempt, formData.billing.tax_rate, formData.billing.discountApplied, formData.billing.discount_type, formData.billing.discount_rate]);
  
  const handleIdScan = (file) => {
    const scannedData = {
      first_name: "John",
      last_name: "Doe",
      street: "123 Main St",
      city: "New York",
      state: "NY",
      country:"USA",
      zip_code: "10001",
      phone_number: "123-456-7890",
      id_type: "Driving License",
      id_number: "DGFF546576",
      email: "ddghdv@gmail.com",
      profile_id: "https://thispersondoesnotexist.com/",
    };
    setFormData((prev) => ({
      ...prev,
      guest: { ...prev.guest, ...scannedData },
    }));
    setShowIdPopup(false);
  };
  const handleSubmit = async () => {
    try {
      console.log(formData)
      await axios.post(RESERVE_API_URL, formData);
      //console.log(formData)
      Swal.fire({
        title: 'Success!',
        text: 'Room Reserved successfully.',
        icon: 'success',
        confirmButtonText: 'OK'
      });
      setShowPopup(false);
    } catch (error) {
      console.error("Error submitting reservation:", error);
      Swal.fire({
        title: 'Error!',
        text: error.response.data.error,
        icon: 'error',
        confirmButtonText: 'Retry'
    });}
  };


  const handleCheckInChange = (e) => {
    const newCheckIn = e.target.value;
    setFormData((prev) => {
      const newCheckOut = new Date(newCheckIn);
      newCheckOut.setDate(newCheckOut.getDate() + prev.reservation.nights);
      return {
        ...prev,
        reservation: {
          ...prev.reservation,
          check_in_date: newCheckIn,
          check_out_date: newCheckOut.toISOString().split("T")[0],
        },
      };
    });
  };

  const handleNightsChange = (e) => {
    const nights = Number(e.target.value);
    setFormData((prev) => {
      if (!prev.reservation.check_in_date) return prev;
      const newCheckOut = new Date(prev.reservation.check_in_date);
      newCheckOut.setDate(newCheckOut.getDate() + nights);
      return {
        ...prev,
        reservation: {
          ...prev.reservation,
          nights,
          check_out_date: newCheckOut.toISOString().split("T")[0],
        },
      };
    });
  };

  return (
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
            <p>You are booking:</p>
            <ul>
              {selectedRooms.map((room, index) => (
                <li key={index}>
                  Room {room.roomnumber} - {room.roomtypename}
                </li>
              ))}
            </ul>

            {step === 1 && (
              <div className="row">
                {/* Guest Details */}
                <h4>Guest Details</h4>
                  <button
                    className="btn btn-primary mb-3"
                    onClick={() => setShowIdPopup(true)}
                  >
                    Scan ID
                  </button>
                  {/* Display Guest Photo */}
{formData.guest.photo_url && (
  <div className="mb-3">
    <img
      src={formData.guest.profile_id}
      alt="Guest ID"
      className="img-fluid rounded"
      style={{ width: "150px", height: "150px", objectFit: "cover" }}
    />
  </div>
)}
                  <div className="mb-3">
                    <label className="form-label">First Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="first_name"
                      value={formData.guest.first_name}
                      onChange={(e) => handleChange(e, "guest")}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Last Name</label>
                    <input
                      type="text"
                      name="last_name"
                      className="form-control"
                      value={formData.guest.last_name}
                      onChange={(e) => handleChange(e, "guest")}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Street Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="street"
                      value={formData.guest.street}
                      onChange={(e) => handleChange(e, "guest")}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">City</label>
                    <input
                      type="text"
                      className="form-control"
                      name="city"
                      value={formData.guest.city}
                      onChange={(e) => handleChange(e, "guest")}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">State</label>
                    <input
                      type="text"
                      className="form-control"
                      name="state"
                      value={formData.guest.state}
                      onChange={(e) => handleChange(e, "guest")}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Country</label>
                    <input
                      type="text"
                      className="form-control"
                      name="country"
                      value={formData.guest.country}
                      onChange={(e) => handleChange(e, "guest")}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Phone</label>
                    <input
                      type="text"
                      className="form-control"
                      name="phone_number"
                      value={formData.guest.phone_number}
                      onChange={(e) => handleChange(e, "guest")}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Zip Code</label>
                    <input
                      type="text"
                      className="form-control"
                      name="zip_code"
                      value={formData.guest.zip_code}
                      onChange={(e) => handleChange(e, "guest")}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">ID Type</label>
                    <input
                      type="text"
                      className="form-control"
                      name="id_type"
                      value={formData.guest.id_type}
                      onChange={(e) => handleChange(e, "guest")}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">ID Number</label>
                    <input
                      type="text"
                      className="form-control"
                      name="id_number"
                      value={formData.guest.id_number}
                      onChange={(e) => handleChange(e, "guest")}
                    />
                </div>

              </div>
            )}
            {step === 2 && (
              <div>
                <h4>Rates</h4>
                {/* Room Booking Details */}
           
                <div className="mb-3">
                    <label className="form-label">Check-in Date</label>
                    <input
                      type="date"
                      className="form-control"
                      name = "check_in_date"
                      value={formData.reservation.check_in_date}
                      onChange={handleCheckInChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Nights</label>
                    <input
                      type="number"
                      className="form-control"
                      name = "nights"
                      value={formData.reservation.nights}
                      onChange={handleNightsChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Check-out Date</label>
                    <input
                      type="date"
                      className="form-control"
                      name = "check_out_date"
                      value={formData.reservation.check_out_date}
                      readOnly
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      Rooms Selected: {selectedRooms.length}
                    </label>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Adults</label>
                    <input
                      type="number"
                      className="form-control"
                      name = "adults"
                      value={formData.reservation.adults}
                      onChange={(e) => handleChange(e, "reservation")}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Children</label>
                    <input
                      type="number"
                      className="form-control"
                      name = "children"
                      value={formData.reservation.children}
                      onChange={(e) => handleChange(e, "reservation")}
                    />
                  </div>
                  <label className="form-label">Rate Type</label>
                  <select 
      name="rateType" 
      className="form-select mb-2" 
      
      value={selectedRateType} 
      onChange={handleRateChange}
    >
      <option value="weekday_rate">Weekday Rate</option>
      <option value="weekend_rate">Weekend Rate</option>
      <option value="weekly_rate">Weekly Rate</option>
    </select>

    {/* Display the selected rate value */}
    <p>Selected Rate Amount: ${formData.billing.base_amount}</p>
    <h4>Taxes & Discounts</h4>
    <div className="form-check">
      <input className="form-check-input" type="checkbox" name="taxExempt" checked={formData.billing.taxExempt} onChange={(e) => handlecheckChange(e, "billing")} />
      <label className="form-check-label">Tax Exempt</label>
    </div>

    {!formData.billing.taxExempt && (
      <>
       <label className="form-check-label">Tax Name (City/State)</label>
        <input name="tax_name" type="text" className="form-control mb-2" value={formData.billing.tax_name} onChange={(e) => handleChange(e, "billing")} />

        <label className="form-check-label">Tax Rate (%)</label>
        <input name="tax_rate" type="number" className="form-control mb-2" value={formData.billing.tax_rate} onChange={(e) => handleChange(e, "billing")} />
      </>
    )}

    <div className="form-check">
      <input className="form-check-input" type="checkbox" name="discountApplied" checked={formData.billing.discountApplied} onChange={(e) => handlecheckChange(e, "billing")} />
      <label className="form-check-label">Apply Discount</label>
    </div>

    {formData.billing.discountApplied && (
      <div>
        <select name="discount_type" className="form-select mb-2" value={formData.billing.discount_type} onChange={(e) => handleChange(e, "billing")}>
          <option value="Fixed Amount">Fixed Amount</option>
          <option value="Percentage">Percentage</option>
        </select>
        <label className="form-check-label">Discount Value</label>
        <input name="discount_rate" type="number" className="form-control" value={formData.billing.discount_rate} onChange={(e) => handleChange(e, "billing")} />
      </div>
    )}

    <h4>Billing Summary</h4>
    <p>Total Before Tax: ${formData.billing.totalBeforeTax.toFixed(2)}</p>
    <p>Total After Tax: ${formData.billing.totalAfterTax.toFixed(2)}</p>
    <p>Final Amount to Pay: ${formData.billing.final_amount.toFixed(2)}</p>
  </div>
            )}
            {step === 3 && (
              <div>
                <h4>Payment</h4>
                <select name="paymentType" className="form-select mb-2" value={formData.billing.payment_type} onChange={(e) => handleChange(e, "billing")}>
                  <option value="Cash">Cash</option>
                  <option value="Card">Card</option>
                  <option value="Direct Billing">Direct Billing</option>
                </select>
                <h5>Total Amount: ${formData.billing.final_amount}</h5>
                <div className="mb-3">
                    <label className="form-label">Reference</label>
                    <textarea
                      
                      className="form-control"
                      name = "reference"
                      value={formData.reservation.reference}
                      onChange={(e) => handleChange(e, "reservation")}
                    />
                  </div>

              </div>
            )}
          </div>
          <div className="modal-footer">
              {step > 1 && <button className="btn btn-secondary" onClick={() => setStep(step - 1)}>Back</button>}
            {step < 3 && <button className="btn btn-primary" onClick={() => setStep(step + 1)}>Next</button>}
            {step === 3 && <button className="btn btn-success" onClick={handleSubmit}>Submit</button>}
                <button type="button" className="btn btn-secondary" onClick={() => setShowPopup(false)}>Close</button>
              </div>
        </div>
      </div>

      {/* ID Upload Modal */}
      {showIdPopup && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Upload Driving License</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowIdPopup(false)}
                ></button>
              </div>
              <div className="modal-body">
                <input
                  type="file"
                  className="form-control"
                  onChange={(e) => handleIdScan(e.target.files[0])}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingPopup;
