import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register'; // Vom crea acest fișier imediat
import ProfesorDashboard from './pages/ProfesorDashboard';
import StudentDashboard from './pages/StudentDashboard';
import Prezenta from './pages/Prezenta';
import RaportCurs from './pages/RaportCurs';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profesor/:id" element={<ProfesorDashboard />} />
      <Route path="/student/:id" element={<StudentDashboard />} />
      {/* Ruta :id este obligatorie pentru a ști la ce curs facem prezența */}
      <Route path="/prezenta/:id" element={<Prezenta />} />
      <Route path="/raport/:id" element={<RaportCurs />} />
    </Routes>
  );
}

export default App;