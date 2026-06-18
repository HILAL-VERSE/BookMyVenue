import React, { useState, useEffect } from 'react';

const VenuesList = () => {
  // State to store the venues array
  const [venues, setVenues] = useState([]);
  // State to handle loading screens
  const [loading, setLoading] = useState(true);
  // State to handle error UI
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/venues');
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Note: If you implemented the controller refactor from the previous step,
        // your data structure might be 'data.data'. If not, it is just 'data'.
        setVenues(Array.isArray(data) ? data : data.data || []);
      } catch (err) {
        console.error("Error fetching data on frontend:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVenues();
  }, []); // Empty dependency array ensures this runs exactly ONCE when the component loads

  // 1. Conditional Rendering for Loading state
  if (loading) return <p style={{ padding: '20px' }}>Loading venues...</p>;
  
  // 2. Conditional Rendering for Error state
  if (error) return <p style={{ color: 'red', padding: '20px' }}>Error: {error}</p>;

  // 3. Render the fetched data onto the page
  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>Available Venues ({venues.length})</h2>
      
      <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
        {venues.map((venue) => (
          <div 
            key={venue.id} 
            style={{ 
              border: '1px solid #ccc', 
              borderRadius: '8px', 
              padding: '16px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>{venue.name}</h3>
            <p style={{ color: '#666', fontSize: '14px' }}>{venue.description}</p>
            <p><strong>City:</strong> {venue.city}</p>
            <p><strong>Address:</strong> {venue.address}</p>
            <p><strong>Capacity:</strong> {venue.capacity} people</p>
            <p style={{ color: '#007bff', fontWeight: 'bold' }}>
              ₹{venue.price_per_hour} / hour
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VenuesList;
