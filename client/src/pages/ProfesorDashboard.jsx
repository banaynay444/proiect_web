import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

function ProfesorDashboard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cursuri, setCursuri] = useState([]);
  const user = JSON.parse(localStorage.getItem('user')) || {};

  useEffect(() => {
    axios.get(`http://localhost:3001/api/profesor/cursuri/${id}`)
      .then((response) => setCursuri(response.data))
      .catch((error) => console.error(error));
  }, [id]);

  const handleLogout = () => {
      localStorage.removeItem('user');
      navigate('/');
  }

  return (
    <div className="page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
            <h1>Salut, Prof. {user.nume}! 👋</h1>
            <p className="text-light">Selectează un curs pentru a face prezența.</p>
        </div>
        <button onClick={handleLogout} className="btn" style={{background: '#ef4444'}}>Logout</button>
      </div>
      
      <div className="dashboard-grid">
        {cursuri.length === 0 ? (
          <p>Nu există cursuri asignate.</p>
        ) : (
          cursuri.map((curs) => (
            <div key={curs.id} className="card">
              <h3 style={{marginTop: 0}}>{curs.nume_curs}</h3>
              <p style={{ color: '#6b7280', fontSize: '14px' }}>ID Curs: #{curs.id}</p>
              <div style={{ marginTop: '20px' }}>
                  <button 
                    className="btn btn-primary btn-block"
                    onClick={() => navigate(`/prezenta/${curs.id}`)}
                  >
                    📝 Fă Prezența
                  </button>
                  {/* Buton Nou */}
    <button 
      className="btn btn-block"
      style={{ background: '#6366f1', color: 'white' }}
      onClick={() => navigate(`/raport/${curs.id}`)}
    >
      📊 Vezi Raport
    </button>
    <div style={{display: 'flex', gap: '10px', marginTop: '15px'}}>
    <button className="btn btn-primary" onClick={() => navigate(`/prezenta/${curs.id}`)}>Prezență</button>
    <button className="btn" style={{background: '#6366f1'}} onClick={() => navigate(`/raport/${curs.id}`)}>Raport</button>
</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ProfesorDashboard;