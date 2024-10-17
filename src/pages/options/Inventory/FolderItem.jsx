import React, { useState } from 'react';
import FileItem from './FileItem'; // Componente de los archivos
import { FaChevronRight, FaChevronDown } from 'react-icons/fa';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { getStorage, ref, deleteObject, listAll } from 'firebase/storage'; // Para listar y eliminar objetos en Firebase Storage
import { useAuth } from '../../../context/AuthContext';
import { db } from '../../../connection/firebase';

const FolderItem = ({ folder, files, stateFilter, triggerUpdate }) => {
  const { currentUser } = useAuth(); // Obtener el usuario actual
  const [isOpen, setIsOpen] = useState(false);
  const storage = getStorage();

  // Filtrar los archivos según la carpeta y el estado del archivo
  const filteredFiles = files.filter(file => file.folder === folder.name && file.state === stateFilter);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  // Función para cambiar el estado de la carpeta y sus archivos a "inactivo"
  const handleDeleteFolder = async () => {
    try {
      const folderRef = doc(db, 'folders', folder.id);
      await updateDoc(folderRef, { state: 'inactivo' });

      // Cambiar el estado de los archivos a "inactivo"
      const folderFiles = files.filter(file => file.folder === folder.name);
      folderFiles.forEach(async file => {
        const fileRef = doc(db, 'files', file.id);
        await updateDoc(fileRef, { state: 'inactivo' });
      });

      triggerUpdate();
    } catch (error) {
      console.error('Error al cambiar el estado de la carpeta y archivos:', error);
    }
  };

  // Función para eliminar completamente la carpeta y sus archivos de Firestore y Storage
  const handlePermanentDeleteFolder = async () => {
    try {
      const folderStorageRef = ref(storage, `${folder.name}/`); // Referencia a la carpeta en Storage

      // Obtener todos los archivos dentro de la carpeta
      const folderContents = await listAll(folderStorageRef);

      // Eliminar los archivos dentro de la carpeta de Firebase Storage
      const deleteFilePromises = folderContents.items.map(async (itemRef) => {
        await deleteObject(itemRef);
      });

      await Promise.all(deleteFilePromises);

      // Eliminar los archivos de Firestore
      const folderFiles = files.filter(file => file.folder === folder.name);
      folderFiles.forEach(async file => {
        const fileRef = doc(db, 'files', file.id);
        await deleteDoc(fileRef);
      });

      // Eliminar la carpeta de Firestore
      const folderRef = doc(db, 'folders', folder.id);
      await deleteDoc(folderRef);

      triggerUpdate();
    } catch (error) {
      console.error('Error al eliminar completamente la carpeta y archivos:', error);
    }
  };

  // Función para recuperar la carpeta y sus archivos
  const handleRecoverFolder = async () => {
    try {
      // Recuperar la carpeta en Firestore
      const folderRef = doc(db, 'folders', folder.id);
      await updateDoc(folderRef, { state: 'activo' });

      // Recuperar todos los archivos asociados a la carpeta
      const folderFiles = files.filter(file => file.folder === folder.name);
      folderFiles.forEach(async file => {
        const fileRef = doc(db, 'files', file.id);
        await updateDoc(fileRef, { state: 'activo' });
      });

      triggerUpdate(); // Actualizar la lista
    } catch (error) {
      console.error('Error al recuperar la carpeta y archivos:', error);
    }
  };

  return (
    <li className="text-lg text-black cursor-pointer mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center" onClick={toggleOpen}>
          {isOpen ? <FaChevronDown className="mr-2" /> : <FaChevronRight className="mr-2" />}
          <span>{folder.name}</span>
        </div>
        {currentUser.role === 'Gerencia' || currentUser.role === 'Administrador' ? (
          <div>
            {folder.state === 'activo' ? (
              <button onClick={handleDeleteFolder} className="bg-red-500 text-white px-2 py-1 rounded mr-2">
                Eliminar
              </button>
            ) : (
              <>
                <button onClick={handleRecoverFolder} className="bg-yellow-500 text-white px-2 py-1 rounded mr-2">
                  Recuperar
                </button>
                <button onClick={handlePermanentDeleteFolder} className="bg-red-700 text-white px-2 py-1 rounded">
                  Eliminar Completamente
                </button>
              </>
            )}
          </div>
        ) : null}
      </div>
      {isOpen && filteredFiles.length > 0 && (
        <ul className="pl-8 mt-2">
          {filteredFiles.map(file => (
            <FileItem key={file.id} file={file} triggerUpdate={triggerUpdate} />
          ))}
        </ul>
      )}
    </li>
  );
};

export default FolderItem;
