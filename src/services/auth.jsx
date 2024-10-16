import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from '../connection/firebase';

export async function validateUserCredentials(email, password) {
    try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("email", "==", email));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            console.log("No se encontró el email en Firestore.");
            return { success: false };
        } else {
            let userDoc;
            let userId;
            querySnapshot.forEach((doc) => {
                userDoc = doc.data();
                userId = doc.id; // Obtener el UID del documento
                console.log("Datos obtenidos de Firestore:", userDoc);
            });

            if (userDoc.password === password) {
                console.log("Credenciales correctas");
                return { success: true, userData: { ...userDoc, id: userId } }; // Incluir el ID en los datos del usuario
            } else {
                console.log("Password incorrecto.");
                return { success: false };
            }
        }
    } catch (error) {
        console.error("Error al validar las credenciales: ", error.message);
        return { success: false, error: error.message };
    }
}
