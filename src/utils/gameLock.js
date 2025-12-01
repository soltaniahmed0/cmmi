// Gestion du système de verrouillage des jeux basé sur les niveaux CMMI

import { getScores, getPlayerName } from './scoreManager';

export const CMMI_LEVELS = {
  1: {
    name: 'Initial',
    color: '#ef4444',
    game: 'Niveau 1: Initial',
    required: 70,
    description: 'Comprenez les bases du CMMI',
    totalQuestions: 7
  },
  2: {
    name: 'Managed',
    color: '#f59e0b',
    game: 'Niveau 2: Managed',
    required: 100,
    description: 'Gérez les projets efficacement',
    prerequisite: 1,
    totalProjects: 3
  },
  3: {
    name: 'Defined',
    color: '#3b82f6',
    game: 'Niveau 3: Defined',
    required: 100,
    description: 'Standardisez les processus',
    prerequisite: 2,
    totalStandards: 8
  },
  4: {
    name: 'Quantitatively Managed',
    color: '#8b5cf6',
    game: 'Niveau 4: Quantitatively Managed',
    required: 80,
    description: 'Mesurez quantitativement',
    prerequisite: 3,
    totalQuestions: 6
  },
  5: {
    name: 'Optimizing',
    color: '#10b981',
    game: 'Niveau 5: Optimizing',
    required: 100,
    description: 'Améliorez continuellement',
    prerequisite: 4,
    totalProblems: 5
  }
};

export const GAME_TO_LEVEL = {
  'Niveau 1: Initial': 1,
  'Niveau 2: Managed': 2,
  'Niveau 3: Defined': 3,
  'Niveau 4: Quantitatively Managed': 4,
  'Niveau 5: Optimizing': 5
};

// Version synchrone qui utilise localStorage (pour compatibilité)
const getScoresSync = () => {
  try {
    const scoresJson = localStorage.getItem('cmmi_scores');
    return scoresJson ? JSON.parse(scoresJson) : [];
  } catch (error) {
    console.error('Erreur lors de la récupération des scores depuis localStorage:', error);
    return [];
  }
};

export const getPlayerCMMILevel = async (playerName) => {
  if (!playerName) return 0;
  
  // Essayer d'abord avec Firestore (async), puis fallback sur localStorage
  let scores;
  try {
    scores = await getScores();
  } catch (error) {
    console.warn('Erreur lors de la récupération des scores, utilisation de localStorage:', error);
    scores = getScoresSync();
  }
  
  if (!Array.isArray(scores)) {
    scores = getScoresSync();
  }
  
  const playerScores = scores.filter(s => s.playerName === playerName);
  
  // Vérifier chaque niveau dans l'ordre - maintenant on vérifie juste si le jeu a été joué
  for (let level = 1; level <= 5; level++) {
    const levelInfo = CMMI_LEVELS[level];
    const gameScores = playerScores.filter(s => s.gameName === levelInfo.game);
    
    if (gameScores.length === 0) {
      // Aucun score pour ce niveau, retourner le niveau précédent
      return level - 1;
    }
    // Si le joueur a joué au jeu, il peut passer au suivant (même avec 0%)
    // Pas de vérification de score requis
  }
  
  // Tous les niveaux complétés
  return 5;
};

export const isGameLocked = async (gameName, playerName = null) => {
  const currentPlayerName = playerName || getPlayerName();
  if (!currentPlayerName) return true;
  
  const level = GAME_TO_LEVEL[gameName];
  if (!level || level === 1) return false; // Le premier jeu n'est jamais verrouillé
  
  // Vérifier si le niveau précédent a été joué (même avec 0% de score)
  const previousLevel = level - 1;
  const previousGame = CMMI_LEVELS[previousLevel].game;
  
  // Essayer d'abord avec Firestore (async), puis fallback sur localStorage
  let scores;
  try {
    scores = await getScores();
  } catch (error) {
    console.warn('Erreur lors de la récupération des scores, utilisation de localStorage:', error);
    scores = getScoresSync();
  }
  
  if (!Array.isArray(scores)) {
    scores = getScoresSync();
  }
  
  const playerScores = scores.filter(s => s.playerName === currentPlayerName);
  const previousGamePlayed = playerScores.some(s => s.gameName === previousGame);
  
  // Le jeu est verrouillé seulement si le niveau précédent n'a pas été joué
  return !previousGamePlayed;
};

export const canAccessGame = async (gameName, playerName = null) => {
  const locked = await isGameLocked(gameName, playerName);
  return !locked;
};

export const getGameSectionId = (gameName) => {
  const sectionMap = {
    'Niveau 1: Initial': 'level1-initial',
    'Niveau 2: Managed': 'level2-managed',
    'Niveau 3: Defined': 'level3-defined',
    'Niveau 4: Quantitatively Managed': 'level4-quantitatively-managed',
    'Niveau 5: Optimizing': 'level5-optimizing'
  };
  return sectionMap[gameName] || '';
};

