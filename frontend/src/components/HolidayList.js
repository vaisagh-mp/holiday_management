import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import HolidayModal from './HolidayModal';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../styles/HolidayList.css'


function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const ITEMS_PER_PAGE = 10;

const HolidayList = () => {
  const query = useQuery();
  const country = query.get('country');
  const year = query.get('year');

  // Set default start/end dates based on the provided year (or use today)
  const defaultStartDate = year ? new Date(parseInt(year), 0, 1) : new Date();
  const defaultEndDate = year ? new Date(parseInt(year), 11, 31) : new Date();

  // States for data, filters, and pagination
  const [allHolidays, setAllHolidays] = useState([]);
  const [filteredHolidays, setFilteredHolidays] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultEndDate);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedHoliday, setSelectedHoliday] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch holidays from the backend API
  useEffect(() => {
    async function fetchHolidays() {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get('http://localhost:8000/api/holidays/', {
          params: { country, year },
        });
        const holidays = response.data.response.holidays;
        setAllHolidays(holidays);
        setFilteredHolidays(holidays);
        setCurrentPage(1);
      } catch (err) {
        console.error(err);
        setError('Error fetching holidays.');
      }
      setLoading(false);
    }
    fetchHolidays();
  }, [country, year]);

  // Apply filters whenever one of the filter values changes
  useEffect(() => {
    let filtered = [...allHolidays];

    // Filter by holiday name
    if (searchTerm.trim() !== '') {
      filtered = filtered.filter((holiday) =>
        holiday.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by holiday type if not "All"
    if (typeFilter !== 'All') {
      filtered = filtered.filter((holiday) => {
        const holidayType = holiday.type;
        if (Array.isArray(holidayType)) {
          return holidayType.some((t) =>
            t.toLowerCase().includes(typeFilter.toLowerCase())
          );
        } else if (typeof holidayType === 'string') {
          return holidayType.toLowerCase().includes(typeFilter.toLowerCase());
        }
        return false;
      });
    }

    // Filter by date range (if both start and end dates are set)
    if (startDate && endDate) {
      filtered = filtered.filter((holiday) => {
        const holidayDate = new Date(holiday.date.iso);
        return holidayDate >= startDate && holidayDate <= endDate;
      });
    }

    setFilteredHolidays(filtered);
    setCurrentPage(1);
  }, [searchTerm, typeFilter, startDate, endDate, allHolidays]);

  // Pagination logic
  const totalPages = Math.ceil(filteredHolidays.length / ITEMS_PER_PAGE);
  const paginatedHolidays = filteredHolidays.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        Holidays for {country} in {year}
      </h1>
      {/* Filters Section */}
      <div className="mb-4 flex flex-wrap items-center gap-4">
        <input
          type="text"
          placeholder="Search by holiday name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded"
        />
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="All">All</option>
          <option value="National">National</option>
          <option value="Religious">Religious</option>
          <option value="Observance">Observance</option>
        </select>
        <div className="flex flex-col">
          <label className="mb-1">Start Date:</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            dateFormat="yyyy-MM-dd"
            className="border p-2 rounded"
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-1">End Date:</label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            dateFormat="yyyy-MM-dd"
            className="border p-2 rounded"
          />
        </div>
      </div>
      {/* Holiday List Section */}
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : filteredHolidays.length === 0 ? (
        <p>No holidays found.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedHolidays.map((holiday, index) => (
              <div
                key={index}
                onClick={() => setSelectedHoliday(holiday)}
                className="bg-white p-4 rounded shadow hover:shadow-lg cursor-pointer"
              >
                <h2 className="text-xl font-semibold">{holiday.name}</h2>
                <p>{holiday.date.iso}</p>
              </div>
            ))}
          </div>
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-4 flex justify-center items-center space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded ${
                    page === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-300'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
      {/* Holiday Detail Modal */}
      {selectedHoliday && (
        <HolidayModal
          holiday={selectedHoliday}
          onClose={() => setSelectedHoliday(null)}
        />
      )}
    </div>
  );
};

export default HolidayList;
