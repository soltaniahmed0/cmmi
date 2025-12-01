import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Configuration Firebase
// Les valeurs d'environnement sont utilisées en production (Vercel)
// Les valeurs par défaut sont utilisées en développement local
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyDuzQUU2YYmRsp4pPPK_X2eZ-Mbp4XtQjc",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "cmmi-platform.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "cmmi-platform",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "cmmi-platform.firebasestorage.app",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "950240391616",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:950240391616:web:bb1cd4f32a5c27d1195825"
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);

// Initialiser Firestore
export const db = getFirestore(app);

export default app;

