import React, { useEffect, useState } from 'react';
import ImageTableActions from './ImageTableActions'; // Acciones (eliminar, recuperar)
import { GetDocumentFields } from '../../../services/GetDocumentFields'; // Asumiendo que tienes este servicio

const ImageTableBody = ({ images, triggerUpdate, stateFilter }) => {
  const [uploadedByUsernames, setUploadedByUsernames] = useState({});
  const [eliminadoPorUsernames, setEliminadoPorUsernames] = useState({});

  useEffect(() => {
    const fetchUsernames = async () => {
      const newUploadedByUsernames = {};
      const newEliminadoPorUsernames = {};

      for (const image of images) {
        // Obtener el username de quien subió la imagen
        const uploadedByData = await GetDocumentFields('users', image.uploadedBy, ['username']);
        newUploadedByUsernames[image.idImage] = uploadedByData?.username || 'Desconocido';

        // Obtener el username de quien eliminó la imagen (si está inactiva)
        if (image.eliminadoPor?.id) {
          const eliminadoPorData = await GetDocumentFields('users', image.eliminadoPor.id, ['username']);
          newEliminadoPorUsernames[image.idImage] = eliminadoPorData?.username || 'Desconocido';
        }
      }
      setUploadedByUsernames(newUploadedByUsernames);
      setEliminadoPorUsernames(newEliminadoPorUsernames);
    };

    fetchUsernames();
  }, [images]);

  return (
    <table className="table-auto w-full bg-white shadow-md rounded">
      <thead>
        <tr className="bg-gray-300">
          <th className="px-4 py-2 max-w-[150px]">Nombre</th> 
          <th className="px-4 py-2 max-w-[200px]">Descripción</th>
          <th className="px-4 py-2 max-w-[150px]">Subido por</th>
          <th className="px-4 py-2 max-w-[100px]">Fecha</th>
          {stateFilter === "inactivo" && (
            <th className="px-4 py-2 max-w-[150px]">Eliminado por</th>
          )}
          <th className="px-4 py-2 max-w-[200px]">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {images.length > 0 ? (
          images.map(image => (
            <tr key={image.idImage}>
              <td className="border px-4 py-2 max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap">{image.name}</td>
              <td className="border px-4 py-2 max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap">{image.description}</td>
              <td className="border px-4 py-2 max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap">
                {uploadedByUsernames[image.idImage] || 'Cargando...'}
              </td>
              <td className="border px-4 py-2 max-w-[100px] overflow-hidden text-ellipsis whitespace-nowrap">{image.uploadedAt}</td>
              {stateFilter === "inactivo" && (
                <td className="border px-4 py-2 max-w-[100px] overflow-hidden text-ellipsis whitespace-nowrap">
                  {eliminadoPorUsernames[image.idImage] || 'Cargando...'}
                </td>
              )}
              <td className="border px-4 py-2 max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap">
                <ImageTableActions image={image} triggerUpdate={triggerUpdate} />
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="5" className="text-center py-4">No hay imágenes disponibles</td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default ImageTableBody;
