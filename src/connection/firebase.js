// Importa las funciones necesarias desde los SDKs
import { initializeApp } from "firebase/app";
import { getFirestore,getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage"; // Importar Firebase Storage

// Configuración de Firebase para tu aplicación web
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Inicializa Firestore, Auth y Storage
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app); // Inicializa Firebase Storage

// Variable para controlar el número de lecturas
let readCount = 0;
const MAX_READS = 2000; // Límite máximo de lecturas permitidas

// Wrapper para getDocs para controlar las lecturas
const controlledGetDocs = async (collectionRef) => {
    if (readCount >= MAX_READS) {
        throw new Error("Número máximo de lecturas alcanzado");
    }
    readCount++;
    return await getDocs(collectionRef);
};

// Resetear contador de lecturas (ejemplo: cada día, o bajo ciertas condiciones)
const resetReadCount = () => {
    readCount = 0;
};

// Exportamos Firestore, Auth y Storage
export { db, auth, storage, controlledGetDocs, resetReadCount };
