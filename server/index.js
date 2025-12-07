const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json()); // Ne lasă să primim date JSON de la React
app.use(cors()); // Ne lasă să primim cereri de la alt port (Frontend)

// Conexiunea la Baza de Date
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // Lasă gol dacă ești pe XAMPP default
    database: 'attendance_system'
});

db.connect((err) => {
    if (err) {
        console.error('Eroare conectare MySQL:', err);
    } else {
        console.log('Conectat la MySQL!');
    }
});

// --- RUTELE (API Endpoints) ---

// 1. Ruta de Login (Verifică user și parolă)
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    const sql = "SELECT * FROM users WHERE email = ? AND parola = ?";
    db.query(sql, [email, password], (err, result) => {
        if (err) {
            res.status(500).send({ error: err });
        } 
        
        if (result.length > 0) {
            // Am găsit utilizatorul
            res.send(result[0]);
        } else {
            res.send({ message: "User sau parolă incorecte!" });
        }
    });
});

// 2. Ruta pentru a lua cursurile unui profesor
app.get('/api/profesor/cursuri/:id', (req, res) => {
    const idProfesor = req.params.id;
    const sql = "SELECT * FROM courses WHERE profesor_id = ?";
    
    db.query(sql, [idProfesor], (err, result) => {
        if (err) console.log(err);
        res.send(result);
    });
});

// 3. Ruta pentru a vedea studenții de la un curs (pentru a face prezența)
app.get('/api/curs/studenti/:cursId', (req, res) => {
    // Aici e un pic mai complex, trebuie să luăm studenții care au legătură cu acest curs.
    // Pentru simplitate acum, luăm toți studenții. 
    // Într-o variantă finală, am avea o tabelă 'enrollments'.
    const sql = "SELECT * FROM users WHERE rol = 'student'"; 
    
    db.query(sql, (err, result) => {
        if (err) console.log(err);
        res.send(result);
    });
});


// Pornirea Serverului
app.listen(3001, () => {
    console.log('Serverul rulează pe portul 3001');
});