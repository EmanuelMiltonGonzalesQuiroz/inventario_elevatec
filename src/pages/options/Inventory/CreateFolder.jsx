import React from 'react';
import { getStorage, ref, uploadBytes } from 'firebase/storage';
import { db } from '../../../connection/firebase'; 
import { doc, setDoc, collection, getDocs, query, orderBy } from 'firebase/firestore';
import { useAuth } from '../../../context/AuthContext'; 

const CreateFolder = ({ newFolderName, setNewFolderName, triggerUpdate }) => {
  const storage = getStorage();
  const { currentUser } = useAuth();

  const handleCreateFolder = async () => {
    if (!newFolderName || newFolderName.trim() === '') {
      alert('Error: El nombre de la carpeta no puede estar vacío.');
      return;
    }

    const normalizedFolderName = newFolderName.trim().toLowerCase();

    // Verificar si el usuario tiene el campo 'id'
    if (!currentUser || !currentUser.id) {
      alert('Error: No se pudo autenticar al usuario. Inicia sesión nuevamente.');
      return;
    }

    try {
      // Comprobar si ya existe una carpeta con el mismo nombre
      const foldersCollectionRef = collection(db, 'folders');
      const existingFoldersSnapshot = await getDocs(foldersCollectionRef);
      const existingFolders = existingFoldersSnapshot.docs.map(doc => doc.data().name.toLowerCase());

      if (existingFolders.includes(normalizedFolderName)) {
        alert('Error: Ya existe una carpeta con ese nombre.');
        return;
      }

      const folderPath = `${normalizedFolderName}/.keep`; // Añadir .keep al final para simular la carpeta
      const folderRef = ref(storage, folderPath);
      const currentDate = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD

      // Crear archivo .keep en Firebase Storage para simular una carpeta
      await uploadBytes(folderRef, new Blob([''], { type: 'text/plain' })); // Subir archivo vacío .keep

      // Obtener el siguiente ID disponible para la carpeta
      const folderQuery = query(foldersCollectionRef, orderBy('idFolder', 'desc')); // Ordenar por 'idFolder'
      const folderSnapshot = await getDocs(folderQuery);
      let nextId = 1;

      if (!folderSnapshot.empty) {
        const lastFolderDoc = folderSnapshot.docs[0];
        const lastId = lastFolderDoc.data().idFolder.split('-').pop(); // Extraer el número final del ID
        nextId = parseInt(lastId) + 1;
      }

      // Crear nuevo ID de carpeta con el formato ID-FOLDER-###
      const idFolder = `ID-FOLDER-${nextId.toString().padStart(3, '0')}`;

      // Crear documento en Firestore
      const folderData = {
        idFolder: idFolder, // Generar el nuevo ID secuencial
        name: newFolderName.trim(),
        createdAt: currentDate,
        createdBy: currentUser.id, // Cambiado de uid a id
        state: "activo"
      };

      await setDoc(doc(db, 'folders', idFolder), folderData);

      setNewFolderName('');
      triggerUpdate(); // Señalizamos la actualización
    } catch (error) {
      console.error('Error al crear la carpeta:', error);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-black mb-4">Crear Nueva Carpeta</h2>
      <input
        type="text"
        value={newFolderName}
        onChange={(e) => setNewFolderName(e.target.value)}
        placeholder="Nombre de la carpeta"
        className="mb-2 p-2 border border-gray-400 rounded w-full"
      />
      <button
        onClick={handleCreateFolder}
        className="bg-blue-500 text-white px-4 py-2 rounded w-full"
        disabled={!newFolderName || !currentUser} // Deshabilitar si no hay nombre o usuario
      >
        Crear Carpeta
      </button>
    </div>
  );
};

export default CreateFolder;
