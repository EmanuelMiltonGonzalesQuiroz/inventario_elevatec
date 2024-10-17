import React from 'react';
import FileTableActions from './FileTableActions'; // Importar el componente de acciones

const FileTableBody = ({ files, folder, triggerUpdate }) => {
  return (
    <table className="table-auto w-full bg-white shadow-md rounded">
      <thead>
        <tr className="bg-gray-300">
          <th className="px-4 py-2">Nombre de Archivo</th>
          <th className="px-4 py-2">Creado por</th>
          <th className="px-4 py-2">Fecha de Subida</th>
          <th className="px-4 py-2">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {files.length > 0 ? (
          files.map(file => (
            <tr key={file.id}>
              <td className="border px-4 py-2">{file.name}</td>
              <td className="border px-4 py-2">{file.uploadedBy}</td>
              <td className="border px-4 py-2">{file.uploadedAt}</td>
              <td className="border px-4 py-2">
              <a
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold w-full py-2 px-4 rounded inline-block text-center"
                >
                Ver
                </a>


                {/* Aquí llamamos al componente FileTableActions para manejar las acciones */}
                <FileTableActions file={file} folder={folder} triggerUpdate={triggerUpdate} />
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="4" className="text-center py-4">
              No hay archivos en esta carpeta
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default FileTableBody;
