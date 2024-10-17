import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../connection/firebase';
import FileItem from './FileItem';

const FileList = ({ folderName }) => {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const fetchFiles = async () => {
      const filesCollectionRef = collection(db, 'files');
      const q = query(filesCollectionRef, where('folder', '==', folderName));
      try {
        const querySnapshot = await getDocs(q);
        const fileList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setFiles(fileList);
      } catch (error) {
        console.error('Error al obtener los archivos de la carpeta:', error);
      }
    };
    fetchFiles();
  }, [folderName]);

  return (
    <ul className="pl-5 gap-4">
      {files.map(file => (
        <FileItem key={file.id} file={file} />
      ))}
    </ul>
  );
};

export default FileList;
