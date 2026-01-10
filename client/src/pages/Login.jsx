import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('student'); // Default student
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        setError(''); // Reset error

        axios.post('http://localhost:3001/api/login', {
            email: email,
            password: password,
            rol: role // Trimitem si rolul selectat
        })
        .then(response => {
            if (response.data.message) {
                // Eroare de la server (ex: rol gresit sau user inexistent)
                setError(response.data.message);
            } else {
                const user = response.data;
                // Redirectionare in functie de rolul REVENIT din baza de date
                if (user.rol === 'profesor') {
                    navigate(`/profesor/${user.id}`);
                } else {
                    navigate(`/student/${user.id}`);
                }
            }
        })
        .catch(err => {
            console.error(err);
            if(err.response && err.response.status === 403) {
                setError(err.response.data.message); // Mesajul specific cu rolul gresit
            } else {
                setError("Eroare de server.");
            }
        });
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1>Bine ai revenit! 👋</h1>
                <p style={{textAlign: 'center', color: '#666', marginBottom: '20px'}}>Sistem de Prezență</p>
                
                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label>Email</label>
                        <input 
                            type="email" 
                            placeholder="exemplu@student.ro"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required 
                        />
                    </div>

                    <div className="form-group">
                        <label>Parolă</label>
                        <input 
                            type="password" 
                            placeholder="••••••"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required 
                        />
                    </div>

                    <div className="form-group">
                        <label>Conectare ca:</label>
                        <select value={role} onChange={e => setRole(e.target.value)}>
                            <option value="student">Student</option>
                            <option value="profesor">Profesor</option>
                        </select>
                    </div>

                    {error && <div className="error-msg">{error}</div>}

                    <button type="submit">Autentificare</button>
                </form>

                <Link to="/register">
                    <button className="secondary">Nu ai cont? Înregistrează-te</button>
                </Link>
            </div>
        </div>
    );
}

export default Login;