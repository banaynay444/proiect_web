# 🎓 Sistem de Gestiune a Prezenței (Attendance System)

![Status](https://img.shields.io/badge/Status-Finalizat-success)
![Tehnologii](https://img.shields.io/badge/Stack-React_Node_MySQL-blue)
![License](https://img.shields.io/badge/Licenta-MIT-yellow)

O aplicație web modernă și intuitivă pentru gestionarea prezențelor la cursuri universitare. Aplicația facilitează interacțiunea dintre profesori și studenți, digitalizând complet procesul de notare a prezenței și generare a rapoartelor.

---

## ✨ Funcționalități Principale

### 🔐 Autentificare & Securitate
* **Login Securizat:** Sistem de autentificare cu verificare a rolului (Profesor vs. Student). Nu permite unui student să se logheze pe interfața de profesor și invers.
* **Înregistrare (Register):** Formular de creare cont cu câmpuri dinamice. Dacă selectezi "Student", apar automat câmpuri specifice (An, Serie, Grupă).
* **Validări:** Verificare unicitate email, confirmare parolă.

### 👨‍🏫 Modul Profesor
* **Dashboard Modern:** Vizualizare sub formă de carduri a tuturor cursurilor alocate, cu efecte vizuale (hover) și iconițe.
* **Gestiune Prezență:**
    * Selectare dată calendaristică.
    * Listă studenți cu design tip "Card".
    * **Funcție Căutare:** Filtrare rapidă studenți după nume.
    * **Checkboxes & Bulk Action:** Posibilitatea de a selecta toți studenții filtrați sau individual.
    * **Status Colorat:** Selector vizual pentru status (✅ Prezent, ❌ Absent, 📄 Motivat).
* **Rapoarte Detaliate:** Vizualizare statistici per curs, cu bare de progres colorate în funcție de rata de prezență a studenților.

### 🎓 Modul Student
* **Personal Dashboard:** O privire de ansamblu asupra situației școlare.
* **Statistici în Timp Real:** Calcul automat al procentajului de prezență pentru fiecare materie.
* **Avertismente Vizuale:**
    * 🟢 **Excelent (≥70%):** Totul este în regulă.
    * 🟠 **Acceptabil (50-70%):** Atenție necesară.
    * 🔴 **Critic (<50%):** Risc de neintrare în examen.

---

## 🛠️ Tehnologii Utilizate

| Categorie | Tehnologii |
| :--- | :--- |
| **Frontend** | React.js, Vite, React Router, Axios, CSS3 (Fluent/Modern Design) |
| **Backend** | Node.js, Express.js |
| **Bază de Date** | MySQL (mysql2) |
| **Arhitectură** | REST API, Client-Server |

---

## 🚀 Instalare și Configurare

Urmează acești pași pentru a rula proiectul local:

### 1. Configurare Bază de Date (MySQL)
Creează o bază de date numită `attendance_system` și rulează următorul SQL:

```sql
CREATE DATABASE attendance_system;
USE attendance_system;

-- Tabela Utilizatori
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nume VARCHAR(100),
  prenume VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  parola VARCHAR(100),
  rol ENUM('student', 'profesor'),
  grupa VARCHAR(20) NULL,
  an VARCHAR(10) NULL,
  serie VARCHAR(10) NULL
);

-- Tabela Cursuri
CREATE TABLE courses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nume_curs VARCHAR(150),
  profesor_id INT,
  FOREIGN KEY (profesor_id) REFERENCES users(id)
);

-- Tabela Prezențe
CREATE TABLE attendance (
  id INT AUTO_INCREMENT PRIMARY KEY,
  curs_id INT,
  student_id INT,
  data DATE,
  status ENUM('prezent', 'absent', 'motivat'),
  UNIQUE KEY unique_attendance (student_id, curs_id, data),
  FOREIGN KEY (curs_id) REFERENCES courses(id),
  FOREIGN KEY (student_id) REFERENCES users(id)
);
2. Pornire Backend (Server)
Deschide un terminal în folderul server:

Bash

cd server
npm install      # Instalează dependențele
node index.js    # Pornește serverul pe portul 3001
3. Pornire Frontend (Client)
Deschide un al doilea terminal în folderul client:

Bash

cd client
npm install      # Instalează dependențele
npm run dev      # Pornește aplicația React
Accesează aplicația la: http://localhost:5173

## 📸 Previzualizare (Structură Pagini)
/ - Pagina de Login (Centrată, cu gradient de fundal).

/register - Pagina de Înregistrare cont nou.

/profesor/:id - Dashboard-ul profesorului (Grid cu cursuri).

/student/:id - Dashboard-ul studentului (Bare de progres).

/prezenta/:id - Interfața de marcare a prezenței.

/raport/:id - Tabelul detaliat cu situația studenților.

## 👤 Autor
Proiect realizat de [Numele Tău]. Dezvoltat ca proiect universitar pentru disciplina Tehnologii Web.