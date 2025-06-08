const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

function calcMonthlyPayment(P, r, n) {
  if (r === 0) return P / n;
  return (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

app.post('/api/calculate', (req, res) => {
  const { principal, rate, term, monthly, payment, income, oldTerm } = req.body;

  const principalNum = parseFloat(principal);
  const rateNum = parseFloat(rate) / 100 / 12; // monthly rate
  const termNum = parseInt(term);
  const monthlyNum = parseFloat(monthly);
  const paymentNum = parseFloat(payment);

  const newPrincipal = Math.max(principalNum - paymentNum, 0);

  // คำนวณค่างวดใหม่ด้วยฟังก์ชัน amortization formula
  const newMonthly = calcMonthlyPayment(newPrincipal, rateNum, termNum);

  // Estimate new loan term based on same monthly payment
  const newTermEstimate = rateNum > 0
    ? Math.log(monthlyNum / (monthlyNum - rateNum * newPrincipal)) / Math.log(1 + rateNum)
    : newPrincipal / monthlyNum;

  const newTerm = Math.ceil(newTermEstimate);

  const tip = 'การจ่ายเพิ่มช่วยลดดอกเบี้ยรวมและปิดหนี้ได้เร็วขึ้น';
  const suggestion = 'หากมีรายได้เพิ่มเติม ลองจ่ายเพิ่มในเดือนถัดไป';

  res.json({
    message: '✅ การชำระเงินสำเร็จ',
    newPrincipal: newPrincipal.toFixed(2),
    newPayment: newMonthly.toFixed(2),
    newTerm,
    status: 'สำเร็จ',
    remaining: newPrincipal.toLocaleString(),
    tip,
    suggestion
  });
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`📡 Backend running at http://localhost:${PORT}`);
});
