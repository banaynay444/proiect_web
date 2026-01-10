const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

// --- MIDDLEWARE ---
app.use(express.json());
app.use(cors());

// --- DATABASE CONNECTION ---
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', 
    database: 'attendance_system'
});

db.connect((err) => {
    if (err) console.error('❌ Eroare MySQL:', err);
    else console.log('✅ Conectat la MySQL!');
});

// ================= RUTE API =================

// 1. REGISTER (Nou)
app.post('/api/register', (req, res) => {
    const { nume, prenume, email, parola, rol, grupa, an, serie } = req.body;

    // Verificăm dacă email-ul există
    db.query("SELECT * FROM users WHERE email = ?", [email], (err, result) => {
        if (err) return res.status(500).send(err);
        if (result.length > 0) {
            return res.send({ message: "Acest email este deja folosit!" });
        }

        const sql = "INSERT INTO users (nume, prenume, email, parola, rol, grupa, an, serie) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        db.query(sql, [nume, prenume, email, parola, rol, grupa, an, serie], (err, result) => {
            if (err) return res.status(500).send(err);
            res.send({ message: "Succes" });
        });
    });
});

// 2. LOGIN (Cu verificare Rol)
app.post('/api/login', (req, res) => {
    const { email, password, rol } = req.body;

    const sql = "SELECT * FROM users WHERE email = ? AND parola = ?";
    db.query(sql, [email, password], (err, result) => {
        if (err) return res.status(500).send({ error: err });

        if (result.length > 0) {
            const user = result[0];
            if (user.rol !== rol) {
                return res.status(403).send({ message: `Contul găsit este de ${user.rol}, nu de ${rol}!` });
            }
            res.send(user);
        } else {
            res.send({ message: "Email sau parolă incorecte!" });
        }
    });
});

// 3. SALVARE PREZENȚĂ (Fix pentru eroarea 404)
app.post('/api/prezenta', (req, res) => {
    const { curs_id, data, prezente } = req.body;

    if (!prezente || prezente.length === 0) return res.status(400).send({ message: "Nu sunt date." });

    // Pentru MySQL Bulk Insert: array de array-uri
    const values = prezente.map(p => [curs_id, p.student_id, data, p.status]);

    const sql = "INSERT INTO attendance (curs_id, student_id, data, status) VALUES ?";
    
    db.query(sql, [values], (err, result) => {
        if (err) {
            console.error(err);
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).send({ message: "Prezența a fost deja făcută pe această dată!" });
            }
            return res.status(500).send(err);
        }
        res.send({ message: "Salvat cu succes!" });
    });
});

// 4. LISTA CURSURI PROFESOR
app.get('/api/profesor/cursuri/:id', (req, res) => {
    db.query("SELECT * FROM courses WHERE profesor_id = ?", [req.params.id], (err, result) => {
        if(err) console.log(err);
        res.send(result);
    });
});

// 5. LISTA STUDENTI (Pentru tabelul de prezență)
app.get('/api/curs/studenti/:cursId', (req, res) => {
    // În viitor poți filtra după tabela de enrollments. Acum luăm toți studenții.
    db.query("SELECT * FROM users WHERE rol = 'student' ORDER BY nume ASC", (err, result) => {
        res.send(result);
    });
});

// 6. DASHBOARD STUDENT
app.get('/api/student/situatie/:studentId', (req, res) => {
    const sql = `
        SELECT c.nume_curs, 
               SUM(CASE WHEN a.status = 'prezent' THEN 1 ELSE 0 END) as prezente,
               SUM(CASE WHEN a.status = 'absent' THEN 1 ELSE 0 END) as absente
        FROM attendance a 
        JOIN courses c ON a.curs_id = c.id 
        WHERE a.student_id = ? 
        GROUP BY c.id, c.nume_curs`;
    
    db.query(sql, [req.params.studentId], (err, result) => res.send(result));
});

// 7. RAPORT PROFESOR
app.get('/api/profesor/raport/:cursId', (req, res) => {
    const cursId = req.params.cursId;
    
    // Această interogare e vitală: numără statusurile DOAR pentru cursul curent
    const sql = `
        SELECT 
            u.id, u.nume, u.prenume, u.grupa, u.serie,
            COALESCE(SUM(CASE WHEN a.status = 'prezent' THEN 1 ELSE 0 END), 0) as prezente,
            COALESCE(SUM(CASE WHEN a.status = 'absent' THEN 1 ELSE 0 END), 0) as absente,
            COALESCE(SUM(CASE WHEN a.status = 'motivat' THEN 1 ELSE 0 END), 0) as motivate,
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
            return res.status(500).send("Eroare server");
        }
        res.send(result);
    });
});

app.get('/api/student/situatie/:studentId', (req, res) => {
    const sql = `
        SELECT c.nume_curs, 
               COALESCE(SUM(CASE WHEN a.status = 'prezent' THEN 1 ELSE 0 END), 0) as prezente,
               COALESCE(SUM(CASE WHEN a.status = 'absent' THEN 1 ELSE 0 END), 0) as absente,
               COALESCE(SUM(CASE WHEN a.status = 'motivat' THEN 1 ELSE 0 END), 0) as motivate,
               COUNT(a.id) as total_sesiuni
        FROM attendance a 
        JOIN courses c ON a.curs_id = c.id 
        WHERE a.student_id = ? 
        GROUP BY c.id, c.nume_curs`;
    
    db.query(sql, [req.params.studentId], (err, result) => {
        if(err) return res.status(500).send(err);
        res.send(result);
    });
});

app.get('/api/utilizator/:id', (req, res) => {
    const sql = "SELECT nume, prenume FROM users WHERE id = ?";
    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).send(err);
        // Trimitem primul rezultat găsit (utilizatorul)
        res.send(result[0]);
    });
});
app.listen(3001, () => console.log('🚀 Server running on port 3001'));