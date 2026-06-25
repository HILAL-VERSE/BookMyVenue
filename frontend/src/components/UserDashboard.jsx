import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BookingForm from './BookingForm';

const UserDashboard = () => {
    const navigate = useNavigate();
    const [ venues, setVenues ] = useState([]);
    const [ error, setError ] = useState('');
    const [loading, setLoading] = useState(true);

    const [selectedVenue, setSelectedVenue ] = useState(null);

    const handleLogout = () => {
        localStorage.removeItem('token'); 
        navigate('/'); 
    };

    const handleBooking = (venue) =>{
        setSelectedVenue(venue);
    };

    const handleCloseForm = () => {
        setSelectedVenue(null);
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

            {selectedVenue && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000
                }}>
                    <div style={{ position: 'relative' }}>
                    <BookingForm 
                        venueId={selectedVenue.id} 
                        venueName={selectedVenue.name} 
                        onClose={handleCloseForm}
                    />
                    </div>
                </div>
            )}


            <h2>Available Venues</h2>
            <div style={{display: 'grid', gap: '20px', marginTop: '20px'}}>
                {venues.map((venue) => (
                    <div key={venue.id} style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '6px'}}>
                        <h3>{venue.name}</h3>
                        <p>Location : {venue.location}</p>
                        <p>Capacity: {venue.capacity}</p>
                        <button 
                            onClick={() => handleBooking(venue)}
                            style={{
                                marginTop: '10px',
                                padding: '8px 12px',
                                backgroundColor: '#007bff',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                width: '100%'
                            }}
                            >
                            Book Venue
                        </button>
                    </div>
                ))}
            </div>
            <button onClick={handleLogout} style={{ float: 'right', padding: '8px 15px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Logout</button>
        </div>
    );
};

export default UserDashboard;
