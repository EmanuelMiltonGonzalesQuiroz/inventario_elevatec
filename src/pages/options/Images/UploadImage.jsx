import React, { useState } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db } from '../../../connection/firebase';
import { doc, setDoc, query, orderBy, getDocs, collection } from 'firebase/firestore';
import { useAuth } from '../../../context/AuthContext';

const UploadImage = ({ triggerUpdate }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageName, setImageName] = useState('');
  const [imageDescription, setImageDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const storage = getStorage();
  const { currentUser } = useAuth();

  const handleImageUpload = async () => {
    if (selectedImage && imageName && imageDescription) {
      setIsUploading(true);

      const imageRef = ref(storage, `Imagenes/${imageName}`);

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
          name: imageName,
          description: imageDescription,
          uploadedAt: currentDate,
          uploadedBy: currentUser.id,
          state: 'activo',
          url: downloadURL,
        });

        setSelectedImage(null);
        setImageName('');
        setImageDescription('');
        triggerUpdate();
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
