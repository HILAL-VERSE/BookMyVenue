import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    const handleLogout = () => {
        localStorage.removeItem('token'); // Clear token
        navigate('/'); // Redirect to home
    };

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const token = localStorage.getItem('token');
                
                
                const response = await fetch('http://localhost:5000/api/all-bookings', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || "Failed to fetch bookings");
                }

                setBookings(data.bookings); 
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    if (loading) return <p style={{ padding: '20px' }}>Loading total bookings...</p>;
    if (error) return <p style={{ padding: '20px', color: 'red' }}>Error: {error}</p>;

    return (
        <div style={{ padding: '30px', maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ color: '#dc3545' }}>Admin Control Center</h2>
            <h3>All Booking Details</h3>
            <div style={{ display: 'grid', gap: '15px', marginTop: '20px' }}>
                {bookings.map((booking) => (
                <div key={booking.id} style={{ border: '1px solid #dc3545', padding: '15px', borderRadius: '6px', backgroundColor: '#fff5f5' }}>
                    <p><strong>Booking ID:</strong> {booking.id}</p>
                    <p><strong>User ID Connected:</strong> {booking.user_id}</p>
                    <p><strong>Venue ID Connected:</strong> {booking.venue_id}</p>
                    <p><strong>Start Time:</strong> {new Date(booking.start_datetime).toLocaleString()}</p>
                    <p><strong>End Time:</strong> {new Date(booking.end_datetime).toLocaleString()}</p>
                    <p><strong>Status:</strong> {booking.status}</p>
                    <p><strong>Price Paid:</strong> ${booking.total_price}</p>
                </div>
            ))}

            </div>
             <button onClick={handleLogout} style={{ float: 'right', padding: '8px 15px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Logout</button>
        </div>
    );
};

export default AdminDashboard;