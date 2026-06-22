import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
    const navigate = useNavigate();
    const [ venues, setVenues ] = useState([]);
    const [ error, setError ] = useState('');
    const [loading, setLoading] = useState(true);

    const handleLogout = () => {
        localStorage.removeItem('token'); // Clear token
        navigate('/'); // Redirect to home
    };


    useEffect(() => {
        const fetchVenues = async () => {
            try {
                const token = localStorage.getItem('token');
                const response  = await fetch('http://localhost:5000/venues', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                const data = await response.json();
                if(!response.ok){
                    throw new Error(data.message || "Failed to fecth venues");
                }

                setVenues(data);
            }catch(err){
                setError(err.message);
            }finally{
                setLoading(false);
            }
        };

        fetchVenues();
    }, []);

    if(loading) return <p style={{padding: '20px'}}>Loading Available Venues....</p>
    if (error) return <p style={{ padding: '20px', color: 'red' }}>Error: {error}</p>;

    return (
        <div style={{padding: '30px', maxWidth: '800px', margin: '0 auto'}}>
            <h2>Available Venues</h2>
            <div style={{display: 'grid', gap: '20px', marginTop: '20px'}}>
                {venues.map((venue) => (
                    <div key={venue.id} style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '6px'}}>
                        <h3>{venue.name}</h3>
                        <p>Location : {venue.location}</p>
                        <p>Capacity: {venue.capacity}</p>
                    </div>
                ))}
            </div>
            <button onClick={handleLogout} style={{ float: 'right', padding: '8px 15px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Logout</button>
        </div>
    );
};

export default UserDashboard;
