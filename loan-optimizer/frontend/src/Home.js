import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h1>🏡 หน้าหลัก</h1>
      <p>เลือกขั้นตอนที่ต้องการ:</p>
      <button onClick={() => navigate('/step2')} style={styles.button}>ไปยัง Step 2</button>
      <button onClick={() => navigate('/step5')} style={styles.button}>ไปยัง Step 5</button>
    </div>
  );
}

const styles = {
  button: {
    margin: '10px',
    padding: '12px 24px',
    fontSize: '16px',
    borderRadius: '8px',
    cursor: 'pointer',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none'
  }
};

export default Home;
