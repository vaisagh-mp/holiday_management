import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [country, setCountry] = useState('US');
  const [year, setYear] = useState(new Date().getFullYear());

  const handleSubmit = (e) => {
    e.preventDefault();
    // Navigate to the Holiday List page with query parameters
    navigate(`/holidays?country=${country}&year=${year}`);
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-xl font-bold mb-4">Search Holidays</h2>
        <div className="mb-4">
          <label className="block mb-1">Country</label>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full border border-gray-300 rounded p-2"
          >
            <option value="US">United States</option>
            <option value="CA">Canada</option>
            <option value="GB">United Kingdom</option>
            <option value="AU">Australia</option>
            <option value="IN">India</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-1">Year</label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="w-full border border-gray-300 rounded p-2"
          />
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
          Search
        </button>
      </form>
    </div>
  );
};

export default Home;
