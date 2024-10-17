import React from 'react';
import FileItem from './FileItem';

const FileList = ({ folderName, files, triggerUpdate }) => {
  // Filtrar los archivos según la carpeta seleccionada
  const filteredFiles = files.filter(file => file.folder === folderName);

  return (
    <ul className="pl-5 gap-4">
      {filteredFiles.map(file => (
        <FileItem key={file.id} file={file} triggerUpdate={triggerUpdate} />
      ))}
    </ul>
  );
};

export default FileList;
