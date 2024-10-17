import React from 'react';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../connection/firebase';
import { getStorage, ref, deleteObject } from 'firebase/storage';
import { useAuth } from '../../../context/AuthContext';

const FileItem = ({ file, triggerUpdate }) => {
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
      // Eliminar de Firestore
      const fileRef = doc(db, 'files', file.id);
      await deleteDoc(fileRef);

      // Eliminar del Storage
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
    <li className="text-md text-gray-700 flex justify-between items-center mb-4">
      <span>{file.name}</span>
      <div>
        <a
          href={file.url}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-blue-500 text-white px-2 py-1 rounded mr-4"
        >
          Ver Archivo
        </a>
        {currentUser.role === 'Gerencia' || currentUser.role === 'Administrador' ? (
          <>
            {file.state === 'activo' ? (
              <button onClick={handleDelete} className="bg-red-500 text-white px-2 py-1 rounded mr-4">
                Eliminar
              </button>
            ) : (
              <>
                <button onClick={handleRecoverFile} className="bg-yellow-500 text-white px-2 py-1 rounded mr-4">
                  Recuperar
                </button>
                <button onClick={handlePermanentDelete} className="bg-red-500 text-white px-2 py-1 rounded">
                  Eliminar Definitivamente
                </button>
              </>
            )}
          </>
        ) : null}
      </div>
    </li>
  );
};

export default FileItem;
