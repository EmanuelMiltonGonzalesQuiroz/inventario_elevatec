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
  const [viewActive, setViewActive] = useState(true);
  const [updateSignal, setUpdateSignal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const canCreateFolders = currentUser && (currentUser.role === 'Gerencia' || currentUser.role === 'Administrador');

  // Función para actualizar la señal y recargar los datos
  const triggerUpdate = () => {
    setUpdateSignal(prevSignal => !prevSignal);
  };

  // Función para cargar Tipos y archivos desde Firestore
  const loadDataFromDB = async () => {
    try {
      // Obtener Tipos
      const foldersCollectionRef = collection(db, 'folders');
      const folderSnapshot = await getDocs(foldersCollectionRef);
      const folderList = folderSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Obtener archivos
      const filesCollectionRef = collection(db, 'files');
      const fileSnapshot = await getDocs(filesCollectionRef);
      const fileList = fileSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setFolders(folderList);
      setFiles(fileList);
    } catch (error) {
      console.error('Error al cargar Tipos y archivos:', error);
    }
  };

  // Cargar los datos iniciales y recargarlos cuando `updateSignal` cambie
  useEffect(() => {
    loadDataFromDB();
  }, [updateSignal]);

  return (
    <div className="p-6 bg-white shadow-md p-4 rounded text-black min-h-[85vh] max-h-[130vh]">
      {(canCreateFolders || currentUser.role==="Super Usuario") && (
        <div className="flex mb-4 gap-x-4">
          <CreateFolder 
            newFolderName={newFolderName} 
            setNewFolderName={setNewFolderName} 
            triggerUpdate={triggerUpdate} 
          />
          <UploadFile folders={folders.filter(folder => folder.state === 'activo')} triggerUpdate={triggerUpdate} />
        </div>
      )}

      {canCreateFolders && (
        <div className="flex gap-x-4 mb-4">
          <button
            onClick={() => setViewActive(true)}
            className={`px-4 py-2 rounded ${viewActive ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
          >
            Documentos 
          </button>
          <button
            onClick={() => setViewActive(false)}
            className={`px-4 py-2 rounded ${!viewActive ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
          >
            Documentos eliminados
          </button>
        </div>
      )}

      {/* Mostrar lista de Tipos */}
      {viewActive || !canCreateFolders ? (
        <FolderList folders={folders} files={files} stateFilter="activo" triggerUpdate={triggerUpdate} />
      ) : (
        <FolderList folders={folders} files={files} stateFilter="inactivo" triggerUpdate={triggerUpdate} />
      )}
    </div>
  );
};

export default Inventory;
