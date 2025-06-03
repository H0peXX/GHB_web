// src/Step5.js
import React, { useState, useEffect } from 'react';
import './App.css';
import { useNavigate } from 'react-router-dom';

function Step5() {
  const navigate = useNavigate();

  const [principal, setPrincipal] = useState('');
  const [rate, setRate] = useState('');
  const [term, setTerm] = useState('');
  const [monthly, setMonthly] = useState('');
  const [payment, setPayment] = useState('');
  const [result, setResult] = useState(null);
  const [tip, setTip] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [remainingMonths, setRemainingMonths] = useState('');
  const [oldTerm, setOldTerm] = useState('');
  const [income, setIncome] = useState('');

  useEffect(() => {
    const knownIncome = 11250;
    const knownPrincipal = 200000;
    const knownMonthly = 1319.91;

    setPrincipal(knownPrincipal.toString());
    setRate('5');
    setTerm('240');
    setMonthly(knownMonthly.toString());
    setPayment('');
    setRemainingMonths('240');
    setOldTerm('240');
    setIncome(knownIncome.toString());

    generateSuggestion(knownIncome, knownPrincipal, knownMonthly);
  }, []);

  const generateSuggestion = (incomeVal, principalVal, monthlyVal) => {
    let factor = incomeVal > 20000 ? 2.0 : incomeVal > 15000 ? 1.8 : incomeVal > 10000 ? 1.5 : 1.2;
    const minSuggested = Math.round(monthlyVal * factor);
    const maxSuggested = Math.round((principalVal / 100000) * 1000 * factor);
    setSuggestion(`💡 ลองจ่ายเงินเพิ่มประมาณ ${minSuggested.toLocaleString()} - ${maxSuggested.toLocaleString()} บาท เพื่อช่วยลดเงินต้นและลดดอกเบี้ยรวม`);

    const recommendedMessage = incomeVal > 10000
      ? `คุณมีรายได้ ${incomeVal.toLocaleString()} บาท แนะนำให้จ่ายเพิ่มพิเศษ ${minSuggested.toLocaleString()} - ${maxSuggested.toLocaleString()} บาท เพื่อปิดหนี้ไวขึ้น`
      : `รายได้ของคุณอยู่ที่ ${incomeVal.toLocaleString()} บาท ค่างวดจะถูกปรับตามความสามารถในการชำระ`;

    setRecommendation(recommendedMessage);
  };

  const handleCalculate = async () => {
    if (!payment || isNaN(payment)) return;

    if (parseFloat(payment) > parseFloat(principal)) {
      alert('❌ จำนวนเงินที่จ่ายเพิ่มต้องไม่เกินเงินต้นที่เหลือ');
      return;
    }

    const payload = {
      principal,
      rate,
      term,
      monthly,
      payment,
      income,
      oldTerm
    };

    const date = new Date().toLocaleDateString();

    try {
      const res = await fetch('http://localhost:4000/api/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      setResult({
        message: data.message,
        newPrincipal: data.newPrincipal,
        newPayment: data.newPayment
      });

      const monthsReduced = parseInt(oldTerm) - parseInt(data.newTerm);

      setTip(data.tip);
      setSuggestion(data.suggestion);
      setRemainingMonths(data.newTerm.toString());
      setOldTerm(data.newTerm.toString());
      setPrincipal(data.newPrincipal.toString());

      setTransactions(prev => [
        {
          date,
          amount: parseFloat(payment).toFixed(2),
          status: data.status,
          remaining: data.remaining,
          monthsReduced: monthsReduced > 0 ? monthsReduced : 0
        },
        ...prev
      ]);

      setPayment('');
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleIncomeChange = (e) => {
    const value = e.target.value;
    setIncome(value);
    if (!isNaN(parseFloat(value))) {
      generateSuggestion(parseFloat(value), parseFloat(principal), parseFloat(monthly));
    }
  };

  return (
    <div className="App">
      <h2>สถานะเงินกู้ของคุณ</h2>

      <div className="summary-box">
        <p><strong>เงินต้นคงเหลือ:</strong> {parseFloat(principal).toLocaleString()} บาท</p>
        <p><strong>ค่างวดต่อเดือน:</strong> {parseFloat(monthly).toLocaleString()} บาท</p>
        <p><strong>จำนวนเดือนที่เหลือ:</strong> {remainingMonths} เดือน</p>
        <p style={{ color: 'green' }}><strong>{recommendation}</strong></p>
      </div>

      <div className="input-group">
        <label>รายได้ต่อเดือน</label>
        <input value={income} onChange={handleIncomeChange} placeholder="เช่น 12000" />
      </div>

      <div className="input-group">
        <label>จ่ายเพิ่มพิเศษ</label>
        <input
          type="number"
          min="0"
          value={payment}
          onChange={(e) => {
            const value = e.target.value;
            if (/^\d*\.?\d*$/.test(value)) {
              if (parseFloat(value) <= parseFloat(principal)) {
                setPayment(value);
              } else {
                alert('❌ จำนวนเงินที่จ่ายเพิ่มต้องไม่เกินเงินต้นที่เหลือ');
              }
            }
          }}
          placeholder="ระบุจำนวนเงินที่ต้องการจ่ายเพิ่ม เช่น 10000"
        />
        <button onClick={handleCalculate}>ชำระเงิน</button>
      </div>

      {result && (
        <div className="result">
          <p><strong>{result.message}</strong></p>
          <p>เงินต้นใหม่: {parseFloat(result.newPrincipal).toLocaleString()} บาท</p>
          <p>ค่างวดใหม่ต่อเดือน: {parseFloat(result.newPayment).toLocaleString()} บาท</p>
          {oldTerm !== remainingMonths && (
            <p>จำนวนเดือนเดิม: {oldTerm} เดือน → เหลือ: {remainingMonths} เดือน</p>
          )}
        </div>
      )}

      {tip && (
        <div className="tip">
          <p><em>{tip}</em></p>
        </div>
      )}

      {suggestion && (
        <div className="suggestion">
          <p><strong>{suggestion}</strong></p>
        </div>
      )}

      {transactions.length > 0 && (
        <div className="bank-style-log">
          <h3>ประวัติการชำระเงิน</h3>
          <table>
            <thead>
              <tr>
                <th>วันที่</th>
                <th>ยอดจ่ายเพิ่ม</th>
                <th>สถานะ</th>
                <th>เงินต้นคงเหลือ</th>
                <th>ลดลง (เดือน)</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((txn, index) => (
                <tr key={index}>
                  <td>{txn.date}</td>
                  <td>{txn.amount} บาท</td>
                  <td>{txn.status}</td>
                  <td>{txn.remaining} บาท</td>
                  <td>{txn.monthsReduced > 0 ? `↓ ${txn.monthsReduced}` : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div style={{ marginTop: '30px', textAlign: 'center' }}>
        <button onClick={() => navigate('/')}>🔙 กลับหน้าหลัก</button>
      </div>
    </div>
  );
}

export default Step5;
