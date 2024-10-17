import React, { useState } from 'react';

const FileTableFilters = ({ onFilterChange }) => {
  const [nameFilter, setNameFilter] = useState('');
  const [creatorFilter, setCreatorFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const handleNameChange = (e) => {
    setNameFilter(e.target.value);
    onFilterChange('name', e.target.value);
  };

  const handleCreatorChange = (e) => {
    setCreatorFilter(e.target.value);
    onFilterChange('uploadedBy', e.target.value);
  };

  const handleDateChange = (e) => {
    setDateFilter(e.target.value);
    onFilterChange('uploadedAt', e.target.value);
  };

  return (
    <div className="flex gap-4 mb-4">
      <div>
        <label className="block mb-1">Filtrar por Nombre</label>
        <input
          type="text"
          value={nameFilter}
          onChange={handleNameChange}
          className="border px-2 py-1 rounded w-full"
          placeholder="Nombre"
        />
      </div>
      <div>
        <label className="block mb-1">Filtrar por Creador</label>
        <input
          type="text"
          value={creatorFilter}
          onChange={handleCreatorChange}
          className="border px-2 py-1 rounded w-full"
          placeholder="Creador"
        />
      </div>
      <div>
        <label className="block mb-1">Filtrar por Fecha</label>
        <input
          type="date"
          value={dateFilter}
          onChange={handleDateChange}
          className="border px-2 py-1 rounded w-full"
        />
      </div>
    </div>
  );
};

export default FileTableFilters;
