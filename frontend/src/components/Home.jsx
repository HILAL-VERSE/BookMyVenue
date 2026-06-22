import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate(); // Hook to change pages programmatically

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div style={{ border: '1px solid #ccc', padding: '40px', borderRadius: '8px', textAlign: 'center' }}>
        <h1>Welcome to the Platform</h1>
        <p>Please log in or create an account to continue.</p>
        <div style={{ marginTop: '20px' }}>
          <button onClick={() => navigate('/login')} style={{ marginRight: '10px', padding: '10px 20px' }}>
            Login
          </button>
          <button onClick={() => navigate('/signup')} style={{ padding: '10px 20px' }}>
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
