import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from '../pages/Login';
// Vom crea aceste componente ulterior:
// import ProfesorDashboard from './pages/ProfesorDashboard'; 
// import StudentDashboard from './pages/StudentDashboard';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          {/* Rutele viitoare: */}
          {/* <Route path="/profesor/:id" element={<ProfesorDashboard />} /> */}
          {/* <Route path="/student/:id" element={<StudentDashboard />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;