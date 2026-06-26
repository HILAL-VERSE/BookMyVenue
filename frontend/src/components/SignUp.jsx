import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';



const SignUp = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: ''
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);


    //useEffect(() => {
    
   // const savedToken = localStorage.getItem('token');
    
    //if (savedToken) {
        
      //  setIsLoggedIn(true);
    //}
//}, []); 


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError('');
        setLoading(true);

        if(formData.password !== formData.confirmPassword){
            setError("Password do not match");
            setLoading(false);
            return;
        }
        
        try{
            const response = await fetch('http://localhost:5000/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    role: formData.role
                })
            });

            const data = await response.json();
            if(!response.ok){
                throw new Error(data.message || "Registration failed");
            }

            if (data.token) {
                localStorage.setItem('token', data.token);
                const payload = JSON.parse(atob(data.token.split('.')[1]));
                const userRole = payload.role;

                if(userRole === 'admin' ){
                    navigate('/admin-dashboard');
                }else if(userRole === 'user' ){
                    navigate('/user-dashboard');
                } else if (userRole == 'owner'){
                    navigate('/owner-dashboard');
                }
            }

            alert("Registration successful!");
            setIsLoggedIn(true);
            setFormData({name: '', email: '', password: '',confirmPassword: '',role: ''});
            
        }catch(err){
            setError("Something went wrong. Please try again");
        }finally{
            setLoading(false);
        }
    }

    return(
        <div style={{maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px'}}>
                    
            <h2>Create Account</h2>

            {error && <p style={{ color: 'red', marginBottom: '15px' }}>{error}</p>}

            <form onSubmit={handleSubmit}>

                <div style={{marginBottom: '15px'}}>
                    <label htmlFor="" style={{ display: 'block', marginBottom: '5px' }}>Full Name</label>
                    <input 
                        type="text" 
                        name="name"            
                        value={formData.name}   
                        onChange={handleChange} 
                        required 
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Email Address</label>
                    <input 
                        type="email"      
                        name="email"            
                        value={formData.email}  
                        onChange={handleChange} 
                        required 
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Password</label>
                    <input 
                        type="password"        
                        name="password"         
                        value={formData.password} 
                        onChange={handleChange} 
                        required 
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Confirm Password</label>
                    <input 
                        type="password"         // Masks text for security
                        name="confirmPassword"  // Matches state key 'confirmPassword' exactly
                        value={formData.confirmPassword} 
                        onChange={handleChange} 
                        required 
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                    />
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Account Type</label>
                    <select 
                        name="role"             // Matches state key 'role' exactly
                        value={formData.role}   
                        onChange={handleChange} 
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                    >
                        <option value="">Select a role...</option>
                        <option value="user">User</option>
                        <option value="owner">Owner</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>

                <button 
                    type="submit"
                    disabled={loading}
                    style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                    {loading ? 'Registering...' : 'Sign Up'}
                </button>
            </form>
        </div>
    );
};

export default SignUp;