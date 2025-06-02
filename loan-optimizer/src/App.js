import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
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

    setPrincipal('200000');
    setRate('5');
    setTerm('240');
    setMonthly('1319.91');
    setPayment('');
    setSuggestion('💡 ลองจ่ายเงินเพิ่มเพื่อช่วยลดเงินต้นและลดดอกเบี้ยรวม');
    setRemainingMonths('240');
    setOldTerm('240');
    setIncome(knownIncome.toString());

    const recommendedMessage =
      knownIncome > 10000
        ? `📌 คุณมีรายได้ ${knownIncome.toLocaleString()} บาท แนะนำให้จ่ายเพิ่มพิเศษ ${Math.round(1319.91 * 1.5).toLocaleString()} - ${(1319.91 * 3).toLocaleString()} บาท เพื่อปิดหนี้ไวขึ้น`
        : `📌 รายได้ของคุณอยู่ที่ ${knownIncome.toLocaleString()} บาท ค่างวดจะถูกปรับตามความสามารถในการชำระ`;
    setRecommendation(recommendedMessage);
  }, []);

  const handleCalculate = () => {
    const P = parseFloat(principal);
    const r = parseFloat(rate) / 100 / 12;
    const n = parseInt(term);
    const mp = parseFloat(monthly);
    const X = parseFloat(payment);
    const incomeNum = parseFloat(income);

    if (isNaN(P) || isNaN(r) || isNaN(n) || isNaN(mp) || isNaN(X)) return;

    let newPrincipal = P;
    let tipMessage = '';
    let suggestionMessage = '';
    const date = new Date().toLocaleDateString();
    let status = '';
    let remaining = P.toFixed(2);
    let newTerm = n;

    if (X >= 3 * mp) {
      newPrincipal = P - X;
      if (newPrincipal <= 0) {
        setResult({
          message: 'ปิดหนี้ทั้งหมดเรียบร้อยแล้ว!',
          newPrincipal: 0,
          newPayment: 0,
        });
        tipMessage = 'เยี่ยมมาก! การจ่ายเงินก้อนใหญ่ช่วยให้คุณปลดหนี้ได้เร็วและประหยัดดอกเบี้ย';
        suggestionMessage = '🎉 คุณได้ปิดหนี้เรียบร้อยแล้ว!';
        status = '✅ ปิดหนี้';
        remaining = '0.00';
        setRemainingMonths('0');
      } else {
        const newPayment = (newPrincipal * r) / (1 - Math.pow(1 + r, -n));
        const numerator = Math.log(mp / (mp - newPrincipal * r));
        const denominator = Math.log(1 + r);
        newTerm = Math.ceil(numerator / denominator);

        setResult({
          message: 'ลดเงินต้นสำเร็จ',
          newPrincipal: newPrincipal.toFixed(2),
          newPayment: newPayment.toFixed(2),
        });
        tipMessage = 'การจ่ายเงินเพิ่มช่วยลดเงินต้นและระยะเวลากู้';
        suggestionMessage = `✅ ลดเงินต้นสำเร็จ จาก ${oldTerm} เดือน → เหลือ ${newTerm} เดือนในการผ่อน`; 
        status = '✅ ลดเงินต้น';
        remaining = newPrincipal.toFixed(2);
        setPrincipal(newPrincipal.toFixed(2));
        setOldTerm(newTerm.toString());
        setRemainingMonths(newTerm.toString());
      }
    } else {
      setResult({
        message: 'จำนวนเงินยังไม่มากพอในการลดเงินต้นล่วงหน้า',
        newPrincipal: P.toFixed(2),
        newPayment: mp.toFixed(2),
      });
      tipMessage = 'แนะนำให้จ่ายมากกว่า 3 เท่าของค่างวดรายเดือนเพื่อผลลัพธ์ที่ชัดเจน';
      suggestionMessage = `⚠️ ลองเพิ่มจำนวนเงินเพื่อช่วยลดเงินต้นได้มากขึ้น (เหลือ ${newTerm} เดือน)`;
      status = '⚠️ น้อยเกินไป';
    }

    setTip(tipMessage);
    setSuggestion(suggestionMessage);
    setTransactions(prev => [
      {
        date,
        amount: X.toFixed(2),
        status,
        remaining
      },
      ...prev
    ]);
    setPayment('');
  };

  const handleIncomeChange = (e) => {
    const value = e.target.value;
    setIncome(value);
    if (!isNaN(parseFloat(value))) {
      const incomeVal = parseFloat(value);
      const newRecommended = incomeVal > 10000
        ? `📌 คุณมีรายได้ ${incomeVal.toLocaleString()} บาท แนะนำให้จ่ายเพิ่มพิเศษ ${Math.round(monthly * 1.5).toLocaleString()} - ${(monthly * 3).toLocaleString()} บาท เพื่อปิดหนี้ไวขึ้น`
        : `📌 รายได้ของคุณอยู่ที่ ${incomeVal.toLocaleString()} บาท ค่างวดจะถูกปรับตามความสามารถในการชำระ`;
      setRecommendation(newRecommended);
    }
  };

  return (
    <div className="App">
      <h2>💰 สถานะเงินกู้ของคุณ</h2>

      <div className="summary-box">
        <p><strong>เงินต้นคงเหลือ:</strong> {parseFloat(principal).toLocaleString()} บาท</p>
        <p><strong>ค่างวดต่อเดือน:</strong> {parseFloat(monthly).toLocaleString()} บาท</p>
        <p><strong>จำนวนเดือนที่เหลือ:</strong> {remainingMonths} เดือน</p>
        <p style={{ color: 'green' }}><strong>{recommendation}</strong></p>
      </div>

      <div className="input-group">
        <label>📥 รายได้ต่อเดือน</label>
        <input value={income} onChange={handleIncomeChange} placeholder="เช่น 12000" />
      </div>

      <div className="input-group">
        <label>💸 จ่ายเพิ่มพิเศษ</label>
        <input value={payment} onChange={e => setPayment(e.target.value)} placeholder="ระบุจำนวนเงินที่ต้องการจ่ายเพิ่ม เช่น 10000" />
        <button onClick={handleCalculate}>ชำระเงิน</button>
      </div>

      {result && (
        <div className="result">
          <p><strong>{result.message}</strong></p>
          <p>เงินต้นใหม่: {parseFloat(result.newPrincipal).toLocaleString()} บาท</p>
          <p>ค่างวดใหม่ต่อเดือน: {parseFloat(result.newPayment).toLocaleString()} บาท</p>
          {oldTerm !== remainingMonths && (
            <p>📉 จำนวนเดือนเดิม: {oldTerm} เดือน → เหลือ: {remainingMonths} เดือน</p>
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
          <h3>📄 ประวัติการชำระเงิน</h3>
          <table>
            <thead>
              <tr>
                <th>วันที่</th>
                <th>ยอดจ่ายเพิ่ม</th>
                <th>สถานะ</th>
                <th>เงินต้นคงเหลือ</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((txn, index) => (
                <tr key={index}>
                  <td>{txn.date}</td>
                  <td>{txn.amount} บาท</td>
                  <td>{txn.status}</td>
                  <td>{txn.remaining} บาท</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default App;
