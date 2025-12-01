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

export const savePlayerName = (name) => {
  localStorage.setItem('cmmi_player_name', name);
};

