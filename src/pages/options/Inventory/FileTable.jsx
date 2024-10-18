import React, { useState, useEffect } from 'react';
import FileTableBody from './FileTableBody';
import FileTableFilters from './FileTableFilters';

const FileTable = ({ folder, files, triggerUpdate, stateFilter }) => {
  const [filteredFiles, setFilteredFiles] = useState(files);

  // Actualizar los archivos filtrados cuando cambien los archivos o la carpeta seleccionada
  useEffect(() => {
    setFilteredFiles(files);
  }, [files]);

  const handleFilterChange = (filterType, filterValue) => {
    const filtered = files.filter(file => {
      const fileValue = file[filterType] ? file[filterType].toString().toLowerCase() : ''; // Asegurarse de que sea una cadena
      return fileValue.includes(filterValue.toLowerCase());
    });
    setFilteredFiles(filtered);
  };

  return (
    <div>
      <h3 className="text-lg font-bold mb-2">Archivos en {folder.name}</h3>

      {/* Filtros */}
      <FileTableFilters onFilterChange={handleFilterChange} />

      {/* Tabla */}
      <FileTableBody files={filteredFiles} folder={folder} triggerUpdate={triggerUpdate} stateFilter={stateFilter} />
    </div>
  );
};

export default FileTable;
