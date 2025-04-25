import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import './App.css';

function SimpleApp() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Simple fetch to test API access
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://srijandubey.github.io/campus-api-mock/SRM-C1-25.json');
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        const data = await response.json();
        setDoctors(data || []);
        setLoading(false);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="app">
      <div style={{
        background: '#e0ffe0', 
        padding: '10px', 
        textAlign: 'center',
        margin: '20px',
        border: '2px solid green'
      }}>
        <h2>Doctor Listing App</h2>
        
        {loading && <p>Loading doctors data...</p>}
        {error && <p style={{color: 'red'}}>Error: {error}</p>}
        
        {!loading && !error && (
          <div>
            <p>Successfully loaded {doctors.length} doctors</p>
            <p>First doctor: {doctors.length > 0 ? doctors[0].name : 'None'}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SimpleApp;