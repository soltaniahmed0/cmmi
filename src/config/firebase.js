import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Configuration Firebase
// IMPORTANT: Les valeurs doivent être définies via les variables d'environnement
// Pour le développement local, créez un fichier .env.local avec vos clés
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Initialiser Firebase
let app = null;
let db = null;

try {
  // Vérifier que les variables d'environnement sont définies
  if (firebaseConfig.apiKey && 
      firebaseConfig.projectId && 
      firebaseConfig.apiKey !== 'your-api-key' && 
      firebaseConfig.projectId !== 'your-project-id') {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    console.log('Firebase initialisé avec succès');
  } else {
    console.warn('Firebase n\'est pas configuré. Utilisation de localStorage.');
  }
} catch (error) {
  console.error('Erreur lors de l\'initialisation de Firebase:', error);
  // Continuer sans Firebase (fallback sur localStorage)
}

export { db };
export default app;

