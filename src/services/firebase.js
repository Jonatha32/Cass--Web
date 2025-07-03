import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Configuración real de Firebase (misma que la app Flutter)
const firebaseConfig = {
  apiKey: "AIzaSyAamHFW8DQD6ybGTJmgGjeaguhGFZlVtaY",
  authDomain: "casseapp-688ac.firebaseapp.com",
  projectId: "casseapp-688ac",
  storageBucket: "casseapp-688ac.firebasestorage.app",
  messagingSenderId: "805201692669",
  appId: "1:805201692669:web:dd562042dd05dea7107b94"
};

// Inicializar Firebase
let app;
let auth;
let db;
let storage;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
} catch (error) {
  console.error('Error initializing Firebase:', error);
}

export { auth, db, storage };
export default app;