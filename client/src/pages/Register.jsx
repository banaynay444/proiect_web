import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Register() {
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        nume: '', prenume: '', email: '', parola: '', repeatParola: '',
        rol: 'student', grupa: '', serie: '', an: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = (e) => {
        e.preventDefault();
        setError('');

        if (formData.parola !== formData.repeatParola) {
            setError("Parolele nu coincid!");
            return;
        }

        // Trimitem datele la server
        axios.post('http://localhost:3001/api/register', formData)
            .then(res => {
                if (res.data.message.includes("folosit")) {
                    setError(res.data.message);
                } else {
                    alert("Cont creat cu succes!");
                    navigate('/'); // Mergem la login
                }
            })
            .catch(err => {
                console.error(err);
                setError("Eroare la înregistrare.");
            });
    };

    return (
        <div className="auth-container">
            <div className="auth-card" style={{ maxWidth: '500px' }}>
                <h2>Creează Cont Nou 🚀</h2>
                
                <form onSubmit={handleRegister}>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label>Nume</label>
                            <input name="nume" onChange={handleChange} required />
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label>Prenume</label>
                            <input name="prenume" onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" name="email" onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label>Tip Cont</label>
                        <select name="rol" value={formData.rol} onChange={handleChange}>
                            <option value="student">Student</option>
                            <option value="profesor">Profesor</option>
                        </select>
                    </div>

                    {/* Campuri Conditionale doar pentru Studenti */}
                    {formData.rol === 'student' && (
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <div className="form-group" style={{ flex: 1 }}>
                                <label>An</label>
                                <select name="an" onChange={handleChange}>
                                    <option value="">Alege</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                </select>
                            </div>
                            <div className="form-group" style={{ flex: 1 }}>
                                <label>Serie</label>
                                <input name="serie" placeholder="Ex: A" onChange={handleChange} />
                            </div>
                            <div className="form-group" style={{ flex: 1 }}>
                                <label>Grupa</label>
                                <input name="grupa" placeholder="Ex: 1045" onChange={handleChange} />
                            </div>
                        </div>
                    )}

                    <div className="form-group">
                        <label>Parolă</label>
                        <input type="password" name="parola" onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label>Repetă Parolă</label>
                        <input type="password" name="repeatParola" onChange={handleChange} required />
                    </div>

                    {error && <div className="error-msg">{error}</div>}

                    <button type="submit">Înregistrează-te</button>
                </form>

                <Link to="/">
                    <button className="secondary">Ai deja cont? Logare</button>
                </Link>
            </div>
        </div>
    );
}

export default Register;