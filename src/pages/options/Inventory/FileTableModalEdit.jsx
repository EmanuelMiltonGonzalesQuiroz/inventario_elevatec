import React, { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db } from '../../../connection/firebase';

const FileTableModalEdit = ({ file, folder, onClose, triggerUpdate }) => {
  const [newFileName, setNewFileName] = useState(file.name);
  const [newFileDate, setNewFileDate] = useState(file.uploadedAt);
  const [selectedNewFile, setSelectedNewFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false); // Estado para mostrar la animación de guardar
  const storage = getStorage();

  // Función para guardar los cambios
  const handleSaveChanges = async () => {
    setIsSaving(true); // Iniciar la animación de guardar
    try {
      const fileRef = doc(db, 'files', file.id); // Referencia a Firestore

      // Obtener referencia al archivo anterior basado en la URL
      const oldFileStorageRef = ref(storage, decodeURIComponent(file.url.split('/o/')[1].split('?alt=media')[0]));

      // Si se selecciona un nuevo archivo
      if (selectedNewFile) {
        try {
          // Intentar eliminar el archivo anterior usando la URL
          await deleteObject(oldFileStorageRef);
          console.log(`El archivo anterior ${file.name} fue eliminado.`);
        } catch (error) {
          if (error.code === 'storage/object-not-found') {
            console.log('El archivo anterior no existe, subiendo nuevo archivo...');
          } else {
            console.error('Error al eliminar archivo antiguo:', error);
          }
        }

        // Subir el nuevo archivo
        const newFileStorageRef = ref(storage, `${file.folder}/${selectedNewFile.name}`);
        await uploadBytes(newFileStorageRef, selectedNewFile);

        // Obtener la URL de descarga del nuevo archivo
        const downloadURL = await getDownloadURL(newFileStorageRef);

        // Actualizar la BD con el nuevo nombre, fecha y URL
        await updateDoc(fileRef, {
          name: newFileName, // Cambiamos el nombre al del nuevo archivo
          uploadedAt: newFileDate,
          url: downloadURL, // Nueva URL
        });
      } else {
        // Si no se selecciona un nuevo archivo, solo actualizar nombre y fecha
        await updateDoc(fileRef, {
          name: newFileName,
          uploadedAt: newFileDate,
        });
      }

      triggerUpdate(); // Actualizar la tabla
      onClose(); // Cerrar el modal
    } catch (error) {
      console.error('Error al guardar cambios:', error);
    } finally {
      setIsSaving(false); // Detener la animación de guardar
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center p-4 md:p-0">
      <div className="grid bg-white p-6 rounded-lg shadow-lg max-w-md w-full md:w-[90vw] overflow-auto">
        <h2 className="text-xl font-bold mb-4">Editar Archivo</h2>

        {/* Campos para editar nombre, fecha y archivo */}
        <input
          type="text"
          value={newFileName}
          onChange={(e) => setNewFileName(e.target.value)}
          className="border px-2 py-1 rounded mb-2 w-full"
          placeholder="Nuevo nombre"
        />
        <input
          type="date"
          value={newFileDate}
          onChange={(e) => setNewFileDate(e.target.value)}
          className="border px-2 py-1 rounded mb-2 w-full"
          placeholder="Nueva fecha"
        />
        <input
          type="file"
          onChange={(e) => setSelectedNewFile(e.target.files[0])}
          className="border px-2 py-1 rounded mb-4 w-full"
          accept="*"
        />

        {/* Botones de acción */}
        <div className="flex justify-end space-x-2">
          <button
            onClick={handleSaveChanges}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded flex items-center justify-center"
            disabled={isSaving}
          >
            {isSaving ? (
              <div className="loader"></div> // Mostrar el spinner aquí
            ) : (
              'Guardar'
            )}
          </button>
          <button
            onClick={onClose}
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
            disabled={isSaving}
          >
            Cancelar
          </button>
        </div>
      </div>

      {/* Estilos para el spinner */}
      <style jsx>{`
        .loader {
          border: 4px solid rgba(0, 0, 0, 0.1);
          border-left-color: #ffffff;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default FileTableModalEdit;
