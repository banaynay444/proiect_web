import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function ProfesorDashboard() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [cursuri, setCursuri] = useState([]);
    const [profesor, setProfesor] = useState({ nume: '', prenume: '' });

    useEffect(() => {
        // 1. Luăm lista de cursuri
        axios.get(`http://localhost:3001/api/profesor/cursuri/${id}`)
            .then(res => setCursuri(res.data))
            .catch(err => console.error(err));

        // 2. Luăm numele profesorului
        axios.get(`http://localhost:3001/api/utilizator/${id}`)
            .then(res => {
                if(res.data) setProfesor(res.data);
            })
            .catch(err => console.error(err));
    }, [id]);

    return (
        <div className="dashboard-container">
            <div className="header">
                <div>
                    <h1 style={{margin: 0, fontSize: '1.8rem'}}>
                        Salut, {profesor.nume ? `${profesor.nume} ${profesor.prenume}` : 'Profesor'}! 👋
                    </h1>
                    <p style={{color: '#6b7280', margin: '5px 0 0 0'}}>Gestionează cursurile tale</p>
                </div>
                <button className="logout-btn" onClick={() => navigate('/')}>Deconectare</button>
            </div>

            {cursuri.length === 0 ? (
                <div className="auth-card" style={{textAlign: 'center', padding: '3rem'}}>
                    <p>Nu aveți cursuri alocate momentan.</p>
                </div>
            ) : (
                <div style={{
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
                    gap: '20px',
                    marginTop: '2rem'
                }}>
                    {cursuri.map(curs => (
                        <div 
                            key={curs.id} 
                            className="auth-card" 
                            style={{
                                margin: 0, 
                                display: 'flex', 
                                flexDirection: 'column', 
                                justifyContent: 'space-between',
                                height: '100%',
                                transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-5px)';
                                e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                            }}
                        >
                            <div style={{marginBottom: '20px', textAlign: 'center'}}>
                                <div style={{
                                    width: '60px', height: '60px', 
                                    background: '#e0e7ff', color: '#4f46e5', 
                                    borderRadius: '15px', display: 'flex', 
                                    alignItems: 'center', justifyContent: 'center',
                                    fontSize: '1.8rem', margin: '0 auto 15px auto'
                                }}>
                                    📚
                                </div>
                                <h3 style={{margin: 0, fontSize: '1.25rem', color: '#1f2937'}}>
                                    {curs.nume_curs}
                                </h3>
                            </div>

                            <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                                <Link to={`/prezenta/${curs.id}`} style={{textDecoration: 'none'}}>
                                    <button style={{
                                        display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px'
                                    }}>
                                        📝 Fă Prezența
                                    </button>
                                </Link>
                                
                                <Link to={`/raport/${curs.id}`} style={{textDecoration: 'none'}}>
                                    <button className="secondary" style={{
                                        margin: 0,
                                        display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px'
                                    }}>
                                        📊 Vezi Raport
                                    </button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ProfesorDashboard;