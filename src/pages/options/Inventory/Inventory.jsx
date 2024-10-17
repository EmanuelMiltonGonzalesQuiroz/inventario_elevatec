import React, { useState, useEffect } from 'react';
import FolderList from './FolderList';
import CreateFolder from './CreateFolder';
import UploadFile from './UploadFile';
import { useAuth } from '../../../context/AuthContext'; 
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../connection/firebase';

const Inventory = () => {
  const { currentUser } = useAuth();
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [newFolderName, setNewFolderName] = useState('');
  const [updateSignal, setUpdateSignal] = useState(false);
  const [viewActive, setViewActive] = useState(true); // Estado para alternar entre activas e inactivas

  // Función para obtener y actualizar los datos de Firestore
  const fetchData = async () => {
    try {
      const folderSnapshot = await getDocs(collection(db, 'folders'));
      const fileSnapshot = await getDocs(collection(db, 'files'));

      const folderList = folderSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      const fileList = fileSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setFolders(folderList);
      setFiles(fileList);
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  };

  useEffect(() => {
    fetchData(); // Cargar los datos iniciales
  }, [updateSignal]);

  const triggerUpdate = () => {
    setUpdateSignal(prevSignal => !prevSignal);
  };

  const canCreateFolders = currentUser && (currentUser.role === 'Gerencia' || currentUser.role === 'Administrador');

  return (
    <div className="p-6 bg-white shadow-md p-4 rounded text-black min-h-[85vh] max-h-[90vh]">
      {canCreateFolders && (
        <div className="flex mb-4 gap-x-4">
          <CreateFolder 
            newFolderName={newFolderName} 
            setNewFolderName={setNewFolderName} 
            triggerUpdate={triggerUpdate} 
          />
          <UploadFile 
            folders={folders.filter(folder => folder.state !== 'inactivo')} // Solo carpetas activas
            triggerUpdate={triggerUpdate} 
          />
        </div>
      )}

      {/* Botones para alternar entre vistas solo para administradores y gerencia */}
      {canCreateFolders && (
        <div className="flex gap-x-4 mb-4">
          <button
            onClick={() => setViewActive(true)}
            className={`px-4 py-2 rounded ${viewActive ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
          >
            Carpetas Activas
          </button>
          <button
            onClick={() => setViewActive(false)}
            className={`px-4 py-2 rounded ${!viewActive ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
          >
            Carpetas Inactivas
          </button>
        </div>
      )}

      {/* Mostrar lista según el rol y el botón seleccionado */}
      {viewActive ? (
        <div>
          <h2 className="text-xl font-bold mb-4">Carpetas Activas</h2>
          <FolderList 
            folders={folders.filter(folder => folder.state === 'activo')} 
            files={files.filter(file => file.state === 'activo')} 
            stateFilter="activo" 
            triggerUpdate={triggerUpdate}
          />
        </div>
      ) : canCreateFolders ? (
        <div>
          <h2 className="text-xl font-bold mb-4">Carpetas Inactivas</h2>
          <FolderList 
            folders={folders.filter(folder => folder.state === 'inactivo')} 
            files={files.filter(file => file.state === 'inactivo')} 
            stateFilter="inactivo" 
            triggerUpdate={triggerUpdate}
          />
        </div>
      ) : null /* Si no es admin/gerencia, no mostrar inactivas */}
    </div>
  );
};

export default Inventory;
