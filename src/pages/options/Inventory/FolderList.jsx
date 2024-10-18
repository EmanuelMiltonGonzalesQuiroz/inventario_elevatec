import React, { useState, useEffect } from 'react';
import FileTable from './FileTable';

const FolderList = ({ folders, files, stateFilter, triggerUpdate }) => {
  const [selectedFolder, setSelectedFolder] = useState(null); // Carpeta seleccionada
  const [filteredFiles, setFilteredFiles] = useState([]); // Archivos filtrados por carpeta

  // Función para manejar la selección de la carpeta
  const handleFolderClick = (folder) => {
    setSelectedFolder(folder); // Establecer carpeta seleccionada
  };

  useEffect(() => {
    if (selectedFolder) {
      // Si estamos en la vista de activos, mostrar solo los archivos activos
      if (stateFilter === 'activo') {
        const activeFiles = files.filter(file => file.folder === selectedFolder.name && file.state === 'activo');
        setFilteredFiles(activeFiles);
      } 
      // Si estamos en la vista de inactivos, mostrar solo los archivos inactivos
      else if (stateFilter === 'inactivo') {
        const inactiveFiles = files.filter(file => file.folder === selectedFolder.name && file.state === 'inactivo');
        setFilteredFiles(inactiveFiles);
      }
    } else {
      setFilteredFiles([]); // Limpiar los archivos si no hay carpeta seleccionada
    }
  }, [selectedFolder, files, stateFilter]);

  // Filtrar carpetas según el estado proporcionado (activo/inactivo)
  const filteredFolders = folders.filter(folder => {
    const hasActiveFiles = files.some(file => file.folder === folder.name && file.state === 'activo');
    const hasInactiveFiles = files.some(file => file.folder === folder.name && file.state === 'inactivo');

    if (stateFilter === 'activo') {
      // Mostrar la carpeta en activos si la carpeta está activa, o si tiene al menos un archivo activo,
      // o si no tiene archivos pero está activa.
      return folder.state === 'activo' && (hasActiveFiles || !files.some(file => file.folder === folder.name));
    } else if (stateFilter === 'inactivo') {
      // Mostrar la carpeta en inactivos si la carpeta está inactiva,
      // o si tiene archivos inactivos (incluso si la carpeta está activa).
      return folder.state === 'inactivo' || hasInactiveFiles;
    }
    return false;
  });

  return (
    <div className="w-full min-h-[70vh] max-h-[80vh] flex bg-gray-200 rounded shadow-md">
      {/* Columna de carpetas */}
      <div className="min-w-[15vw] max-w-[15vw] bg-gray-100 p-4 overflow-auto">
        <h2 className="text-lg font-bold mb-4">Tipos</h2>
        <ul className="list-none">
          {filteredFolders.length > 0 ? (
            filteredFolders.map(folder => (
              <li
                key={folder.id}
                className={`cursor-pointer p-2 border-b border-gray-300 ${selectedFolder?.id === folder.id ? 'bg-gray-300' : ''}`}
                onClick={() => handleFolderClick(folder)}
              >
                {folder.name}
              </li>
            ))
          ) : (
            <p>No hay Tipos disponibles</p>
          )}
        </ul>
      </div>

      {/* Columna de tabla de archivos */}
      <div className="w-full bg-white p-4 overflow-auto">
        {selectedFolder ? (
          <FileTable folder={selectedFolder} files={filteredFiles} triggerUpdate={triggerUpdate} stateFilter={stateFilter}/>
        ) : (
          <div className="text-center text-gray-500">Selecciona un tipo para ver sus archivos</div>
        )}
      </div>
    </div>
  );
};

export default FolderList;
