// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home.js';
import Step2 from './Step2';
import Step5 from './Step5';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/step2" element={<Step2 />} />
        <Route path="/step5" element={<Step5 />} />
      </Routes>
    </Router>
  );
}

export default App;
