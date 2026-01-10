const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', 
    database: 'attendance_system'
});

db.connect((err) => {
    if (err) console.error('Eroare MySQL:', err);
    else console.log('✅ Conectat la MySQL!');
});

// --- RUTE API ---

// 1. LOGIN AVANSAT (Cu verificare de ROL)
app.post('/api/login', (req, res) => {
    const { email, password, rol } = req.body;

    // Pasul 1: Verificăm dacă userul există cu email și parolă
    const sql = "SELECT * FROM users WHERE email = ? AND parola = ?";
    db.query(sql, [email, password], (err, result) => {
        if (err) return res.status(500).send({ error: err });

        if (result.length > 0) {
            const user = result[0];
            // Pasul 2: Verificăm dacă rolul selectat corespunde cu cel din bază
            if (user.rol !== rol) {
                return res.status(403).send({ message: `Eroare: Acest cont este de ${user.rol}, nu de ${rol}!` });
            }
            res.send(user);
        } else {
            res.send({ message: "Email sau parolă incorecte!" });
        }
    });
});

// 2. REGISTER (Ruta Nouă)
app.post('/api/register', (req, res) => {
    const { nume, prenume, email, parola, rol, grupa, an, serie } = req.body;

    // Verificăm dacă mailul există deja
    db.query("SELECT * FROM users WHERE email = ?", [email], (err, result) => {
        if (result.length > 0) {
            return res.send({ message: "Acest email este deja folosit!" });
        } else {
            const sqlInsert = "INSERT INTO users (nume, prenume, email, parola, rol, grupa, an, serie) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
            db.query(sqlInsert, [nume, prenume, email, parola, rol, grupa, an, serie], (err, result) => {
                if (err) return res.status(500).send(err);
                res.send({ message: "Înregistrare reușită! Te poți loga." });
            });
        }
    });
});

// ... (Restul rutelor rămân neschimbate - le copiez pentru context) ...
app.get('/api/profesor/cursuri/:id', (req, res) => {
    db.query("SELECT * FROM courses WHERE profesor_id = ?", [req.params.id], (err, result) => res.send(result));
});

app.get('/api/curs/studenti/:cursId', (req, res) => {
    db.query("SELECT * FROM users WHERE rol = 'student' ORDER BY nume ASC", (err, result) => res.send(result));
});

app.post('/api/prezenta', (req, res) => {
    const { curs_id, data, prezente } = req.body;
    if (!prezente || prezente.length === 0) return res.status(400).send({ message: "No data" });
    const values = prezente.map(p => [curs_id, p.student_id, data, p.status]);
    const sql = "INSERT INTO attendance (curs_id, student_id, data, status) VALUES ?";
    db.query(sql, [values], (err, result) => {
        if (err && err.code === 'ER_DUP_ENTRY') res.status(409).send({ message: "Prezența există deja!" });
        else if (err) res.status(500).send(err);
        else res.send({ message: "Salvat!" });
    });
});

app.get('/api/student/situatie/:studentId', (req, res) => {
    const sql = `SELECT c.nume_curs, 
                 SUM(CASE WHEN a.status = 'prezent' THEN 1 ELSE 0 END) as prezente,
                 SUM(CASE WHEN a.status = 'absent' THEN 1 ELSE 0 END) as absente
                 FROM attendance a JOIN courses c ON a.curs_id = c.id 
                 WHERE a.student_id = ? GROUP BY c.id, c.nume_curs`;
    db.query(sql, [req.params.studentId], (err, result) => res.send(result));
});

app.get('/api/profesor/raport/:cursId', (req, res) => {
    const sql = `SELECT u.id, u.nume, u.prenume, u.grupa,
                 SUM(CASE WHEN a.status = 'prezent' THEN 1 ELSE 0 END) as prezente,
                 SUM(CASE WHEN a.status = 'absent' THEN 1 ELSE 0 END) as absente
                 FROM users u LEFT JOIN attendance a ON u.id = a.student_id AND a.curs_id = ?
                 WHERE u.rol = 'student' GROUP BY u.id ORDER BY u.nume ASC`;
    db.query(sql, [req.params.cursId], (err, result) => res.send(result));
});

app.listen(3001, () => { console.log('🚀 Server running on 3001'); });