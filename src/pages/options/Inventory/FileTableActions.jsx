import React from 'react';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../connection/firebase';
import { getStorage, ref, deleteObject } from 'firebase/storage';
import { useAuth } from '../../../context/AuthContext';

const FileTableActions = ({ file, folder, triggerUpdate }) => {
  const { currentUser } = useAuth();
  const storage = getStorage();

  // Función para eliminar el archivo (ponerlo inactivo)
  const handleDelete = async () => {
    try {
      const fileRef = doc(db, 'files', file.id);
      await updateDoc(fileRef, { state: 'inactivo' });
      triggerUpdate(); // Actualizar la lista
    } catch (error) {
      console.error('Error al marcar archivo como inactivo:', error);
    }
  };

  // Función para eliminar definitivamente el archivo
  const handlePermanentDelete = async () => {
    try {
      const fileRef = doc(db, 'files', file.id);
      await deleteDoc(fileRef);

      const fileStorageRef = ref(storage, `${file.folder}/${file.name}`);
      await deleteObject(fileStorageRef);

      triggerUpdate(); // Actualizar la lista
    } catch (error) {
      console.error('Error al eliminar archivo permanentemente:', error);
    }
  };

  // Función para recuperar el archivo
  const handleRecoverFile = async () => {
    try {
      const fileRef = doc(db, 'files', file.id);
      await updateDoc(fileRef, { state: 'activo' });
      triggerUpdate(); // Actualizar la lista
    } catch (error) {
      console.error('Error al recuperar el archivo:', error);
    }
  };

  return (
    <div>
      {currentUser.role === 'Administrador' || currentUser.role === 'Gerencia' ? (
        <div className="mt-2 flex flex-col space-y-2">
          {file.state === 'activo' ? (
            <button
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded w-full"
            >
              Eliminar
            </button>
          ) : (
            <>
              <button
                onClick={handleRecoverFile}
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded w-full"
              >
                Recuperar
              </button>
              <button
                onClick={handlePermanentDelete}
                className="bg-red-700 hover:bg-red-800 text-white font-bold py-2 px-4 rounded w-full"
              >
                Eliminar Definitivamente
              </button>
            </>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default FileTableActions;
