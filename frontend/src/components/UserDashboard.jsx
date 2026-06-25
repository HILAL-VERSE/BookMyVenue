import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BookingForm from './BookingForm';

const UserDashboard = () => {
    const navigate = useNavigate();
    const [ venues, setVenues ] = useState([]);
    const [ error, setError ] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedVenue, setSelectedVenue ] = useState(null);
    const [userBookings, setUserBookings] = useState([]);
    const [exploreVenueId, setExploreVenueId] = useState(null);
    const [exploreVenueData, setExploreVenueData] = useState(null);
    

    const [showBookingsModal, setShowBookingsModal] = useState(false);

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

    
    const handleCancelBooking = async (bookingId) => {
        const confirmCancel = window.confirm("Are you sure you want to cancel this booking?");
        if (!confirmCancel) return;

        try {
            const token = localStorage.getItem('token');
            
        
            const response = await fetch(`http://localhost:5000/api/booking/${bookingId}`, {
                method: 'PATCH', 
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to cancel booking");
            }

            alert(data.message || "Booking cancelled successfully!");
            
            


        } catch (err) {
            alert(`Error: ${err.message}`);
        }
    };

    const handleExploreButton = async (venueId) => {
        try {
            const token = localStorage.getItem('token');
            setExploreVenueId(venueId)
        
            const response = await fetch(`http://localhost:5000/api/venues/${venueId}`, {
                method: 'GET', 
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();
            setExploreVenueData(data.venue);
            console.log(data);
            console.log(exploreVenueData);

            if (!response.ok) {
                throw new Error(data.message || "Failed to get venue details");
            }


        } catch (err) {
            alert(`Error: ${err.message}`);
        }
    }


    const handleBackToDashboard = () => {
        setExploreVenueId(null);
        setExploreVenueData(null);
    };

    useEffect(() => {
        const token = localStorage.getItem('token');

        const fetchVenues = async () => {
            try {
                const response  = await fetch('http://localhost:5000/venues', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                
                const data = await response.json();
                 
                if(!response.ok){
                    throw new Error(data.message || "Failed to fetch venues");
                }

                setVenues(data);
            }catch(err){
                setError(err.message);
            }
        };

        const fetchUserBookings = async () => {
            try{
                const response = await fetch('http://localhost:5000/booking/my-bookings', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                const data = await response.json();

                if(!response.ok){
                    throw new Error(data.message || "Failed to fetch your bookings");
                }

                setUserBookings(data.bookings || []);
            }catch(err){
                console.error("History fetch error: ", err.message);
            }
        };

        Promise.all([fetchVenues(), fetchUserBookings()]).finally(() => {
            setLoading(false);
        });
    }, []);

    if(loading) return <p style={{padding: '20px'}}>Loading Available Venues....</p>
    if (error) return <p style={{ padding: '20px', color: 'red' }}>Error: {error}</p>;


    if (exploreVenueId && exploreVenueData) {
    return (
        <div style={{ padding: '30px', maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ border: '1px solid #ccc', padding: '25px', borderRadius: '8px' }}>
                <h2>{exploreVenueData.name}</h2>
                <p><strong>City:</strong> {exploreVenueData.city}</p>
                <p><strong>Address:</strong> {exploreVenueData.address}</p>
                <p><strong>Capacity:</strong> {exploreVenueData.capacity} people</p>
                <p><strong>Price:</strong> ${exploreVenueData.price_per_hour} / hour</p>
                <p><strong>Description:</strong> {exploreVenueData.description || 'No description provided.'}</p>
                
                <div style={{display: 'flex', justifyContent: 'start', alignItems: 'center', width: 'fill-content', gap: '30px'}}>
                <button 
                    onClick={() => {
                        setExploreVenueId(null);
                        setExploreVenueData(null);
                        handleBooking(exploreVenueData)}}
                    style={{ marginTop: '20px', padding: '10px', backgroundColor: '#3b0c67', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', width: '150px' }}
                >
                    Book Venue
                </button>
                <button onClick={handleBackToDashboard} style={{ marginTop: '20px', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', width: '200px' }}>
                ← Back to Dashboard
            </button>
            </div>
            </div>
        </div>
    );
}

    return (
        <div style={{padding: '30px', maxWidth: '800px', margin: '0 auto'}}>

            {selectedVenue && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex',
                    justifyContent: 'center', alignItems: 'center', zIndex: 1000
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

            {showBookingsModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex',
                    justifyContent: 'center', alignItems: 'center', zIndex: 1000
                }}>
                    <div style={{ 
                        backgroundColor: 'white', padding: '30px', borderRadius: '8px', 
                        width: '500px', maxHeight: '80vh', overflowY: 'auto', position: 'relative' 
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h2 style={{ margin: 0 }}>My Bookings</h2>
                            <button onClick={() => setShowBookingsModal(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>✕</button>
                        </div>
                        
                        {userBookings.length === 0 ? (
                            <p style={{ color: '#666', fontStyle: 'italic' }}>You don't have any booking records yet.</p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                {userBookings.map((booking) => (
                                    <div key={booking.id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '6px', backgroundColor: '#f9f9f9' }}>
                                        <h4 style={{ margin: '0 0 5px 0' }}>Booking #{booking.id}</h4>
                                        <p style={{ margin: '3px 0', fontSize: '14px' }}><strong>Start:</strong> {new Date(booking.start_datetime).toLocaleString()}</p>
                                        <p style={{ margin: '3px 0', fontSize: '14px' }}><strong>End:</strong> {new Date(booking.end_datetime).toLocaleString()}</p>
                                        <p style={{ margin: '3px 0', fontSize: '14px' }}><strong>Total Cost:</strong> 💰${booking.total_price}</p>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                                        <span style={{
                                            display: 'inline-block', marginTop: '5px', padding: '3px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold',
                                            backgroundColor: booking.status === 'confirmed' ? '#d1e7dd' : '#fff3cd',
                                            color: booking.status === 'confirmed' ? '#0f5132' : '#664d03'
                                        }}>{booking.status}
                                        </span>
                                         {booking.status !== 'cancelled' && (
                                            <button
                                                onClick={() => handleCancelBooking(booking.id)}
                                                style={{
                                                    padding: '6px 12px',
                                                    backgroundColor: '#dc3545',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '4px',
                                                    cursor: 'pointer',
                                                    fontSize: '13px'
                                                }}
                                            >Cancel</button>
                                        )}
                                    </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}


            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ margin: 0 }}>Available Venues</h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                        onClick={() => setShowBookingsModal(true)} 
                        style={{ padding: '8px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                        My Bookings
                    </button>
                    <button 
                        onClick={handleLogout} 
                        style={{ padding: '8px 15px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                        Logout
                    </button>
                </div>
            </div>

            <div style={{display: 'grid', gap: '20px', marginTop: '20px'}}>
                {venues.map((venue) => (
                    <div key={venue.id} style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '6px'}}>
                        <h3>{venue.name}</h3>
                        <p>Location : {venue.city}</p>
                        <p>Location : {venue.address}</p>
                        <p>Capacity: {venue.capacity}</p>
                        <div style={{display: 'flex', justifyContent: 'space-between', gap: '20px'}}>
                            <button 
                                onClick={() => handleBooking(venue)}
                                style={{
                                    marginTop: '10px', padding: '8px 12px', backgroundColor: '#007bff',
                                    color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', width: '100%',
                                    fontWeight: '700'
                                }}
                            >
                                Book Venue
                            </button>

                            <button 
                            onClick={() => handleExploreButton(venue.id)}
                                style={{
                                    marginTop: '10px', padding: '8px 12px', backgroundColor: '#082748',
                                    color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', width: '100%'
                                }}
                            >
                                Explore More
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserDashboard;
