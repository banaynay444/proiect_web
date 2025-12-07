import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
        email: email,
        password: password
      });

      const userData = response.data;
      
      if (userData.message) {
        // Cazul în care backend-ul returnează eroare (User sau parolă incorecte!)
        setMessage(userData.message);
      } else {
        // Cazul de succes: userData conține informațiile despre utilizator
        setMessage(`Autentificare reușită! Bine ai venit, ${userData.prenume}.`);

        // Aici stocăm rolul și ID-ul (Exemplu: în LocalStorage)
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Redirecționarea în funcție de rol
        if (userData.rol === 'profesor') {
          navigate(`/profesor/${userData.id}`); // Ex: /profesor/1
        } else if (userData.rol === 'student') {
          navigate(`/student/${userData.id}`); // Ex: /student/2
        }
      }

    } catch (error) {
      setMessage('Eroare la conectarea la server.');
      console.error(error);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Attendance Tracker - Login</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="email"
          placeholder="Email (ex: profesor@test.com)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Parolă (ex: 123456)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Autentificare</button>
      </form>

      {message && <p style={styles.message}>{message}</p>}
      
      <p style={styles.testInfo}>
        Folosește datele de test:
        <br/>
        **Profesor:** profesor@test.com / 123456
        <br/>
        **Student:** student@test.com / 123456
      </p>
    </div>
  );
}

// Stiluri simple pentru aspectul minimal (le poți muta în CSS)
const styles = {
    container: {
        maxWidth: '400px',
        margin: '50px auto',
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
    },
    title: {
        textAlign: 'center',
        color: '#333'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px'
    },
    input: {
        padding: '10px',
        borderRadius: '4px',
        border: '1px solid #ddd'
    },
    button: {
        padding: '10px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
    },
    message: {
        textAlign: 'center',
        marginTop: '20px',
        color: 'red'
    },
    testInfo: {
        marginTop: '20px',
        padding: '10px',
        backgroundColor: '#f9f9f9',
        border: '1px solid #eee',
        borderRadius: '4px',
        fontSize: '14px'
    }
};

export default Login;