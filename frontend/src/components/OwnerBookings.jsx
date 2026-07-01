import React, { useState, useEffect } from 'react';

const OwnerBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/owner-booking',{
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

        if (!res.ok) {
          throw new Error(`Server error: ${res.status} ${res.statusText}`);
        }

        const data = await res.json();

        let bookingList = [];

        if (Array.isArray(data)) {
        bookingList = data;
        } else if (data.bookings && Array.isArray(data.bookings)) {
        bookingList = data.bookings;
        } else if (data.data && Array.isArray(data.data)) {
        bookingList = data.data;
        } else if (data.venues) {   // in case you still get venues
        bookingList = data.venues;
        }

        setBookings(bookingList);
      } catch (err) {
        console.error("Fetch failed:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) return <p>Loading bookings...</p>;

  if (error) {
    return (
      <div style={{ padding: "20px", color: "red" }}>
        <h1>Error Loading Bookings</h1>
        <p>{error}</p>
        <p>Check your backend is running and the URL is correct.</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  return (
  <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
      <h1>My Venue Bookings</h1>
      <button 
        onClick={() => window.location.reload()} 
        style={{ padding: "8px 16px" }}
      >
        ← Back to Dashboard
      </button>
    </div>

    {bookings.length === 0 ? (
      <p>No bookings found for your venues yet.</p>
    ) : (
      <div>
        <h2>Total Bookings: {bookings.length}</h2>
        
        <div style={{ display: "grid", gap: "20px" }}>
          {bookings.map((booking, i) => (
            <div 
              key={i} 
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "20px",
                backgroundColor: "#f9f9f9"
              }}
            >
              <h3 style={{ marginTop: 0, color: "#333" }}>
                {booking.venue_name || `Booking #${booking.id}`}
              </h3>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px" }}>
                <div>
                  <strong>Status:</strong> 
                  <span style={{ 
                    padding: "4px 12px", 
                    borderRadius: "20px", 
                    backgroundColor: booking.status === 'confirmed' ? '#d4edda' : '#fff3cd',
                    color: booking.status === 'confirmed' ? '#155724' : '#856404',
                    marginLeft: "8px"
                  }}>
                    {booking.status}
                  </span>
                </div>

                <div><strong>Start:</strong> {new Date(booking.start_datetime).toLocaleString()}</div>
                <div><strong>End:</strong> {new Date(booking.end_datetime).toLocaleString()}</div>
                <div><strong>Total Price:</strong> ₹{parseFloat(booking.total_price).toLocaleString()}</div>
                <div><strong>Booked By User ID:</strong> {booking.user_id}</div>
              </div>

              {booking.notes && (
                <div style={{ marginTop: "15px" }}>
                  <strong>Notes:</strong> {booking.notes}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
);
};

export default OwnerBookings;