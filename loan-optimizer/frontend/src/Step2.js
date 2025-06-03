// src/Step2.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Step2() {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [bankStatement, setBankStatement] = useState(null);
  const [assessment, setAssessment] = useState(null);
  const [processing, setProcessing] = useState(false);

  const navigate = useNavigate();

  const handleUpload = (e) => {
    const files = Array.from(e.target.files);
    setUploadedFiles(files);
  };

  const handleBankStatement = (e) => {
    setBankStatement(e.target.files[0]);
  };

  const handleAnalyze = () => {
    if (uploadedFiles.length === 0 && !bankStatement) {
      alert('กรุณาอัปโหลดสลิปรายได้หรือ statement ก่อน');
      return;
    }

    setProcessing(true);

    // Mock logic: ใช้เวลา 2 วินาทีในการ "วิเคราะห์"
    setTimeout(() => {
      const mockIncome = 11500 + Math.floor(Math.random() * 3000); // ระหว่าง 11500-14500
      const volatility = Math.floor(Math.random() * 1000); // ± รายได้ผันผวน

      const loanAmount = Math.floor((mockIncome * 30) / 1000) * 10000; // สมมุติ loan factor
      const minPayment = Math.floor(mockIncome * 0.13 / 100) * 100; // ค่างวดต่ำสุด

      setAssessment({
        income: mockIncome,
        volatility,
        loanAmount,
        minPayment
      });

      setProcessing(false);
    }, 2000);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Step 2: Income Verification & Profile Building</h2>

      <div style={{ margin: '1rem 0' }}>
        <label><strong>อัปโหลดภาพ:</strong></label><br />
        <input type="file" multiple accept="image/*" onChange={handleUpload} />
      </div>

      <div style={{ margin: '1rem 0' }}>
        <label><strong>(Optional) แนบ Bank Statement หรือ Gmail รายได้:</strong></label><br />
        
      </div>

      <button onClick={handleAnalyze} disabled={processing} style={{ marginTop: '1rem', padding: '0.7rem 1.2rem' }}>
        {processing ? 'กำลังวิเคราะห์...' : '📊 วิเคราะห์รายได้'}
      </button>

      {assessment && (
        <div style={{ background: '#f0f0f0', padding: '1rem', marginTop: '2rem', borderRadius: '8px' }}>
          <h3>🎉 ผลการประเมิน Smart Loan</h3>
          <p><strong>รายได้เฉลี่ย:</strong> {assessment.income.toLocaleString()} บาท</p>
          <p><strong>ความผันผวน:</strong> ±{assessment.volatility.toLocaleString()} บาท</p>
          <p><strong>วงเงินกู้ที่คุณมีสิทธิ์:</strong> {assessment.loanAmount.toLocaleString()} บาท</p>
          <p><strong>ผ่อนขั้นต่ำเริ่มต้นที่:</strong> {assessment.minPayment.toLocaleString()} บาท/เดือน</p>
        </div>
      )}

      {assessment && (
        <div style={{ marginTop: '2rem', background: '#dff5e3', padding: '1rem', borderRadius: '6px' }}>
          <h4>🏡 ธอส. ขอแนะนำบ้านที่ถูกใจในราคาย่อมเยา</h4>
          <a href="https://www.ghbankbigfamily.com/homes/ghb-home-center" target="_blank" rel="noopener noreferrer">
            คลิกเพื่อดูบ้านแนะนำ
          </a>
        </div>
      )}

      <div style={{ marginTop: '2rem' }}>
        <button onClick={() => navigate('/step5')}>➡ ไป Step 5</button>
      </div>
      <div style={{ marginTop: '30px', textAlign: 'center' }}>
        <button onClick={() => navigate('/')}>🔙 กลับหน้าหลัก</button>
      </div>
    </div>
  );
}

export default Step2;
