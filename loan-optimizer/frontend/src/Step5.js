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
    let repaymentRate;
    let note;

    if (incomeVal < 6000) {
      repaymentRate = 0;
      note = '🛡️ คุณอยู่ในช่วงรายได้น้อย ระบบอาจให้พักชำระหนี้ชั่วคราว';
      setSuggestion('');
      setRecommendation(`${note} รายได้ของคุณคือ ${incomeVal.toLocaleString()} บาท`);
      return;
    } else if (incomeVal <= 10000) {
      repaymentRate = 0.10;
      note = '📉 รายได้ปานกลาง แนะนำชำระขั้นต่ำเบาๆ';
    } else if (incomeVal <= 15000) {
      repaymentRate = 0.25;
      note = '💰 รายได้เหมาะสม แนะนำชำระระดับปกติ';
    } else {
      repaymentRate = 0.35;
      note = '🚀 รายได้ดี แนะนำจ่ายเพิ่มเพื่อลดระยะเวลากู้';
    }

    const suggestedPayment = Math.round(incomeVal * repaymentRate);
    const maxSuggested = Math.round(incomeVal * (repaymentRate + 0.1));
    const estimatedMonths = monthlyVal > 0 ? Math.floor(suggestedPayment / monthlyVal) : 0;

    setSuggestion(`💡 ลองจ่ายเงินเพิ่มประมาณ ${suggestedPayment.toLocaleString()} - ${maxSuggested.toLocaleString()} บาท เพื่อช่วยลดเงินต้นและดอกเบี้ย (ลดได้ประมาณ ${estimatedMonths} เดือน)`);

    setRecommendation(`${note} รายได้ของคุณคือ ${incomeVal.toLocaleString()} บาท แนะนำจ่ายเพิ่ม ${suggestedPayment.toLocaleString()} - ${maxSuggested.toLocaleString()} บาท (ลดได้ประมาณ ${estimatedMonths} เดือน)`);
  };

  const handleCalculate = async () => {
    if (!payment || isNaN(payment)) return;

    const extraPayment = parseFloat(payment);
    const monthlyPayment = parseFloat(monthly);
    const totalPayment = extraPayment + monthlyPayment;

    if (totalPayment > parseFloat(principal)) {
      alert('❌ ยอดรวมที่จ่ายห้ามเกินเงินต้นคงเหลือ');
      return;
    }

    const payload = {
      principal,
      rate,
      term,
      monthly,
      payment: totalPayment.toString(),
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

      const monthsReduced = parseInt(oldTerm) - parseInt(data.newTerm);

      setResult({
        message: data.message,
        newPrincipal: data.newPrincipal,
        newPayment: data.newPayment
      });

      setTip(data.tip);
      setSuggestion(data.suggestion);
      setRemainingMonths(data.newTerm.toString());
      setOldTerm(data.newTerm.toString());
      setPrincipal(data.newPrincipal.toString());

      setTransactions(prev => [
        {
          date,
          amount: totalPayment.toFixed(2),
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
        {monthly && (
          <p>
            💵 รวมยอดชำระเดือนนี้: {(parseFloat(monthly) + parseFloat(payment || 0)).toLocaleString()} บาท
            {payment && parseFloat(payment) > 0 && (
              <> 💡 คาดว่าจะลดได้ประมาณ <strong>{Math.max(Math.floor((parseFloat(payment) + parseFloat(monthly)) / parseFloat(monthly)) - 1, 0)} เดือน</strong></>
            )}
          </p>
        )}
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