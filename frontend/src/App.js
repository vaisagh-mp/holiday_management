import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import HolidayList from './components/HolidayList';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/holidays" element={<HolidayList />} />
      </Routes>
    </div>
  );
}

export default App;
