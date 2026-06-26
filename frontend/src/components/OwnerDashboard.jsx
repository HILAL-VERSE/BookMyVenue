import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const OwnerDashboard = () => {
    const navigate = useNavigate();
    const [venues, setVenues] = useState([]); // Renamed for clarity
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
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
        <div style={{ padding: '30px', maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ color: '#dc3545' }}>Owner's Dashboard</h2>
            <h3>Your Venues Details</h3>
            
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

            <button onClick={handleLogout} style={{ float: 'right', padding: '8px 15px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Logout</button>
        </div>
    );
};

export default OwnerDashboard;   