const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',      // Serverul local
  user: 'root',           // Userul default din XAMPP
  password: '',           // <--- IMPORTANT: Lasă gol pentru XAMPP default
  database: 'attendance_system' // Numele bazei create la Pasul 3
});

db.connect((err) => {
  if (err) {
      console.error('Eroare la conectare: ', err);
      return;
  }
  console.log('Conectat cu succes la MySQL via XAMPP!');
});

module.exports = db;