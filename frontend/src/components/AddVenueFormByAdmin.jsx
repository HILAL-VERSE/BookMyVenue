import React, { useState } from "react";

const AddVenueFormByAdmin = ({ onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        city: '',
        address: '',
        capacity: '',
        price_per_hour: '',
        owner_email: ''
    });

    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setIsError(false);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/add-venue', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            // Fallback for HTML error pages to avoid JSON parser crashes
            if (!response.ok) {
                const textError = await response.text();
                try {
                    const data = JSON.parse(textError);
                    throw new Error(data.error || 'Failed to add venue');
                } catch {
                    throw new Error(`Server Error: Status ${response.status}`);
                }
            }

            const data = await response.json();
            setIsError(false);
            setMessage(data.message || 'Venue added successfully!');
            
            // Clear form
            setFormData({ name: '', description: '', city: '', address: '', capacity: '', price_per_hour: '', owner_email: '' });
            
            // Optional: Close modal after a short delay so the user sees the success message
            setTimeout(() => { if (onClose) onClose(); }, 1500);

        } catch (err) {
            setIsError(true);
            setMessage(err.message);
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = { width: '100%', padding: '8px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' };
    const labelStyle = { display: 'block', marginBottom: '5px', fontWeight: '500' };

    return (
        <div style={{ width: '400px', padding: '25px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#fff', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ margin: '0' }}>Add New Venue</h3>
                {onClose && (
                    <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer' }}>✕</button>
                )}
            </div>

            {message && (
                <p style={{ padding: '10px', borderRadius: '4px', backgroundColor: isError ? '#f8d7da' : '#d1e7dd', color: isError ? '#842029' : '#0f5132', fontSize: '14px' }}>
                    {message}
                </p>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                    <label style={labelStyle}>Venue Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required style={inputStyle} />
                </div>
                <div>
                    <label style={labelStyle}>Description</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} required style={{ ...inputStyle, height: '60px', resize: 'vertical' }} />
                </div>
                <div>
                    <label style={labelStyle}>City</label>
                    <input type="text" name="city" value={formData.city} onChange={handleChange} required style={inputStyle} />
                </div>
                <div>
                    <label style={labelStyle}>Address</label>
                    <input type="text" name="address" value={formData.address} onChange={handleChange} required style={inputStyle} />
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <div style={{ flex: 1 }}>
                        <label style={labelStyle}>Capacity</label>
                        <input type="number" name="capacity" value={formData.capacity} onChange={handleChange} required min="1" style={inputStyle} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label style={labelStyle}>Price/Hour ($)</label>
                        <input type="number" name="price_per_hour" value={formData.price_per_hour} onChange={handleChange} required min="0" step="0.01" style={inputStyle} />
                    </div>
                </div>
                <div>
                    <label style={labelStyle}>Owner Email</label>
                    <input type="email" name="owner_email" value={formData.owner_email} onChange={handleChange} required style={inputStyle} />
                </div>
                <button type="submit" disabled={loading} style={{ marginTop: '10px', padding: '10px', backgroundColor: loading ? '#ccc' : '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}>
                    {loading ? 'Processing...' : 'Add Venue'}
                </button>
            </form>
        </div>
    );
};

export default AddVenueFormByAdmin;
