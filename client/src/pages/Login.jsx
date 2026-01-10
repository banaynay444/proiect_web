import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../App.css'; // Asigură-te că importul e aici

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('Se autentifică...');

    try {
      const response = await axios.post('http://localhost:3001/api/login', {
        email,
        password
      });

      const userData = response.data;
      
      if (userData.message) {
        setMessage(userData.message);
      } else {
        localStorage.setItem('user', JSON.stringify(userData));
        if (userData.rol === 'profesor') {
          navigate(`/profesor/${userData.id}`);
        } else {
          navigate(`/student/${userData.id}`);
        }
      }
    } catch (error) {
      setMessage('Eroare la conectare.');
    }
  };

  return (
    <div className="page-container" style={{ maxWidth: '400px', marginTop: '80px' }}>
      <div className="card">
        <h2 style={{ textAlign: 'center', color: 'var(--primary-color)' }}>🎓 Attendance App</h2>
        <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '30px' }}>Autentifică-te pentru a continua</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label style={{marginBottom: '5px', fontSize: '14px'}}>Email</label>
            <input
              type="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ex: profesor@test.com"
              required
            />
          </div>
          <div className="form-group">
            <label style={{marginBottom: '5px', fontSize: '14px'}}>Parolă</label>
            <input
              type="password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block">Intră în cont</button>
        </form>

        {message && <p style={{ textAlign: 'center', color: 'red', marginTop: '15px' }}>{message}</p>}
      </div>
    </div>
  );
}

export default Login;