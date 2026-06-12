// src/App.js
import React, { useState, useEffect } from 'react';

function App() {
  const [dbMeta, setDbMeta] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/db/meta') 
      .then((res) => {
        if (!res.ok) throw new Error('Backend server returned an error status');
        return res.json();
      })
      .then((data) => {
        setDbMeta(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Integration handshake failed:', error);
        setDbMeta({ success: false, error: error.message });
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={{ padding: '20px' }}>Loading system metadata...</div>;

 
  const systemInfo = dbMeta.success && dbMeta.systemDetails ? dbMeta.systemDetails[0] : null;

  return (
    <div style={{ padding: '30px', fontFamily: 'sans-serif' }}>
      <h1>Full Stack Handshake Test</h1>
      
      <div style={{
        padding: '20px',
        borderRadius: '6px',
        backgroundColor: dbMeta.success ? '#e6f4ea' : '#fce8e6',
        color: dbMeta.success ? '#137333' : '#c5221f',
        border: `1px solid ${dbMeta.success ? '#a3cfbb' : '#f5c2c7'}`
      }}>
        <h2>Integration Status: {dbMeta.success ? 'SUCCESS' : 'FAILED'}</h2>
        
        {dbMeta.success && systemInfo ? (
          <ul style={{ fontSize: '16px', lineHeight: '1.8' }}>
            {/* These keys align perfectly with your PostgreSQL current_database() and current_user query outputs */}
            <li><strong>Active Database:</strong> {systemInfo.current_database}</li>
            <li><strong>Database User:</strong> {systemInfo.current_user}</li>
            <li><strong>PostgreSQL Version:</strong> {systemInfo.version}</li>
          </ul>
        ) : (
          <p><strong>Connection Error:</strong> {dbMeta.error || dbMeta.message}</p>
        )}
      </div>
    </div>
  );
}

export default App;
