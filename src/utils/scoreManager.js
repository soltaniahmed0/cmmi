// Gestionnaire de scores avec Firestore (fallback localStorage)
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  deleteDoc, 
  doc,
  writeBatch,
  onSnapshot,
  updateDoc,
  Timestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';

// Vérifier si Firestore est configuré (pas les valeurs par défaut)
const isFirestoreConfigured = () => {
  const config = process.env;
  return config.REACT_APP_FIREBASE_PROJECT_ID && 
         config.REACT_APP_FIREBASE_PROJECT_ID !== 'your-project-id' &&
         config.REACT_APP_FIREBASE_API_KEY &&
         config.REACT_APP_FIREBASE_API_KEY !== 'your-api-key';
};

// Fallback localStorage
const saveScoreLocalStorage = (playerName, gameName, score, maxScore, timeSpent = 0) => {
  const scores = getScoresLocalStorage();
  const newScore = {
    id: Date.now(),
    playerName,
    gameName,
    score,
    maxScore,
    percentage: Math.round((score / maxScore) * 100),
    timeSpent,
    date: new Date().toISOString()
  };

  scores.push(newScore);
  localStorage.setItem('cmmi_scores', JSON.stringify(scores));
  window.dispatchEvent(new Event('scoreUpdated'));
  window.dispatchEvent(new StorageEvent('storage', { key: 'cmmi_scores' }));
  return newScore;
};

const getScoresLocalStorage = () => {
  const scoresJson = localStorage.getItem('cmmi_scores');
  return scoresJson ? JSON.parse(scoresJson) : [];
};

// Firestore functions
export const saveScore = async (playerName, gameName, score, maxScore, timeSpent = 0) => {
  // Si Firestore n'est pas configuré, utiliser localStorage
  if (!isFirestoreConfigured()) {
    return saveScoreLocalStorage(playerName, gameName, score, maxScore, timeSpent);
  }

  try {
    const percentage = Math.round((score / maxScore) * 100);
    const newScore = {
      playerName,
      gameName,
      score,
      maxScore,
      percentage,
      timeSpent,
      date: Timestamp.now()
    };

    const docRef = await addDoc(collection(db, 'scores'), newScore);
    
    // Émettre un événement pour la mise à jour locale
    window.dispatchEvent(new Event('scoreUpdated'));
    
    return {
      id: docRef.id,
      ...newScore,
      date: newScore.date.toDate().toISOString()
    };
  } catch (error) {
    console.error('Erreur lors de la sauvegarde du score dans Firestore:', error);
    // Fallback sur localStorage en cas d'erreur
    return saveScoreLocalStorage(playerName, gameName, score, maxScore, timeSpent);
  }
};

export const getScores = async () => {
  // Si Firestore n'est pas configuré, utiliser localStorage
  if (!isFirestoreConfigured()) {
    return getScoresLocalStorage();
  }

  try {
    const scoresRef = collection(db, 'scores');
    const q = query(scoresRef, orderBy('date', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date?.toDate ? doc.data().date.toDate().toISOString() : doc.data().date
    }));
  } catch (error) {
    console.error('Erreur lors de la récupération des scores depuis Firestore:', error);
    // Fallback sur localStorage en cas d'erreur
    return getScoresLocalStorage();
  }
};

