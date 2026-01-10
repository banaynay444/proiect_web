const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

// --- MIDDLEWARE ---
app.use(express.json()); // Permite primirea datelor JSON
app.use(cors());         // Permite cereri de pe portul de Frontend (5173)

// --- CONEXIUNEA LA BAZA DE DATE ---
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // Lasă gol pentru XAMPP default
    database: 'attendance_system'
});

db.connect((err) => {
    if (err) {
        console.error('Eroare conectare MySQL:', err);
    } else {
        console.log('✅ Conectat la MySQL!');
    }
});

// ==========================================
//                 RUTE API
// ==========================================

// 1. LOGIN
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const sql = "SELECT * FROM users WHERE email = ? AND parola = ?";
    
    db.query(sql, [email, password], (err, result) => {
        if (err) return res.status(500).send({ error: err });
        
        if (result.length > 0) {
            res.send(result[0]);
        } else {
            res.send({ message: "User sau parolă incorecte!" });
        }
    });
});

// 2. LISTA CURSURI (Pentru Profesor)
app.get('/api/profesor/cursuri/:id', (req, res) => {
    const idProfesor = req.params.id;
    const sql = "SELECT * FROM courses WHERE profesor_id = ?";
    
    db.query(sql, [idProfesor], (err, result) => {
        if (err) console.log(err);
        res.send(result);
    });
});

// 3. LISTA STUDENȚI LA UN CURS (Pentru a popula tabelul de prezență)
app.get('/api/curs/studenti/:cursId', (req, res) => {
    // Luăm toți studenții (într-un app real, ar trebui filtrați după înscriere)
    const sql = "SELECT * FROM users WHERE rol = 'student' ORDER BY nume ASC"; 
    
    db.query(sql, (err, result) => {
        if (err) console.log(err);
        res.send(result);
    });
});

// 4. SALVARE PREZENȚĂ (Ruta care lipsea!)
app.post('/api/prezenta', (req, res) => {
    // Frontend-ul trebuie să trimită: { curs_id: 1, data: '2023-10-01', prezente: [{student_id: 2, status: 'prezent'}, ...] }
    const { curs_id, data, prezente } = req.body;

    if (!prezente || prezente.length === 0) {
        return res.status(400).send({ message: "Nu sunt date de salvat." });
    }

    // Pregătim datele pentru inserare multiplă (Bulk Insert)
    const values = prezente.map(p => [curs_id, p.student_id, data, p.status]);

    const sql = "INSERT INTO attendance (curs_id, student_id, data, status) VALUES ?";

    db.query(sql, [values], (err, result) => {
        if (err) {
            console.error("Eroare SQL:", err);
            // Verificăm dacă e eroare de duplicat (dacă ai setat cheie unică pe dată+student)
            if (err.code === 'ER_DUP_ENTRY') {
                res.status(409).send({ message: "Prezența există deja pentru această dată!" });
            } else {
                res.status(500).send({ error: "Eroare la salvarea în baza de date." });
            }
        } else {
            console.log("Prezență salvată!");
            res.send({ message: "Salvat cu succes!" });
        }
    });
});

// 5. DASHBOARD STUDENT (Statistici proprii)
app.get('/api/student/situatie/:studentId', (req, res) => {
    const studentId = req.params.studentId;
    
    const sql = `
        SELECT 
            c.nume_curs,
            SUM(CASE WHEN a.status = 'prezent' THEN 1 ELSE 0 END) as prezente,
            SUM(CASE WHEN a.status = 'absent' THEN 1 ELSE 0 END) as absente,
            SUM(CASE WHEN a.status = 'motivat' THEN 1 ELSE 0 END) as motivate,
            COUNT(a.id) as total_sesiuni
        FROM attendance a
        JOIN courses c ON a.curs_id = c.id
        WHERE a.student_id = ?
        GROUP BY c.id, c.nume_curs
    `;

    db.query(sql, [studentId], (err, result) => {
        if (err) return res.status(500).send("Eroare server");
        res.send(result);
    });
});

// 6. RAPORT PROFESOR (Statistici pe curs)
app.get('/api/profesor/raport/:cursId', (req, res) => {
    const cursId = req.params.cursId;
    
    // LEFT JOIN e important ca să vedem și studenții care NU au nicio prezență încă
    const sql = `
        SELECT 
            u.id, u.nume, u.prenume, u.grupa,
            SUM(CASE WHEN a.status = 'prezent' THEN 1 ELSE 0 END) as prezente,
            SUM(CASE WHEN a.status = 'absent' THEN 1 ELSE 0 END) as absente,
            SUM(CASE WHEN a.status = 'motivat' THEN 1 ELSE 0 END) as motivate,
            COUNT(a.id) as total_sesiuni
        FROM users u
        LEFT JOIN attendance a ON u.id = a.student_id AND a.curs_id = ?
        WHERE u.rol = 'student'
        GROUP BY u.id
        ORDER BY u.nume ASC
    `;

    db.query(sql, [cursId], (err, result) => {
        if (err) return res.status(500).send("Eroare server");
        res.send(result);
    });
});

// --- PORNIRE SERVER ---
app.listen(3001, () => {
    console.log('🚀 Serverul rulează pe portul 3001');
});