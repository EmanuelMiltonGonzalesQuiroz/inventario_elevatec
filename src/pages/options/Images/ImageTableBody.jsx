import React from 'react';
import ImageTableActions from './ImageTableActions'; // Acciones (eliminar, recuperar)

const ImageTableBody = ({ images, triggerUpdate, stateFilter }) => {
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
          <th className="px-4 py-2 max-w-[150px]">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {images.length > 0 ? (
          images.map(image => (
            <tr key={image.idImage}>
              <td className="border px-4 py-2 max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap">{image.name}</td>
              <td className="border px-4 py-2 max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap">{image.description}</td>
              <td className="border px-4 py-2 max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap">{image.uploadedBy}</td>
              <td className="border px-4 py-2 max-w-[100px] overflow-hidden text-ellipsis whitespace-nowrap">{image.uploadedAt}</td>
              {stateFilter === "inactivo" && (
                <td className="border px-4 py-2 max-w-[100px] overflow-hidden text-ellipsis whitespace-nowrap">
                  {image.eliminadoPor?.username || "N/A"}
                </td>
              )}
              <td className="border px-4 py-2 max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap">
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
