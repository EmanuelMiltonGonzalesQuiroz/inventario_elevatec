import { doc, getDoc } from 'firebase/firestore';
import { db } from '../connection/firebase'; // Asegúrate de que la ruta esté bien configurada

const GetDocumentFields = async (collectionName, documentId, fields = []) => {
  try {
    // Referencia al documento de Firestore
    const docRef = doc(db, collectionName, documentId);

    // Obtener el documento
    const docSnap = await getDoc(docRef);

    // Verificar si el documento existe
    if (docSnap.exists()) {
      const docData = docSnap.data();

      // Si no se especifican campos, devolver todo el documento
      if (fields.length === 0) {
        return docData;
      }

      // Si se especifican campos, devolver solo los solicitados
      const requestedData = {};
      fields.forEach((field) => {
        if (docData[field] !== undefined) {
          requestedData[field] = docData[field];
        }
      });

      return requestedData;
    } else {
      console.log('El documento no existe');
      return null;
    }
  } catch (error) {
    console.error('Error obteniendo el documento:', error);
    return null;
  }
};


export { GetDocumentFields }; 
