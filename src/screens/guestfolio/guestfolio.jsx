import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BASE_URL } from "../../links";

const GuestFolio = () => {
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://api.example.com/guestfolio') // Replace with actual API URL
      .then((response) => response.json())
      .then((data) => {
        setGuests(data.slice(0, 10)); // Show only 10 rows
        setLoading(false);
      })
      .catch((error) => console.error('Error fetching guest data:', error));
  }, []);

  const handleCheckout = (id) => {
    console.log(`Checking out guest with ID: ${id}`);
    // Add logic for checking out a guest
  };

  const handleRebook = (id) => {
    console.log(`Rebooking guest with ID: ${id}`);
    // Add logic for rebooking a guest
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Guest Folio</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="table table-striped table-bordered">
          <thead className="table-dark">
            <tr>
              <th>Full Name</th>
              <th>Room Number</th>
              <th>Folio Number</th>
              <th>Check-in</th>
              <th>Departure Date</th>
              <th>Payment Type</th>
              <th>Reference</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {guests.map((guest) => (
              <tr key={guest.id}>
                <td>{guest.fullName}</td>
                <td>{guest.roomNumber}</td>
                <td>{guest.folioNumber}</td>
                <td>{guest.checkIn}</td>
                <td>{guest.departureDate}</td>
                <td>{guest.paymentType}</td>
                <td>{guest.reference}</td>
                <td>
                  <button
                    className="btn btn-success btn-sm me-2"
                    onClick={() => handleRebook(guest.id)}
                  >
                    Rebook
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleCheckout(guest.id)}
                  >
                    Checkout
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default GuestFolio;