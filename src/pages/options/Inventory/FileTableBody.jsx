import React, { useEffect, useState } from 'react';
import FileTableActions from './FileTableActions'; // Importar el componente de acciones
import { GetDocumentFields } from '../../../services/GetDocumentFields';

const FileTableBody = ({ files, folder, triggerUpdate, stateFilter }) => {
  const [usernames, setUsernames] = useState({}); // Estado para almacenar los usernames de los archivos
  const [clientNames, setClientNames] = useState({}); // Estado para almacenar los nombres de los clientes
  const [eliminadoPorUsernames, setEliminadoPorUsernames] = useState({}); // Estado para almacenar los usernames de quienes eliminaron los archivos

  useEffect(() => {
    const fetchData = async () => {
      const newUsernames = {};
      const newClientNames = {};
      const newEliminadoPorUsernames = {};
  
      for (const file of files) {
        try {
          // Cargar el username del creador
          const userData = await GetDocumentFields('users', file.uploadedBy, ['username']);
          newUsernames[file.id] = userData?.username || 'Desconocido';
  
          // Cargar el username del eliminador, si el archivo está inactivo
          if (file.eliminadoPor?.id) {
            const eliminadoPorData = await GetDocumentFields('users', file.eliminadoPor.id, ['username']);
            newEliminadoPorUsernames[file.id] = eliminadoPorData?.username || 'Desconocido';
          }
  
          // Cargar el nombre del cliente si el archivo tiene un cliente asociado
          if (file.uploadedFor) {
            const clientData = await GetDocumentFields('users', file.uploadedFor, ['username']);
            newClientNames[file.id] = clientData?.username || 'Desconocido';
          }
        } catch (error) {
          console.error(`Error al obtener datos para el archivo ${file.id}:`, error);
        }
      }
  
      setUsernames(newUsernames);
      setEliminadoPorUsernames(newEliminadoPorUsernames);
      setClientNames(newClientNames);
    };
  
    fetchData();
  }, [files]);
  

  return (
    <table className="table-auto w-full bg-white shadow-md rounded">
      <thead>
        <tr className="bg-gray-300">
          <th className="px-4 py-2 max-w-[150px]">Nombre de Archivo</th>
          <th className="px-4 py-2 max-w-[150px]">Creado por</th>
          <th className="px-4 py-2 max-w-[150px]">Cliente</th> {/* Nueva columna para Cliente */}
          <th className="px-4 py-2 max-w-[120px]">Fecha de Subida</th>
          {stateFilter === "inactivo" && (
            <th className="px-4 py-2 max-w-[150px]">Eliminado por</th>
          )}
          <th className="px-4 py-2 max-w-[200px]">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {files.length > 0 ? (
          files.map(file => (
            <tr key={file.id}>
              <td className="border px-4 py-2 max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap">{file.name}</td>
              <td className="border px-4 py-2 max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap">
                {usernames[file.id] || 'Cargando...'}
              </td>
              <td className="border px-4 py-2 max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap">
                {clientNames[file.id] || 'Sin Cliente'} {/* Mostrar el nombre del cliente */}
              </td>
              <td className="border px-4 py-2 max-w-[120px] overflow-hidden text-ellipsis whitespace-nowrap">{file.uploadedAt}</td>
              {stateFilter === "inactivo" && (
                <td className="border px-4 py-2 max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap">
                  {eliminadoPorUsernames[file.id] || 'Cargando...'}
                </td>
              )}
              <td className="border px-4 py-2 max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap">
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
            <td colSpan={stateFilter === "inactivo" ? "6" : "5"} className="text-center py-4">
              No hay archivos en esta Tipo
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default FileTableBody;
