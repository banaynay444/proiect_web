import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Prezenta() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [studenti, setStudenti] = useState([]);
    const [dataCurenta, setDataCurenta] = useState(new Date().toISOString().split('T')[0]);
    const [searchTerm, setSearchTerm] = useState(""); // <-- State pentru căutare
    
    const [prezente, setPrezente] = useState({}); 
    const [selected, setSelected] = useState({});

    // Luăm lista de studenți
    useEffect(() => {
        axios.get(`http://localhost:3001/api/curs/studenti/${id}`)
            .then(res => {
                setStudenti(res.data);
                
                const statusInitial = {};
                const selectedInitial = {};
                
                res.data.forEach(s => {
                    statusInitial[s.id] = 'prezent';
                    selectedInitial[s.id] = false;
                });
                
                setPrezente(statusInitial);
                setSelected(selectedInitial);
            })
            .catch(err => console.error(err));
    }, [id]);

    // --- LOGICA DE FILTRARE ---
    const filteredStudenti = studenti.filter(s => 
        (s.nume + ' ' + s.prenume).toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.grupa && s.grupa.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Verificăm dacă toți studenții FILTRAȚI sunt selectați
    const areToateSelectate = filteredStudenti.length > 0 && filteredStudenti.every(s => selected[s.id]);

    // Selectează / Deselectează doar studenții vizibili (filtrați)
    const toggleSelectAll = () => {
        const newState = { ...selected };
        filteredStudenti.forEach(s => {
            newState[s.id] = !areToateSelectate;
        });
        setSelected(newState);
    };

    const toggleSelect = (studentId) => {
        setSelected(prev => ({ ...prev, [studentId]: !prev[studentId] }));
    };

    const handleStatusChange = (studentId, status) => {
        setPrezente(prev => ({ ...prev, [studentId]: status }));
    };

    const salveaza = () => {
        const listaFinala = studenti // Aici trimitem din toți studenții, nu doar cei filtrați
            .filter(s => selected[s.id]) 
            .map(s => ({
                student_id: s.id,
                status: prezente[s.id]
            }));

        if (listaFinala.length === 0) {
            alert("⚠️ Nu ai selectat niciun student!");
            return;
        }

        axios.post('http://localhost:3001/api/prezenta', {
            curs_id: id,
            data: dataCurenta,
            prezente: listaFinala
        })
        .then(() => {
            alert(`✅ Prezența salvată pentru ${listaFinala.length} studenți!`);
            navigate(-1);
        })
        .catch(err => {
            console.error(err);
            if (err.response && err.response.status === 409) {
                alert("⚠️ Există deja o prezență salvată pentru această dată!");
            } else {
                alert("❌ Eroare la salvare.");
            }
        });
    };

    const getStatusColor = (status, isSelected) => {
        if (!isSelected) return '#f9fafb'; 
        switch(status) {
            case 'prezent': return 'rgba(16, 185, 129, 0.1)';
            case 'absent': return 'rgba(239, 68, 68, 0.1)';
            case 'motivat': return 'rgba(245, 158, 11, 0.1)';
            default: return 'white';
        }
    };

    return (
        <div className="dashboard-container" style={{maxWidth: '800px'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
                <button className="secondary" onClick={() => navigate(-1)} style={{width: 'auto'}}>
                    ⬅️ Înapoi
                </button>
                <h2 style={{margin: 0}}>📝 Fă Prezența</h2>
            </div>

            {/* ZONA DE CONTROALE (Data + Căutare) */}
            <div className="auth-card" style={{margin: '0 auto 1.5rem auto', padding: '1.5rem'}}>
                <div style={{display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px', alignItems: 'end'}}>
                    
                    {/* Selector Data */}
                    <div>
                        <label style={{fontSize: '0.9rem', display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>📅 Data:</label>
                        <input 
                            type="date" 
                            value={dataCurenta} 
                            onChange={e => setDataCurenta(e.target.value)} 
                            style={{padding: '10px'}}
                        />
                    </div>

                    {/* Căutare Student */}
                    <div>
                        <label style={{fontSize: '0.9rem', display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>🔍 Caută student:</label>
                        <input 
                            type="text" 
                            placeholder="Nume sau Grupă..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            style={{padding: '10px', width: '100%'}}
                        />
                    </div>
                </div>
            </div>

            {/* Buton Select All */}
            <div style={{marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <span style={{fontSize: '0.9rem', color: '#666'}}>
                    Se afișează {filteredStudenti.length} din {studenti.length} studenți
                </span>
                <button 
                    onClick={toggleSelectAll} 
                    className="secondary" 
                    style={{width: 'auto', fontSize: '0.9rem', padding: '8px 15px'}}
                >
                    {areToateSelectate ? "❌ Deselectează Lista" : "✅ Selectează Lista"}
                </button>
            </div>
            
            {/* Lista Studenți */}
            <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                {filteredStudenti.length === 0 ? (
                    <p style={{textAlign: 'center', color: '#888'}}>Nu am găsit niciun student.</p>
                ) : (
                    filteredStudenti.map(s => {
                        const isSelected = selected[s.id];
                        return (
                            <div 
                                key={s.id} 
                                className="auth-card"
                                style={{
                                    margin: 0, padding: '1rem',
                                    display: 'flex', alignItems: 'center',
                                    backgroundColor: getStatusColor(prezente[s.id], isSelected),
                                    border: isSelected ? '1px solid #4f46e5' : '1px solid #e5e7eb',
                                    opacity: isSelected ? 1 : 0.6, 
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                <input 
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => toggleSelect(s.id)}
                                    style={{width: '20px', height: '20px', marginRight: '15px', cursor: 'pointer', accentColor: '#4f46e5'}}
                                />

                                <div style={{flex: 1, display: 'flex', alignItems: 'center', gap: '15px'}}>
                                    <div style={{
                                        width: '35px', height: '35px', 
                                        background: isSelected ? '#4f46e5' : '#9ca3af', 
                                        color: 'white', borderRadius: '50%', 
                                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}>
                                        {isSelected ? '👤' : '✖'}
                                    </div>
                                    <div>
                                        <h4 style={{margin: 0}}>{s.nume} {s.prenume}</h4>
                                        <span style={{fontSize: '0.85rem', color: '#6b7280'}}>
                                            {s.serie ? `Seria ${s.serie}` : ''} {s.grupa ? `• Grupa ${s.grupa}` : ''}
                                        </span>
                                    </div>
                                </div>

                                <div style={{width: '140px'}}>
                                    <select 
                                        value={prezente[s.id]} 
                                        onChange={(e) => handleStatusChange(s.id, e.target.value)}
                                        disabled={!isSelected} 
                                        style={{
                                            padding: '8px', borderRadius: '8px',
                                            fontWeight: 'bold', cursor: isSelected ? 'pointer' : 'not-allowed',
                                            backgroundColor: 'white'
                                        }}
                                    >
                                        <option value="prezent">✅ Prezent</option>
                                        <option value="absent">❌ Absent</option>
                                        <option value="motivat">📄 Motivat</option>
                                    </select>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            <button 
                onClick={salveaza} 
                style={{
                    marginTop: '20px', padding: '15px', fontSize: '1.1rem',
                    background: 'linear-gradient(to right, #4f46e5, #7c3aed)'
                }}
            >
                💾 Salvează Selecția
            </button>
        </div>
    );
}

export default Prezenta;