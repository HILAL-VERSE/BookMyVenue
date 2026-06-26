import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


const Login = () => {
    const navigate = useNavigate();
    const [ formData, setFormData ]  = useState({
        email: '',
        password: ''
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        if (savedToken) {
            alert("Logged In");
        }
    }, []);
    

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

        try {
            const response = await fetch('http://localhost:5000/login',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password
                })
            });

            const data = await response.json();

             if(!response.ok){
                throw new Error(data.message || "Login failed");
            }

            if (data.token) {
                localStorage.setItem('token', data.token);

                const payload = JSON.parse(atob(data.token.split('.')[1]));
                const userRole = payload.role;

                alert("login successful!");

                if (userRole === 'admin') {
                    navigate('/admin-dashboard');
                } else if(userRole === 'user'){
                    navigate('/user-dashboard'); 
                } else if (userRole == 'owner'){
                    navigate('/owner-dashboard');
                }
            }


            setIsLoggedIn(true);
            setFormData({email: '', password: ''});

        }catch (error) {
            setError(error.message || "Something went wrong. Please try again");
        }finally{
            setLoading(false);
        }
};
    return (
        <div style={{maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px'}}>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>

            {error && <p style={{ color: 'red', marginBottom: '15px' }}>{error}</p>}

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

            <button 
                    type="submit"
                    disabled={loading}
                    style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                    {loading ? 'Logining...' : 'Login'}
                </button>
        </form>

        </div>
    )
};

export default Login;