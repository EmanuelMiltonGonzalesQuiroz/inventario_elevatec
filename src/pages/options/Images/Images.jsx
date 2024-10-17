import React, { useState, useEffect } from 'react';
import UploadImage from './UploadImage'; // Componente para subir imágenes
import ImageTable from './ImageTable'; // Componente que contiene la tabla con los datos
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../connection/firebase';
import { useAuth } from '../../../context/AuthContext';

const Images = () => {
  const { currentUser } = useAuth();
  const [images, setImages] = useState([]); // Estado para todas las imágenes
  const [viewActive, setViewActive] = useState(true);
  const [updateSignal, setUpdateSignal] = useState(false); // Estado para controlar la actualización
  const canCreateFolders = currentUser && (currentUser.role === 'Gerencia' || currentUser.role === 'Administrador');

  // Función para actualizar la lista
  const triggerUpdate = () => {
    setUpdateSignal(prevSignal => !prevSignal);
  };

  // Cargar las imágenes desde la base de datos
  const loadDataFromDB = async () => {
    try {
      const imagesCollectionRef = collection(db, 'images');
      const imageSnapshot = await getDocs(imagesCollectionRef);
      const imageList = imageSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setImages(imageList);
    } catch (error) {
      console.error('Error al cargar imágenes:', error);
    }
  };
 
  useEffect(() => {
    loadDataFromDB();
  }, [updateSignal]); // Recargar las imágenes cuando se actualice `updateSignal`

  return (
    <div className="p-6 bg-white shadow-md rounded text-black min-h-[85vh] max-h-[130vh]">
        {canCreateFolders && (
            <div className="grid mb-4 gap-4">
                <UploadImage triggerUpdate={triggerUpdate} /> 
                <div className="flex gap-x-4 mb-4">
                <button
                    onClick={() => setViewActive(true)}
                    className={`px-4 py-2 rounded ${viewActive ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
                >
                    Imagenes Activos
                </button>
                <button
                    onClick={() => setViewActive(false)}
                    className={`px-4 py-2 rounded ${!viewActive ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
                >
                    Imagenes Inactivos
                </button>
                </div>
            </div>
      )}
      {viewActive || !canCreateFolders ? (
        <ImageTable images={images} triggerUpdate={triggerUpdate} stateFilter="activo"/>
      ) : (
        <ImageTable images={images} triggerUpdate={triggerUpdate} stateFilter="inactivo"/> 

      )}
    </div>
  );
};

export default Images;
