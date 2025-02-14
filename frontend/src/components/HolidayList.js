import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import HolidayModal from './HolidayModal';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const HolidayList = () => {
  const query = useQuery();
  const country = query.get('country');
  const year = query.get('year');

  const [holidays, setHolidays] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedHoliday, setSelectedHoliday] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchHolidays = async (search = '') => {
    setLoading(true);
    setError(null);
    try {
      let response;
      if (search) {
        response = await axios.get(`http://localhost:8000/api/holidays/search/`, {
          params: {
            name: search,
            country: country,
            year: year,
          },
        });
        // API returns data as { response: { holidays: [...] } }
        setHolidays(response.data.response.holidays);
      } else {
        response = await axios.get(`http://localhost:8000/api/holidays/`, {
          params: {
            country: country,
            year: year,
          },
        });
        setHolidays(response.data.response.holidays);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch holidays.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHolidays();
  }, [country, year]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchHolidays(searchTerm);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        Holidays for {country} in {year}
      </h1>
      <form onSubmit={handleSearch} className="mb-4">
        <input
          type="text"
          placeholder="Search by holiday name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 p-2 rounded w-64"
        />
        <button type="submit" className="ml-2 bg-blue-500 text-white p-2 rounded">
          Search
        </button>
      </form>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : holidays.length === 0 ? (
        <p>No holidays found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {holidays.map((holiday, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded shadow cursor-pointer hover:shadow-lg"
              onClick={() => setSelectedHoliday(holiday)}
            >
              <h2 className="text-xl font-semibold">{holiday.name}</h2>
              <p>{holiday.date.iso}</p>
            </div>
          ))}
        </div>
      )}
      {selectedHoliday && (
        <HolidayModal holiday={selectedHoliday} onClose={() => setSelectedHoliday(null)} />
      )}
    </div>
  );
};

export default HolidayList;
