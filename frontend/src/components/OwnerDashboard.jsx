import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import VenuesBooking from './OwnerBookings';

const OwnerDashboard = () => {
    const navigate = useNavigate();
    const [venues, setVenues] = useState([]); 
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [venuesBooking, setVenuesBooking] = useState([]);
    const [showBooking, setShowBooking] = useState(false);
    const [showBookingsPage, setShowBookingsPage] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    const handleVenueBookingsClick = () => {
    setShowBookingsPage(true);
  };

   
    useEffect(() => {
        const fetchVenues = async () => {
            try {
                const token = localStorage.getItem('token');
                
                const response = await fetch('http://localhost:5000/api/owner-venues', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                const data = await response.json();
                

                if (!response.ok) {
                    throw new Error(data.message || "Failed to fetch venues");
                }

                if (data.venues) {
                    setVenues(data.venues);
                } else if (data.count === 0) {
                    setVenues([]);
                } else {
                    throw new Error("Invalid data format received from server");
                }

               
                
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchVenues();
    }, []);

    if (loading) return <p style={{ padding: '20px' }}>Loading venues...</p>;
    if (error) return <p style={{ padding: '20px', color: 'red' }}>Error: {error}</p>;

    return (
        <div>
            {!showBookingsPage ? (
                    <div style={{ padding: '30px', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
            <h2 style={{ color: '#dc3545' }}>Owner's Dashboard</h2>
            <h3>Your Venues Details</h3>
            </div>
            <div style={{ display: 'flex', marginBottom: '20px', gap: '10px' }}>
                <button onClick={handleLogout} style={{ float: 'right', padding: '8px 15px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Logout</button>
                <button onClick={() => setShowBookingsPage(true)} style={{ float: 'right', padding: '8px 15px', backgroundColor: '#26199a', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>My venue's booking</button>
            </div>
            </div>
            {venues.length === 0 ? (
                <p>No venues found.</p>
            ) : (
                <div style={{ display: 'grid', gap: '15px', marginTop: '20px' }}>
                    {venues.map((venue) => (
                        <div key={venue.id} style={{ border: '1px solid #dc3545', padding: '15px', borderRadius: '6px', backgroundColor: '#fff5f5' }}>
                            
                            <p><strong>Name:</strong> {venue.name}</p>
                            <p><strong>City:</strong> {venue.city}</p>
                            <p><strong>Address:</strong> {venue.address}</p>
                            <p><strong>Capacity:</strong> {venue.capacity}</p>
                        </div>
                    ))}
                </div>
            )}

            
        </div>
            ) : (
                <VenuesBooking />
            ) }
        </div>
        
    );
    
};

export default OwnerDashboard;   