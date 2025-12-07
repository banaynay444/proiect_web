import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function ProfesorDashboard() {
  const { id } = useParams(); // Luăm ID-ul profesorului din URL
  const [cursuri, setCursuri] = useState([]);

  useEffect(() => {
    // Când se încarcă pagina, cerem cursurile de la server
    axios.get(`http://localhost:3001/api/profesor/cursuri/${id}`)
      .then((response) => {
        setCursuri(response.data);
      })
      .catch((error) => {
        console.error("Eroare la preluarea cursurilor:", error);
      });
  }, [id]);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Panou Profesor</h1>
      <h3>Cursurile mele:</h3>
      
      {cursuri.length === 0 ? (
        <p>Nu aveți cursuri asignate.</p>
      ) : (
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          {cursuri.map((curs) => (
            <div key={curs.id} style={cardStyle}>
              <h4>{curs.nume_curs}</h4>
              <p>ID Curs: {curs.id}</p>
              {/* Aici vom adăuga butonul de prezență mai târziu */}
              <button onClick={() => alert(`Deschide prezența pentru ${curs.nume_curs}`)}>
                Fă Prezența
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const cardStyle = {
  border: '1px solid #ddd',
  borderRadius: '8px',
  padding: '15px',
  width: '200px',
  boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
};

export default ProfesorDashboard;