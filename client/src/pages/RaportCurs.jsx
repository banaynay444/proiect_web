import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

function RaportCurs() {
  const { cursId } = useParams();
  const navigate = useNavigate();
  const [raport, setRaport] = useState([]);

  useEffect(() => {
    // Folosim ruta nouă creată la pasul 1
    axios.get(`http://localhost:3001/api/profesor/raport/${cursId}`)
      .then(res => setRaport(res.data))
      .catch(err => console.error(err));
  }, [cursId]);

  return (
    <div className="page-container">
      <button className="btn" onClick={() => navigate(-1)} style={{background: '#9ca3af', marginBottom:'20px'}}>Inapoi</button>
      
      <div className="card">
        <h2>Raport Situație Studenți</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Nume</th>
                <th>Grupa</th>
                <th>Prezențe</th>
                <th>Absențe</th>
                <th>Procentaj</th>
              </tr>
            </thead>
            <tbody>
              {raport.map((r, i) => {
                const total = r.total_sesiuni || 1; 
                // Evitam impartirea la 0. Daca total e 0, procentul e 0.
                const procent = r.total_sesiuni > 0 ? Math.round((r.prezente / r.total_sesiuni) * 100) : 0;
                
                return (
                  <tr key={i}>
                    <td>{r.nume} {r.prenume}</td>
                    <td>{r.grupa || '-'}</td>
                    <td style={{color: 'green', fontWeight:'bold'}}>{r.prezente}</td>
                    <td style={{color: 'red'}}>{r.absente}</td>
                    <td>
                        <div style={{background: '#e5e7eb', borderRadius: '4px', width: '100%', height: '10px'}}>
                             <div style={{background: procent < 50 ? 'red' : 'green', width: `${procent}%`, height: '100%', borderRadius: '4px'}}></div>
                        </div>
                        <small>{procent}%</small>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {raport.length === 0 && <p style={{padding:'20px'}}>Nu există date de prezență înregistrate.</p>}
        </div>
      </div>
    </div>
  );
}

export default RaportCurs;