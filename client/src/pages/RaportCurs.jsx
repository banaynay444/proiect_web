import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function RaportCurs() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [raport, setRaport] = useState([]);
    const [searchTerm, setSearchTerm] = useState(""); // <-- State pentru căutare

    useEffect(() => {
        axios.get(`http://localhost:3001/api/profesor/raport/${id}`)
            .then(res => setRaport(res.data))
            .catch(err => console.error(err));
    }, [id]);

    // --- LOGICA DE FILTRARE ---
    const filteredRaport = raport.filter(r => 
        (r.nume + ' ' + r.prenume).toLowerCase().includes(searchTerm.toLowerCase()) ||
        (r.grupa && r.grupa.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const getPercentage = (prezente, total) => {
        if (total === 0) return 0;
        return Math.round((prezente / total) * 100);
    };

    const getProgressColor = (procent) => {
        if (procent >= 75) return '#10b981'; 
        if (procent >= 50) return '#f59e0b'; 
        return '#ef4444'; 
    };

    return (
        <div className="dashboard-container" style={{maxWidth: '900px'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
                <button className="secondary" onClick={() => navigate(-1)} style={{width: 'auto'}}>
                    ⬅️ Înapoi
                </button>
                <div style={{textAlign: 'right'}}>
                    <h2 style={{margin: 0}}>📊 Raport Detaliat</h2>
                    <span style={{color: '#6b7280', fontSize: '0.9rem'}}>Statistici per student</span>
                </div>
            </div>

            {/* Câmp Căutare */}
            <div style={{marginBottom: '20px'}}>
                <input 
                    type="text" 
                    placeholder="🔍 Caută după nume sau grupă..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    style={{
                        padding: '12px', 
                        width: '100%', 
                        fontSize: '1rem',
                        border: '2px solid #e5e7eb',
                        borderRadius: '10px',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                    }}
                />
            </div>

            <div style={{display: 'grid', gap: '15px'}}>
                {filteredRaport.length === 0 ? (
                    <p style={{textAlign: 'center', color: '#666'}}>Nu s-au găsit rezultate.</p>
                ) : (
                    filteredRaport.map((r) => {
                        const procent = getPercentage(r.prezente, r.total_sesiuni);
                        
                        return (
                            <div 
                                key={r.id} 
                                className="auth-card"
                                style={{
                                    margin: 0, padding: '1.5rem',
                                    display: 'flex', flexWrap: 'wrap', 
                                    alignItems: 'center', justifyContent: 'space-between',
                                    borderLeft: `6px solid ${getProgressColor(procent)}`
                                }}
                            >
                                <div style={{display: 'flex', alignItems: 'center', gap: '15px', minWidth: '250px'}}>
                                    <div style={{
                                        width: '45px', height: '45px', 
                                        background: '#e0e7ff', color: '#4f46e5', 
                                        borderRadius: '50%', display: 'flex', 
                                        alignItems: 'center', justifyContent: 'center',
                                        fontSize: '1.4rem', fontWeight: 'bold'
                                    }}>
                                        {r.nume.charAt(0)}{r.prenume.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 style={{margin: 0, fontSize: '1.1rem'}}>{r.nume} {r.prenume}</h3>
                                        <span style={{color: '#6b7280', fontSize: '0.85rem'}}>
                                            {r.serie ? `Seria ${r.serie}` : ''} • Grupa {r.grupa}
                                        </span>
                                    </div>
                                </div>

                                <div style={{display: 'flex', gap: '20px', margin: '10px 0'}}>
                                    <div style={{textAlign: 'center'}}>
                                        <span style={{display: 'block', fontSize: '1.2rem', fontWeight: 'bold', color: '#10b981'}}>{r.prezente}</span>
                                        <span style={{fontSize: '0.75rem', color: '#6b7280'}}>PREZ</span>
                                    </div>
                                    <div style={{textAlign: 'center'}}>
                                        <span style={{display: 'block', fontSize: '1.2rem', fontWeight: 'bold', color: '#ef4444'}}>{r.absente}</span>
                                        <span style={{fontSize: '0.75rem', color: '#6b7280'}}>ABS</span>
                                    </div>
                                    <div style={{textAlign: 'center'}}>
                                        <span style={{display: 'block', fontSize: '1.2rem', fontWeight: 'bold', color: '#f59e0b'}}>{r.motivate}</span>
                                        <span style={{fontSize: '0.75rem', color: '#6b7280'}}>MOTIV</span>
                                    </div>
                                </div>

                                <div style={{minWidth: '150px', textAlign: 'right'}}>
                                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px', marginBottom: '5px'}}>
                                        <span style={{fontSize: '0.9rem', color: '#6b7280'}}>Prezență:</span>
                                        <span style={{fontSize: '1.2rem', fontWeight: 'bold', color: getProgressColor(procent)}}>
                                            {procent}%
                                        </span>
                                    </div>
                                    <div style={{width: '100%', height: '8px', background: '#e5e7eb', borderRadius: '4px', overflow: 'hidden'}}>
                                        <div style={{
                                            width: `${procent}%`, 
                                            height: '100%', 
                                            background: getProgressColor(procent),
                                            transition: 'width 0.5s ease'
                                        }}></div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}

export default RaportCurs;