// Écouter les changements en temps réel (pour AdminPanel)
export const subscribeToScores = (callback) => {
  // Si Firestore n'est pas configuré, utiliser localStorage avec polling
  if (!isFirestoreConfigured()) {
    const handleUpdate = () => {
      callback(getScoresLocalStorage());
    };
    
    window.addEventListener('scoreUpdated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    
    // Initial call
    handleUpdate();
    
    // Polling pour les autres onglets
    const interval = setInterval(handleUpdate, 1000);
    
    return () => {
      window.removeEventListener('scoreUpdated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
      clearInterval(interval);
    };
  }

  try {
    const scoresRef = collection(db, 'scores');
    const q = query(scoresRef, orderBy('date', 'desc'));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const scores = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate ? doc.data().date.toDate().toISOString() : doc.data().date
      }));
      callback(scores);
    }, (error) => {
      console.error('Erreur lors de l\'écoute des scores:', error);
      // Fallback sur localStorage
      callback(getScoresLocalStorage());
    });

    return unsubscribe;
  } catch (error) {
    console.error('Erreur lors de la souscription aux scores:', error);
    // Fallback sur localStorage avec polling
    const handleUpdate = () => {
      callback(getScoresLocalStorage());
    };
    
    window.addEventListener('scoreUpdated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    
    // Initial call
    handleUpdate();
    
    // Polling pour les autres onglets
    const interval = setInterval(handleUpdate, 1000);
    
    return () => {
      window.removeEventListener('scoreUpdated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
      clearInterval(interval);
    };
  }
};

export const getScoresByGame = async (gameName) => {
  const scores = await getScores();
  return scores.filter(s => s.gameName === gameName);
};

export const getTopScores = async (limit = 10, gameName = null) => {
  let scores = await getScores();
  
  if (gameName) {
    scores = scores.filter(s => s.gameName === gameName);
  }

  // Trier par pourcentage, puis par score, puis par temps
  scores.sort((a, b) => {
    if (b.percentage !== a.percentage) {
      return b.percentage - a.percentage;
    }
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return a.timeSpent - b.timeSpent;
  });

  return scores.slice(0, limit);
};

export const getTop3 = async (gameName = null) => {
  return await getTopScores(3, gameName);
};

export const getOverallRanking = async () => {
  const scores = await getScores();
  const playerStats = {};

  // Calculer le score total pour chaque joueur
  scores.forEach(score => {
    if (!playerStats[score.playerName]) {
      playerStats[score.playerName] = {
        playerName: score.playerName,
        totalScore: 0,
        gamesPlayed: 0,
        averagePercentage: 0,
        games: []
      };
    }
    
    playerStats[score.playerName].totalScore += score.score;
    playerStats[score.playerName].gamesPlayed += 1;
    playerStats[score.playerName].games.push({
      gameName: score.gameName,
      score: score.score,
      percentage: score.percentage
    });
  });

  // Calculer la moyenne de pourcentage pour chaque joueur
  Object.values(playerStats).forEach(player => {
    const totalPercentage = player.games.reduce((sum, g) => sum + g.percentage, 0);
    player.averagePercentage = Math.round(totalPercentage / player.gamesPlayed);
  });

  // Convertir en array et trier par score total (critère principal)
  const ranking = Object.values(playerStats).sort((a, b) => {
    // Trier d'abord par score total (descendant)
    if (b.totalScore !== a.totalScore) {
      return b.totalScore - a.totalScore;
    }
    // Si score total égal, trier par moyenne (descendant)
    if (b.averagePercentage !== a.averagePercentage) {
      return b.averagePercentage - a.averagePercentage;
    }
    // Si tout est égal, trier par nombre de jeux joués (descendant)
    return b.gamesPlayed - a.gamesPlayed;
  });

  return ranking;
};

export const clearAllScores = async () => {
  if (!isFirestoreConfigured()) {
    localStorage.removeItem('cmmi_scores');
    window.dispatchEvent(new Event('scoreUpdated'));
    return;
  }

  try {
    const scores = await getScores();
    const batch = writeBatch(db);
    
    scores.forEach(score => {
      const scoreRef = doc(db, 'scores', score.id);
      batch.delete(scoreRef);
    });
    
    await batch.commit();
    window.dispatchEvent(new Event('scoreUpdated'));
  } catch (error) {
    console.error('Erreur lors de la suppression des scores:', error);
    // Fallback sur localStorage
    localStorage.removeItem('cmmi_scores');
    window.dispatchEvent(new Event('scoreUpdated'));
  }
};

export const getPlayerName = () => {
  return localStorage.getItem('cmmi_player_name') || '';
};

// Vérifier si un nom d'utilisateur existe déjà
export const checkPlayerNameExists = async (playerName) => {
  if (!playerName || !playerName.trim()) return false;

  // Si Firestore n'est pas configuré, utiliser localStorage
  if (!isFirestoreConfigured()) {
    const users = JSON.parse(localStorage.getItem('cmmi_users') || '[]');
    return users.some(u => u.playerName.toLowerCase() === playerName.trim().toLowerCase());
  }

  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, orderBy('playerName'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.some(doc => 
      doc.data().playerName.toLowerCase() === playerName.trim().toLowerCase()
    );
  } catch (error) {
    console.error('Erreur lors de la vérification du nom:', error);
    // Fallback sur localStorage
    const users = JSON.parse(localStorage.getItem('cmmi_users') || '[]');
    return users.some(u => u.playerName.toLowerCase() === playerName.trim().toLowerCase());
  }
};

// Enregistrer un nouvel utilisateur (même s'il n'a pas encore joué)
// Empêche 2 utilisateurs d'utiliser le même nom
export const registerPlayer = async (playerName) => {
  if (!playerName || !playerName.trim()) return null;

  const trimmedName = playerName.trim();
  const currentLocalName = localStorage.getItem('cmmi_player_name');
  
  // Si Firestore n'est pas configuré, utiliser localStorage
  if (!isFirestoreConfigured()) {
    const users = JSON.parse(localStorage.getItem('cmmi_users') || '[]');
    
    // Vérifier si l'utilisateur existe déjà
    const existingUser = users.find(u => u.playerName.toLowerCase() === trimmedName.toLowerCase());
    
    // Si l'utilisateur existe ET ce n'est pas le même utilisateur actuel, rejeter
    if (existingUser && currentLocalName !== trimmedName) {
      throw new Error('Ce nom est déjà utilisé. Veuillez choisir un autre nom.');
    }

    // Si c'est le même utilisateur, juste mettre à jour
    if (existingUser && currentLocalName === trimmedName) {
      existingUser.lastActive = new Date().toISOString();
      localStorage.setItem('cmmi_users', JSON.stringify(users));
      return existingUser;
    }

    // Nouvel utilisateur
    const newUser = {
      id: Date.now(),
      playerName: trimmedName,
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('cmmi_users', JSON.stringify(users));
    localStorage.setItem('cmmi_player_name', trimmedName);
    window.dispatchEvent(new Event('userRegistered'));
    return newUser;
  }

  try {
    // Vérifier si l'utilisateur existe déjà dans Firestore
    const usersRef = collection(db, 'users');
    const q = query(usersRef, orderBy('playerName'));
    const querySnapshot = await getDocs(q);
    
    const existingUserDoc = querySnapshot.docs.find(doc => 
      doc.data().playerName.toLowerCase() === trimmedName.toLowerCase()
    );

    // Si l'utilisateur existe ET ce n'est pas le même utilisateur actuel, rejeter
    if (existingUserDoc && currentLocalName !== trimmedName) {
      throw new Error('Ce nom est déjà utilisé. Veuillez choisir un autre nom.');
    }

    // Si c'est le même utilisateur, juste mettre à jour lastActive
    if (existingUserDoc && currentLocalName === trimmedName) {
      const userRef = doc(db, 'users', existingUserDoc.id);
      await updateDoc(userRef, {
        lastActive: Timestamp.now()
      });
      
      return {
        id: existingUserDoc.id,
        ...existingUserDoc.data(),
        createdAt: existingUserDoc.data().createdAt?.toDate ? existingUserDoc.data().createdAt.toDate().toISOString() : existingUserDoc.data().createdAt,
        lastActive: new Date().toISOString()
      };
    }

    // Créer le nouvel utilisateur dans Firestore
    const newUser = {
      playerName: trimmedName,
      createdAt: Timestamp.now(),
      lastActive: Timestamp.now()
    };

    const docRef = await addDoc(collection(db, 'users'), newUser);
    
    // Sauvegarder aussi dans localStorage pour la session
    localStorage.setItem('cmmi_player_name', trimmedName);
    
    // Mettre à jour lastActive dans localStorage
    const localUsers = JSON.parse(localStorage.getItem('cmmi_users') || '[]');
    localUsers.push({
      id: docRef.id,
      ...newUser,
      createdAt: newUser.createdAt.toDate().toISOString(),
      lastActive: newUser.lastActive.toDate().toISOString()
    });
    localStorage.setItem('cmmi_users', JSON.stringify(localUsers));
    
    window.dispatchEvent(new Event('userRegistered'));
    
    return {
      id: docRef.id,
      ...newUser,
      createdAt: newUser.createdAt.toDate().toISOString(),
      lastActive: newUser.lastActive.toDate().toISOString()
    };
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement de l\'utilisateur:', error);
    throw error;
  }
};

export const savePlayerName = async (name) => {
  if (!name || !name.trim()) {
    localStorage.removeItem('cmmi_player_name');
    return;
  }

  const trimmedName = name.trim();
  
  // Vérifier si c'est le même nom que celui déjà enregistré localement
  const currentName = localStorage.getItem('cmmi_player_name');
  if (currentName === trimmedName) {
    // C'est le même nom, pas besoin de réenregistrer
    return;
  }

  try {
    await registerPlayer(trimmedName);
  } catch (error) {
    // Si c'est juste une erreur de duplication, la relancer
    throw error;
  }
};

// Récupérer tous les utilisateurs (même ceux sans scores)
export const getAllUsers = async () => {
  if (!isFirestoreConfigured()) {
    const users = JSON.parse(localStorage.getItem('cmmi_users') || '[]');
    return users;
  }

  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate().toISOString() : doc.data().createdAt,
      lastActive: doc.data().lastActive?.toDate ? doc.data().lastActive.toDate().toISOString() : doc.data().lastActive
    }));
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    // Fallback sur localStorage
    return JSON.parse(localStorage.getItem('cmmi_users') || '[]');
  }
};

