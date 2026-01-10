import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import ProfesorDashboard from './pages/ProfesorDashboard';
import StudentDashboard from './pages/StudentDashboard';
import Prezenta from './pages/Prezenta';
import RaportCurs from './pages/RaportCurs'; // <--- Import Nou

function App() {
  return (
    <Router>
      <div className="app-container"> {/* Am adăugat clasa CSS globală */}
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/profesor/:id" element={<ProfesorDashboard />} />
          <Route path="/student/:id" element={<StudentDashboard />} />
          <Route path="/prezenta/:cursId" element={<Prezenta />} />
          
          {/* Ruta Nouă pentru Raport */}
          <Route path="/raport/:cursId" element={<RaportCurs />} />
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;