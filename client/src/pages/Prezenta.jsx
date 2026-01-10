import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

function Prezenta() {
  const { cursId } = useParams();
  const navigate = useNavigate();
  const [studenti, setStudenti] = useState([]);
  const [dataAzi, setDataAzi] = useState(new Date().toISOString().slice(0, 10));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cerem lista simplă de studenți
    axios.get(`http://localhost:3001/api/curs/studenti/${cursId}`)
      .then(res => {
        // Le atașăm un status default 'absent' pentru formular
        const date = res.data.map(s => ({ ...s, status: 'absent' }));
        setStudenti(date);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [cursId]);

  const handleStatusChange = (index, status) => {
    const newStudenti = [...studenti];
    newStudenti[index].status = status;
    setStudenti(newStudenti);
  };

  const salveaza = async () => {
    try {
        const payload = {
            curs_id: cursId,
            data: dataAzi,
            prezente: studenti.map(s => ({ student_id: s.id, status: s.status }))
        };
        await axios.post('http://localhost:3001/api/prezenta', payload);
        alert("Prezență salvată!");
        navigate(-1);
    } catch (e) {
        alert("Eroare la salvare");
    }
  };

  if (loading) return <div className="page-container">Se încarcă...</div>;

  return (
    <div className="page-container">
      <button className="btn" onClick={() => navigate(-1)} style={{background: '#9ca3af', marginBottom: '20px'}}>Inapoi</button>
      <div className="card">
        <h2>Fă Prezența - Data: <input type="date" value={dataAzi} onChange={e => setDataAzi(e.target.value)}/></h2>
        
        {studenti.length === 0 ? (
            <p>Nu există studenți înregistrați în baza de date.</p>
        ) : (
            <div className="table-container">
            <table>
                <thead>
                <tr>
                    <th>Student</th>
                    <th style={{textAlign:'center', color:'green'}}>Prezent</th>
                    <th style={{textAlign:'center', color:'red'}}>Absent</th>
                    <th style={{textAlign:'center', color:'orange'}}>Motivat</th>
                </tr>
                </thead>
                <tbody>
                {studenti.map((s, idx) => (
                    <tr key={s.id}>
                    <td>{s.nume} {s.prenume}</td>
                    <td align="center"><input type="radio" name={'s'+s.id} checked={s.status==='prezent'} onChange={()=>handleStatusChange(idx,'prezent')} /></td>
                    <td align="center"><input type="radio" name={'s'+s.id} checked={s.status==='absent'} onChange={()=>handleStatusChange(idx,'absent')} /></td>
                    <td align="center"><input type="radio" name={'s'+s.id} checked={s.status==='motivat'} onChange={()=>handleStatusChange(idx,'motivat')} /></td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        )}
        <button className="btn btn-success" style={{marginTop:'20px', width:'100%'}} onClick={salveaza}>Salvează</button>
      </div>
    </div>
  );
}

export default Prezenta;