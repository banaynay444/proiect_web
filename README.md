 # Attendance Tracking Web Application

A simple web application to track attendance for courses. This project includes a **Node.js + Express backend** with a **MySQL database**.


 Features

- User authentication (login)  
- View professor's courses  
- List students for a course  
- Ready to extend for marking attendance  

---

 Prerequisites

- Node.js (v16+) and npm  
- MySQL installed locally (XAMPP, WAMP, or native)  
- Git (optional, for cloning the repository)  

---

Setup

 Clone Repository

``bash
git clone https://github.com/banaynay444/proiect_web.git
cd proiect_web

Backend Setup

Install dependencies:

npm install


##Configure the MySQL database:

Create a database called attendance_system

##Create tables:

CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL,
  parola VARCHAR(255) NOT NULL,
  rol ENUM('student','profesor') NOT NULL
);

CREATE TABLE courses (
  id INT PRIMARY KEY AUTO_INCREMENT,
  profesor_id INT,
  nume_curs VARCHAR(255)
);

-- Optional: Enrollments table to link students and courses
CREATE TABLE enrollments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  student_id INT,
  course_id INT
);


Update the database connection in server.js:

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // your MySQL password
    database: 'attendance_system'
});

Running Backend
node server.js


The server runs at: http://localhost:3001

You should see logs: Serverul rulează pe portul 3001 and Conectat la MySQL!

API Endpoints
Endpoint	Method	Description
/api/login	POST	Log in user
/api/profesor/cursuri/:id	GET	Get all courses assigned to a professor
/api/curs/studenti/:cursId	GET	Get all students for a specific course
Usage
1. Login

Send a POST request to /api/login:

{
  "email": "prof@example.com",
  "password": "your_password"
}


Valid credentials → returns user object

Invalid → { message: "User sau parolă incorecte!" }

2. View Professor Courses

GET /api/profesor/cursuri/:id

Replace :id with professor ID

Returns a list of courses for that professor

3. View Students for a Course

GET /api/curs/studenti/:cursId

Returns all students (can later be filtered by enrolled students in that course)

4. Mark Attendance

Not yet implemented in this version

Suggested approach:

Create attendance table with student_id, course_id, date, status

Add POST endpoint /api/curs/:cursId/attendance

Future Improvements

Implement full attendance marking system

Create React frontend to interact with backend via API

Add role-based access (professor vs student dashboards)

Extend API to filter students by enrolled courses

Notes

Make sure MySQL server is running before starting the backend

Use Postman or Axios to test API endpoints

Backend is currently standalone; frontend can be added to consume these APIs

  License

MIT License
