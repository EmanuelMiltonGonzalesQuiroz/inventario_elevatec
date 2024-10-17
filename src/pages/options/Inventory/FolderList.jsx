import React, { useState, useEffect } from 'react';
import FolderItem from './FolderItem';
import { collection, getDocs, query, where, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../../connection/firebase';

const FolderList = ({ stateFilter }) => {
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);

  // Función para cambiar el estado de todos los archivos en una carpeta a "inactivo"
  const updateFilesToInactive = async (folderName) => {
    try {
      const filesCollectionRef = collection(db, 'files');
      const q = query(filesCollectionRef, where('folder', '==', folderName), where('state', '==', 'activo'));
      const fileSnapshot = await getDocs(q);

      const batchPromises = fileSnapshot.docs.map(fileDoc => {
        const fileRef = doc(db, 'files', fileDoc.id);
        return updateDoc(fileRef, { state: 'inactivo' });
      });

      await Promise.all(batchPromises); // Asegurarse de que todos los archivos estén actualizados a "inactivo"
    } catch (error) {
      console.error('Error al actualizar los archivos a inactivo:', error);
    }
  };

  useEffect(() => {
    const fetchFoldersAndFiles = async () => {
      try {
        // Obtener todas las carpetas
        const foldersCollectionRef = collection(db, 'folders');
        const folderSnapshot = await getDocs(foldersCollectionRef);
        const folderList = folderSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Obtener todos los archivos
        const filesCollectionRef = collection(db, 'files');
        const fileSnapshot = await getDocs(filesCollectionRef);
        const fileList = fileSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Verificar si la carpeta está inactiva y actualizar los archivos de la carpeta
        folderList.forEach(folder => {
          if (folder.state === 'inactivo') {
            updateFilesToInactive(folder.name); // Cambiar los archivos a inactivo si la carpeta es inactiva
          }
        });

        if (stateFilter === 'activo') {
          // Filtrar carpetas y archivos activos
          const activeFolders = folderList.filter(folder => folder.state === 'activo');
          const activeFiles = fileList.filter(file => file.state === 'activo');
          setFolders(activeFolders);
          setFiles(activeFiles);
        } else {
          // Filtrar carpetas inactivas y carpetas activas con archivos inactivos
          const inactiveFolders = folderList.filter(
            folder =>
              folder.state === 'inactivo' ||
              fileList.some(file => file.folder === folder.name && file.state === 'inactivo')
          );
          const inactiveFiles = fileList.filter(file => file.state === 'inactivo');
          setFolders(inactiveFolders);
          setFiles(inactiveFiles);
        }
      } catch (error) {
        console.error('Error al obtener las carpetas y archivos:', error);
      }
    };

    fetchFoldersAndFiles();
  }, [stateFilter]);

  return (
    <ul className="list-disc pl-5">
      {folders.length > 0 ? (
        folders.map(folder => (
          <FolderItem key={folder.id} folder={folder} files={files} stateFilter={stateFilter} />
        ))
      ) : (
        <p>No hay carpetas disponibles</p>
      )}
    </ul>
  );
};

export default FolderList;
