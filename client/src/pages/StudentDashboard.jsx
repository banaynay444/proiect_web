import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

function StudentDashboard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [situatie, setSituatie] = useState([]);
  const user = JSON.parse(localStorage.getItem('user')) || {};

  useEffect(() => {
    axios.get(`http://localhost:3001/api/student/situatie/${id}`)
      .then(res => setSituatie(res.data))
      .catch(err => console.error(err));
  }, [id]);

  return (
    <div className="page-container">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <h1>Bună, {user.prenume}!</h1>
        <button className="btn" style={{background:'red'}} onClick={()=>{localStorage.clear(); navigate('/')}}>Logout</button>
      </div>

      <div className="dashboard-grid">
        {situatie.length === 0 ? <p>Nu ai prezențe notate momentan.</p> : situatie.map((mat, i) => {
            const total = mat.prezente + mat.absente;
            const procent = total > 0 ? Math.round((mat.prezente / total) * 100) : 0;
            return (
                <div key={i} className="card">
                    <h3>{mat.nume_curs}</h3>
                    <p>Prezențe: <b style={{color:'green'}}>{mat.prezente}</b></p>
                    <p>Absențe: <b style={{color:'red'}}>{mat.absente}</b></p>
                    <div style={{marginTop: '10px'}}>
                        Rate de prezență: {procent}%
                        <div style={{height:'8px', background:'#eee', width:'100%', borderRadius:'4px', marginTop:'5px'}}>
                            <div style={{height:'100%', background: 'blue', width: `${procent}%`, borderRadius:'4px'}}></div>
                        </div>
                    </div>
                </div>
            )
        })}
      </div>
    </div>
  );
}
export default StudentDashboard;