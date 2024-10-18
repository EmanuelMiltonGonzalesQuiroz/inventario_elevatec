import React, { useState } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db } from '../../../connection/firebase';
import { doc, setDoc, query, orderBy, getDocs, collection } from 'firebase/firestore';
import { useAuth } from '../../../context/AuthContext';
import CustomSelectUsers from '../../../components/UI/CustomSelectUsers'; // Importar el nuevo componente

const UploadFile = ({ triggerUpdate, folders }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState(''); // Estado para el nombre del archivo
  const [selectedFolder, setSelectedFolder] = useState('');
  const [selectedClient, setSelectedClient] = useState(null); // Nuevo estado para el cliente
  const [isUploading, setIsUploading] = useState(false); // Estado para mostrar carga
  const storage = getStorage();
  const { currentUser } = useAuth();

  const handleFileUpload = async () => {
    if (selectedFile && selectedFolder && fileName && selectedClient) {
      setIsUploading(true); // Mostrar spinner de carga

      // Encontrar el folder seleccionado por su ID
      const selectedFolderObj = folders.find(folder => folder.id === selectedFolder);
      const fileRef = ref(storage, `${selectedFolderObj.name}/${selectedFile.name}`); // Usar el nuevo nombre

      try {
        await uploadBytes(fileRef, selectedFile);

        // Obtener la URL de descarga del archivo subido
        const downloadURL = await getDownloadURL(fileRef);

        // Obtener el siguiente ID disponible para el archivo
        const filesCollectionRef = collection(db, 'files');
        const fileQuery = query(filesCollectionRef, orderBy('idFile', 'desc'));
        const fileSnapshot = await getDocs(fileQuery);
        let nextId = 1;

        if (!fileSnapshot.empty) {
          const lastFileDoc = fileSnapshot.docs[0];
          const lastId = lastFileDoc.data().idFile.split('-').pop();
          nextId = parseInt(lastId) + 1;
        }

        // Crear nuevo ID de archivo con el formato ID-FILE-###
        const fileId = `ID-FILE-${nextId.toString().padStart(3, '0')}`;
        const currentDate = new Date().toISOString().split('T')[0];

        // Guardar los datos del archivo en Firestore con el idFolder del folder seleccionado
        await setDoc(doc(db, 'files', fileId), {
          idFile: fileId,
          name: fileName, // Guardar con el nuevo nombre
          folder: selectedFolderObj.name,
          idFolder: selectedFolderObj.id,
          uploadedAt: currentDate,
          uploadedBy: currentUser.id,
          uploadedFor: selectedClient.value, // Guardar el cliente seleccionado
          state: "activo",
          url: downloadURL
        });

        setSelectedFile(null);
        setSelectedFolder(''); // Restablecer la selección de la carpeta
        setFileName(''); // Restablecer el nombre del archivo
        setSelectedClient(null); // Restablecer el cliente seleccionado
        triggerUpdate(); // Señalizar la actualización
      } catch (error) {
        console.error('Error al subir el archivo:', error);
      } finally {
        setIsUploading(false); // Ocultar spinner de carga
      }
    } else {
      alert('Por favor selecciona un archivo, una carpeta, un cliente y proporciona un nombre de archivo.');
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-black mb-4">Subir Archivos</h2>

      {/* Selector de Carpeta */}
      <select
        value={selectedFolder}
        onChange={(e) => setSelectedFolder(e.target.value)}
        className="mb-2 p-2 border border-gray-400 rounded w-full"
      >
        <option value="" disabled>Seleccionar Carpeta</option>
        {folders.map((folder, index) => (
          <option key={index} value={folder.id}>
            {folder.name}
          </option>
        ))}
      </select>

      {/* Input para el nombre del archivo */}
      <input
        type="text"
        placeholder="Nombre del archivo"
        value={fileName}
        onChange={(e) => setFileName(e.target.value)}
        className="mb-2 p-2 border border-gray-400 rounded w-full"
      />

      {/* CustomSelectUsers para seleccionar cliente */}
      <CustomSelectUsers
        placeholder="Seleccionar Cliente"
        onChange={setSelectedClient}
        selectedValue={selectedClient}
        role="Cliente" // Filtrar solo usuarios con rol de "Cliente"
      />

      {/* Input para seleccionar archivo */}
      <input
        type="file"
        onChange={(e) => setSelectedFile(e.target.files[0])}
        className="mb-2 p-2 border border-gray-400 rounded w-full"
      />

      {/* Botón para subir archivo */}
      <button
        onClick={handleFileUpload}
        className="bg-green-500 text-white px-4 py-2 rounded w-full flex justify-center items-center"
        disabled={isUploading} // Deshabilitar durante la subida
      >
        {isUploading ? (
          <div className="loader"></div> // Mostrar el spinner aquí
        ) : (
          'Subir Archivo'
        )}
      </button>

      {/* Estilos para el loader */}
      <style jsx>{`
        .loader {
          border: 4px solid rgba(0, 0, 0, 0.1);
          border-left-color: #ffffff;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default UploadFile;
