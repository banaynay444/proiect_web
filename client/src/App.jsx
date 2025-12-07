import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
// 1. Importăm noile componente
import ProfesorDashboard from './pages/ProfesorDashboard';
import StudentDashboard from './pages/StudentDashboard';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          
          {/* 2. Definim rutele pentru ele */}
          {/* :id este un parametru dinamic (ex: /profesor/1) */}
          <Route path="/profesor/:id" element={<ProfesorDashboard />} />
          <Route path="/student/:id" element={<StudentDashboard />} />
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;