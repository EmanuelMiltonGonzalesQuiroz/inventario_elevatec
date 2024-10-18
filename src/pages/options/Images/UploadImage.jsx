import React, { useState } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db } from '../../../connection/firebase';
import { doc, setDoc, query, orderBy, getDocs, collection } from 'firebase/firestore';
import { useAuth } from '../../../context/AuthContext';

const UploadImage = ({ triggerUpdate }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageName, setImageName] = useState('');
  const [imageDescription, setImageDescription] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState(''); // Estado para el nombre del archivo subido
  const [isUploading, setIsUploading] = useState(false);
  const storage = getStorage();
  const { currentUser } = useAuth();

  const handleImageUpload = async () => {
    const trimmedName = imageName.trim();
    const trimmedDescription = imageDescription.trim();

    if (selectedImage && trimmedName && trimmedDescription) {
      setIsUploading(true);

      const imageRef = ref(storage, `Imagenes/${trimmedName}`);

      try {
        await uploadBytes(imageRef, selectedImage);
        const downloadURL = await getDownloadURL(imageRef);

        // Obtener ID de la imagen
        const imagesCollectionRef = collection(db, 'images');
        const imageQuery = query(imagesCollectionRef, orderBy('idImage', 'desc'));
        const imageSnapshot = await getDocs(imageQuery);
        let nextId = 1;

        if (!imageSnapshot.empty) {
          const lastImageDoc = imageSnapshot.docs[0];
          const lastId = lastImageDoc.data().idImage.split('-').pop();
          nextId = parseInt(lastId) + 1;
        }

        const imageId = `ID-IMAGE-${nextId.toString().padStart(3, '0')}`;
        const currentDate = new Date().toISOString().split('T')[0];

        // Guardar la imagen en Firestore
        await setDoc(doc(db, 'images', imageId), {
          idImage: imageId,
          name: trimmedName,
          description: trimmedDescription,
          uploadedAt: currentDate,
          uploadedBy: currentUser.id,
          state: 'activo',
          url: downloadURL,
        });

        // Limpiar el estado después de la subida
        setUploadedFileName(selectedImage.name); // Guardar el nombre del archivo subido
        setSelectedImage(null);
        setImageName('');
        setImageDescription('');
        triggerUpdate();

        // Limpiar el nombre subido después de unos segundos
        setTimeout(() => {
          setUploadedFileName('');
        }, 3000); // 3 segundos para mostrar el nombre antes de limpiarlo
      } catch (error) {
        console.error('Error al subir la imagen:', error);
      } finally {
        setIsUploading(false);
      }
    } else {
      alert('Por favor selecciona una imagen, proporciona un nombre y una descripción.');
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-black mb-4">Subir Imágenes</h2>
      <input
        type="text"
        placeholder="Nombre de la imagen"
        value={imageName}
        onChange={(e) => setImageName(e.target.value)}
        className="mb-2 p-2 border border-gray-400 rounded w-full"
      />
      <textarea
        placeholder="Descripción de la imagen"
        value={imageDescription}
        onChange={(e) => setImageDescription(e.target.value)}
        className="mb-2 p-2 border border-gray-400 rounded w-full"
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setSelectedImage(e.target.files[0])}
        className="mb-2 p-2 border border-gray-400 rounded w-full"
      />

      {/* Mostrar el nombre del archivo subido */}
      {uploadedFileName && (
        <div className="text-sm text-gray-500 mb-2">
          <strong>Archivo subido:</strong> {uploadedFileName}
        </div>
      )}

      <button
        onClick={handleImageUpload}
        className="bg-green-500 text-white px-4 py-2 rounded w-full flex justify-center items-center"
        disabled={isUploading}
      >
        {isUploading ? (
          <div className="loader"></div>
        ) : (
          'Subir Imagen'
        )}
      </button>
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

export default UploadImage;
