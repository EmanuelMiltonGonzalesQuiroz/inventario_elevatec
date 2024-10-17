import React from 'react';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../connection/firebase';
import { getStorage, ref, deleteObject } from 'firebase/storage';
import { useAuth } from '../../../context/AuthContext';

const ImageTableActions = ({ image, triggerUpdate }) => {
  const { currentUser } = useAuth();
  const storage = getStorage();

  const handleDelete = async () => {
    try {
      const imageRef = doc(db, 'images', image.idImage);
      await updateDoc(imageRef, { state: 'inactivo', eliminadoPor: currentUser });
      triggerUpdate();
    } catch (error) {
      console.error('Error al marcar la imagen como inactiva:', error);
    }
  };

  const handleRecover = async () => {
    try {
      const imageRef = doc(db, 'images', image.idImage);
      await updateDoc(imageRef, { state: 'activo' });
      triggerUpdate();
    } catch (error) {
      console.error('Error al recuperar la imagen:', error);
    }
  };

  const handlePermanentDelete = async () => {
    try {
      const imageRef = doc(db, 'images', image.idImage);
      await deleteDoc(imageRef);

      const fileStorageRef = ref(storage, `Imagenes/${image.name}`);
      await deleteObject(fileStorageRef);

      triggerUpdate();
    } catch (error) {
      console.error('Error al eliminar permanentemente la imagen:', error);
    }
  };

  return (
    <div className="flex flex-col space-y-2 w-full">
      {/* Botón para ver la imagen */}
      <a
        href={image.url}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold w-full py-2 px-3 rounded text-center"
      >
        Ver
      </a>
      
      {image.state === 'activo' ? (
        <button 
          onClick={handleDelete} 
          className="bg-red-500 hover:bg-red-600 text-white font-bold w-full py-2 px-3 rounded"
        >
          Eliminar
        </button>
      ) : (
        <>
          <button 
            onClick={handleRecover} 
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold w-full py-2 px-3 rounded"
          >
            Recuperar
          </button>
          <button 
            onClick={handlePermanentDelete} 
            className="bg-red-700 hover:bg-red-800 text-white font-bold w-full py-2 px-3 rounded"
          >
            Eliminar Definitivamente
          </button>
        </>
      )}
    </div>
  );
};

export default ImageTableActions;
