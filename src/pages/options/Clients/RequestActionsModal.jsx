import React, { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../connection/firebase';

const RequestActionsModal = ({ request, onClose }) => {
  const [editedRequest, setEditedRequest] = useState({ ...request });
  const [editedColumns, setEditedColumns] = useState([...request.columns]);

  // Función para manejar los cambios en los campos de la solicitud
  const handleFieldChange = (field, value) => {
    setEditedRequest((prev) => ({ ...prev, [field]: value }));
  };

  // Función para manejar los cambios en las columnas
  const handleColumnChange = (index, field, value) => {
    const updatedColumns = [...editedColumns];
    updatedColumns[index][field] = value;
    setEditedColumns(updatedColumns);
  };

  // Función para guardar los cambios
  const handleSaveChanges = async () => {
    const requestRef = doc(db, 'requests', request.id);
    await updateDoc(requestRef, {
      ...editedRequest,
      columns: editedColumns,
    });
    onClose(); // Cerrar el modal después de guardar los cambios
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center text-black">
      <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
        <h2 className="text-xl font-bold mb-4">Editar Solicitud</h2>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700 transition"
        >
          Cerrar
        </button>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label>Edificio:</label>
            <input
              type="text"
              value={editedRequest.buildingName}
              onChange={(e) => handleFieldChange('buildingName', e.target.value)}
              className="border rounded p-2 w-full"
            />
          </div>

          <div>
            <label>Aprobado Por:</label>
            <input
              type="text"
              value={editedRequest.approvedBy}
              onChange={(e) => handleFieldChange('approvedBy', e.target.value)}
              className="border rounded p-2 w-full"
            />
          </div>

          <div>
            <label>Prioridad:</label>
            <select
              value={editedRequest.priority}
              onChange={(e) => handleFieldChange('priority', e.target.value)}
              className="border rounded p-2 w-full"
            >
              <option value="normal">Normal</option>
              <option value="urgent">Urgente</option>
              <option value="very_urgent">Muy Urgente</option>
            </select>
          </div>

          <div>
            <label>Estado:</label>
            <select
              value={editedRequest.status}
              onChange={(e) => handleFieldChange('status', e.target.value)}
              className="border rounded p-2 w-full"
            >
              <option value="Terminada">Terminada</option>
              <option value="En proceso">En proceso</option>
            </select>
          </div>
        </div>

        <h3 className="text-lg font-bold mt-4">Editar Columnas</h3>
        {editedColumns.map((col, index) => (
          <div key={index} className="grid grid-cols-2 gap-4 mt-2">
            <input
              type="text"
              value={col.columnName}
              onChange={(e) => handleColumnChange(index, 'columnName', e.target.value)}
              className="border rounded p-2"
            />
            <input
              type="text"
              value={col.value}
              onChange={(e) => handleColumnChange(index, 'value', e.target.value)}
              className="border rounded p-2"
            />
          </div>
        ))}

        <button
          onClick={handleSaveChanges}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 transition mt-4"
        >
          Guardar Cambios
        </button>
      </div>
    </div>
  );
};

export default RequestActionsModal;
