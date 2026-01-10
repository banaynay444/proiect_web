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
// 5. Ruta pentru Dashboard STUDENT (Situația proprie)
app.get('/api/student/situatie/:studentId', (req, res) => {
    const studentId = req.params.studentId;
    
    // Această interogare calculează totalurile pentru fiecare curs
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
        if (err) {
            console.error(err);
            res.status(500).send("Eroare server");
        } else {
            res.send(result);
        }
    });
});

// 6. Ruta pentru Raport PROFESOR (Situația la un curs)
app.get('/api/profesor/raport/:cursId', (req, res) => {
    const cursId = req.params.cursId;
    
    const sql = `
        SELECT 
            u.nume, u.prenume, u.grupa,
            SUM(CASE WHEN a.status = 'prezent' THEN 1 ELSE 0 END) as prezente,
            SUM(CASE WHEN a.status = 'absent' THEN 1 ELSE 0 END) as absente,
            COUNT(a.id) as total_sesiuni
        FROM attendance a
        JOIN users u ON a.student_id = u.id
        WHERE a.curs_id = ?
        GROUP BY u.id
        ORDER BY u.nume ASC
    `;

    db.query(sql, [cursId], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send("Eroare server");
        } else {
            res.send(result);
        }
    });
});
// 1. Ruta pentru Raportul Profesorului (Lista studenților cu calcule)
app.get('/api/profesor/raport/:cursId', (req, res) => {
    const cursId = req.params.cursId;
    // Această interogare numără câte prezențe, absențe și motivări are fiecare student la un curs
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
        if (err) {
            console.error(err);
            res.status(500).send("Eroare server");
        } else {
            res.send(result);
        }
    });
});

// 2. Ruta pentru Dashboard-ul Studentului (Situația proprie)
app.get('/api/student/situatie/:studentId', (req, res) => {
    const studentId = req.params.studentId;
    
    // Vedem cursurile și prezența la fiecare
    const sql = `
        SELECT 
            c.nume_curs,
            SUM(CASE WHEN a.status = 'prezent' THEN 1 ELSE 0 END) as prezente,
            SUM(CASE WHEN a.status = 'absent' THEN 1 ELSE 0 END) as absente
        FROM attendance a
        JOIN courses c ON a.curs_id = c.id
        WHERE a.student_id = ?
        GROUP BY c.id
    `;
    
    db.query(sql, [studentId], (err, result) => {
        if (err) return res.status(500).send(err);
        res.send(result);
    });
});

// Pornirea Serverului
app.listen(3001, () => {
    console.log('Serverul rulează pe portul 3001');
});