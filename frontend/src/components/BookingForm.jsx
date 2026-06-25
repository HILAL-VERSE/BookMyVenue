import React, { useState, useEffect } from "react";

const BookingForm = ({venueId, venueName, onClose }) => {
    const [formData, setFormData ] = useState({
        venue_id: '',
        start_datetime: '',
        end_datetime: ''
    });

    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if(venueId){
            setFormData((prev) => ({ ...prev, venue_id: venueId}));
        }
    }, [venueId]);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setIsError(false);

        try {
            const token = localStorage.getItem('token');

            const response =await fetch('http://localhost:5000/booking', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if(!response.ok){
                throw new Error(data.error || 'Failed to create booking');
            }

            setIsError(false);
            setMessage(data.message || 'Booking created succesfully');

            setFormData((prev) => ({ ...prev, start_datetime: '', end_datetime: ''}));
        }catch(err){
            setIsError(true);
            setMessage(err.message);
        }finally{
            setLoading(false);
        }
    };

    return (
        <div style={{
            width: '400px',
            padding: '25px',
            border: '1px solid #ccc',
            borderRadius: '8px',
            backgroundColor: '#fff',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
            <div style={{display: 'flex', justifyContent: 'between', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px'}}>
                <h3 style={{margin: '0'}}>Book {venueName || 'venue' }</h3>
                {onClose && (
                    <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer' }}>✕</button>
                )}
            </div>

            {message && (
                <p style={{ 
                    padding: '10px', 
                    borderRadius: '4px', 
                    backgroundColor: isError ? '#f8d7da' : '#d1e7dd', 
                    color: isError ? '#842029' : '#0f5132',
                    fontSize: '14px'
                    }}>
                        {message}
                </p>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <input type="hidden" name="venue_id" value={formData.venue_id} />

                <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Start Date & Time</label>
                    <input 
                        type="datetime-local" 
                        name="start_datetime"
                        value={formData.start_datetime}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                    </div>

                    <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>End Date & Time</label>
                    <input 
                        type="datetime-local" 
                        name="end_datetime"
                        value={formData.end_datetime}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    style={{ 
                        marginTop: '10px',
                        padding: '10px', 
                        backgroundColor: loading ? '#ccc' : '#007bff', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '4px', 
                        cursor: loading ? 'not-allowed' : 'pointer',
                        fontWeight: 'bold'
                    }}
                    >
                    {loading ? 'Processing...' : 'Confirm Booking'}
                </button>
            </form>
        </div>
    );
};

export default BookingForm;