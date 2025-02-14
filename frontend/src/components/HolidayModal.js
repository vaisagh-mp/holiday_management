import React from 'react';
import '../styles/HolidayModal.css'

const HolidayModal = ({ holiday, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>
      {/* Modal Content */}
      <div className="bg-white p-6 rounded shadow-lg z-10 max-w-lg w-full">
        <h2 className="text-2xl font-bold mb-4">{holiday.name}</h2>
        <p className="mb-2">
          <strong>Date:</strong> {holiday.date ? holiday.date.iso : 'N/A'}
        </p>
        {holiday.description && (
          <p className="mb-2">
            <strong>Description:</strong> {holiday.description}
          </p>
        )}
        {holiday.type && (
          <p className="mb-2">
            <strong>Type:</strong>{' '}
            {Array.isArray(holiday.type) ? holiday.type.join(', ') : holiday.type}
          </p>
        )}
        {holiday.locations && (
          <p className="mb-2">
            <strong>Locations:</strong> {holiday.locations}
          </p>
        )}
        <button onClick={onClose} className="mt-4 bg-blue-500 text-white p-2 rounded">
          Close
        </button>
      </div>
    </div>
  );
};

export default HolidayModal;
