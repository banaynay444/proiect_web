import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nume: '', prenume: '', email: '', parola: '',
        rol: 'student', grupa: '', an: '', serie: ''
    });
    const [msg, setMsg] = useState('');

    const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:3001/api/register', formData);
            if (res.data.message === 'Succes') {
                alert("Cont creat! Te rugăm să te autentifici.");
                navigate('/');
            } else {
                setMsg(res.data.message);
            }
        } catch (err) {
            setMsg("Eroare server.");
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Înregistrare</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Nume & Prenume</label>
                        <div style={{display:'flex', gap:'10px'}}>
                            <input name="nume" placeholder="Nume" onChange={handleChange} required />
                            <input name="prenume" placeholder="Prenume" onChange={handleChange} required />
                        </div>
                    </div>
                    
                    <div className="form-group">
                        <label>Email</label>
                        <input name="email" type="email" onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label>Rol</label>
                        <select name="rol" onChange={handleChange} value={formData.rol}>
                            <option value="student">Student</option>
                            <option value="profesor">Profesor</option>
                        </select>
                    </div>

                    {formData.rol === 'student' && (
                        <div className="form-group" style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'10px'}}>
                            <input name="an" placeholder="An (1-4)" onChange={handleChange} />
                            <input name="serie" placeholder="Serie (A)" onChange={handleChange} />
                            <input name="grupa" placeholder="Grupa" onChange={handleChange} />
                        </div>
                    )}

                    <div className="form-group">
                        <label>Parolă</label>
                        <input name="parola" type="password" onChange={handleChange} required />
                    </div>

                    <p style={{color:'red', textAlign:'center'}}>{msg}</p>
                    <button type="submit">Creează Cont</button>
                </form>
                <Link to="/">
                    <button className="secondary">Ai deja cont? Logare</button>
                </Link>
            </div>
        </div>
    );
}
export default Register;