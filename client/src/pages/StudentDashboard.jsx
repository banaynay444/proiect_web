import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function StudentDashboard() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [situatie, setSituatie] = useState([]);
    const [student, setStudent] = useState({ nume: '', prenume: '' });
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        // 1. Luăm situația
        axios.get(`http://localhost:3001/api/student/situatie/${id}`)
            .then(res => setSituatie(res.data))
            .catch(err => console.error(err));
            
        // 2. Luăm numele studentului
        axios.get(`http://localhost:3001/api/utilizator/${id}`)
            .then(res => {
                if(res.data) setStudent(res.data);
            })
            .catch(err => console.error(err));
    }, [id]);

    const filteredSituatie = situatie.filter(s => 
        s.nume_curs.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    // CALCUL PROCENTAJ CORECTAT
    const getPercentage = (prezente, motivate, total) => {
        if (!total || total === 0) return 0; // Dacă nu sunt sesiuni, e 0% prezență
        const punctePozitive = parseInt(prezente) + parseInt(motivate);
        return Math.round((punctePozitive / total) * 100);
    };

    const getStatusColor = (procent) => {
        if (procent >= 75) return '#10b981'; // Verde
        if (procent >= 50) return '#f59e0b'; // Portocaliu
        return '#ef4444'; // Roșu (Sub 50%)
    };

    const getStatusMessage = (procent) => {
        if (procent >= 75) return 'Excelent 🌟';
        if (procent >= 50) return 'Bine 👍';
        return 'Critic ⚠️';
    };

    return (
        <div className="dashboard-container">
            <div className="header">
                <div>
                    <h1 style={{margin: 0, fontSize: '1.8rem'}}>
                        Salut, {student.nume ? `${student.nume} ${student.prenume}` : 'Student'}! 🎓
                    </h1>
                    <p style={{color: '#6b7280', margin: '5px 0 0 0'}}>Vezi situația prezențelor tale</p>
                </div>
                <button className="logout-btn" onClick={() => navigate('/')}>Deconectare</button>
            </div>

            <div style={{marginBottom: '2rem'}}>
                <input 
                    type="text" 
                    placeholder="🔍 Caută o materie..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    style={{
                        padding: '12px', width: '100%', fontSize: '1rem',
                        border: '2px solid #e5e7eb', borderRadius: '10px',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                    }}
                />
            </div>

            {filteredSituatie.length === 0 ? (
                <div className="auth-card" style={{textAlign: 'center', padding: '3rem'}}>
                    <p style={{color: '#666'}}>Nu ai prezențe înregistrate la nicio materie.</p>
                </div>
            ) : (
                <div style={{
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
                    gap: '20px'
                }}>
                    {filteredSituatie.map((curs, index) => {
                        const prezente = parseInt(curs.prezente) || 0;
                        const motivate = parseInt(curs.motivate) || 0;
                        const absente = parseInt(curs.absente) || 0;
                        const total = parseInt(curs.total_sesiuni) || 0;

                        const procent = getPercentage(prezente, motivate, total);
                        const color = getStatusColor(procent);

                        return (
                            <div 
                                key={index} 
                                className="auth-card" 
                                style={{
                                    margin: 0, padding: '1.5rem',
                                    display: 'flex', flexDirection: 'column', 
                                    justifyContent: 'space-between',
                                    borderTop: `5px solid ${color}`,
                                    transition: 'transform 0.2s ease'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                            >
                                <div>
                                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '15px'}}>
                                        <h3 style={{margin: 0, fontSize: '1.2rem', color: '#1f2937'}}>{curs.nume_curs}</h3>
                                        <span style={{
                                            backgroundColor: `${color}20`, color: color,
                                            padding: '4px 10px', borderRadius: '20px',
                                            fontSize: '0.8rem', fontWeight: 'bold'
                                        }}>
                                            {getStatusMessage(procent)}
                                        </span>
                                    </div>

                                    <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '15px', color: '#4b5563'}}>
                                        <div style={{textAlign: 'center'}}>
                                            <span style={{display: 'block', fontWeight: 'bold', fontSize: '1.1rem', color: '#10b981'}}>{prezente}</span>
                                            <span style={{fontSize: '0.8rem'}}>Prezențe</span>
                                        </div>
                                        <div style={{textAlign: 'center'}}>
                                            <span style={{display: 'block', fontWeight: 'bold', fontSize: '1.1rem', color: '#ef4444'}}>{absente}</span>
                                            <span style={{fontSize: '0.8rem'}}>Absențe</span>
                                        </div>
                                        <div style={{textAlign: 'center'}}>
                                            <span style={{display: 'block', fontWeight: 'bold', fontSize: '1.1rem', color: '#f59e0b'}}>{motivate}</span>
                                            <span style={{fontSize: '0.8rem'}}>Motivate</span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '5px', color: '#6b7280'}}>
                                        <span>Rata de participare</span>
                                        <span style={{fontWeight: 'bold', color: color}}>{procent}%</span>
                                    </div>
                                    <div style={{width: '100%', height: '8px', background: '#e5e7eb', borderRadius: '4px', overflow: 'hidden'}}>
                                        <div style={{
                                            width: `${procent}%`, 
                                            height: '100%', 
                                            background: color,
                                            transition: 'width 0.5s ease'
                                        }}></div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default StudentDashboard;