import React from 'react';
import { useParams } from 'react-router-dom';

function StudentDashboard() {
  const { id } = useParams();
  // Putem lua datele salvate la login din localStorage dacă vrem numele
  const user = JSON.parse(localStorage.getItem('user')) || {};

  return (
    <div style={{ padding: '20px' }}>
      <h1>Panou Student</h1>
      <h3>Bine ai venit, {user.prenume}!</h3>
      <p>ID Student: {id}</p>
      <p>Aici vei vedea situația prezențelor tale.</p>
    </div>
  );
}

export default StudentDashboard;