// Gestion du système de verrouillage des jeux basé sur les niveaux CMMI

import { getScores, getPlayerName } from './scoreManager';

export const CMMI_LEVELS = {
  1: {
    name: 'Initial',
    color: '#ef4444',
    game: 'Quiz CMMI',
    required: 70,
    description: 'Comprenez les bases du CMMI'
  },
  2: {
    name: 'Managed',
    color: '#f59e0b',
    game: 'Jeu de Mémoire',
    required: 6,
    description: 'Mémorisez les concepts clés',
    prerequisite: 1
  },
  3: {
    name: 'Defined',
    color: '#3b82f6',
    game: 'Drag & Drop Processus',
    required: 10,
    description: 'Classez les processus par niveau',
    prerequisite: 2
  },
  4: {
    name: 'Quantitatively Managed',
    color: '#8b5cf6',
    game: 'TrueFalse',
    required: 80,
    description: 'Testez votre compréhension avancée',
    prerequisite: 3
  },
  5: {
    name: 'Optimizing',
    color: '#10b981',
    game: 'OrderLevels',
    required: 100,
    description: 'Maîtrisez l\'ordre des niveaux',
    prerequisite: 4
  }
};

export const GAME_TO_LEVEL = {
  'Quiz CMMI': 1,
  'Jeu de Mémoire': 2,
  'Drag & Drop Processus': 3,
  'TrueFalse': 4,
  'OrderLevels': 5
};

export const getPlayerCMMILevel = (playerName) => {
  if (!playerName) return 0;
  
  const scores = getScores();
  const playerScores = scores.filter(s => s.playerName === playerName);
  
  // Vérifier chaque niveau dans l'ordre
  for (let level = 1; level <= 5; level++) {
    const levelInfo = CMMI_LEVELS[level];
    const gameScores = playerScores.filter(s => s.gameName === levelInfo.game);
    
    if (gameScores.length === 0) {
      // Aucun score pour ce niveau, retourner le niveau précédent
      return level - 1;
    }
    
    // Vérifier si le joueur a atteint le score requis
    const bestScore = gameScores.sort((a, b) => b.percentage - a.percentage)[0];
    const requiredPercentage = levelInfo.required;
    
    // Pour les jeux avec un score absolu (Mémoire, Drag & Drop)
    if (level === 2) {
      // Jeu de Mémoire : required = nombre de paires
      if (bestScore.score < requiredPercentage) {
        return level - 1;
      }
    } else if (level === 3) {
      // Drag & Drop : required = nombre de processus corrects
      if (bestScore.score < requiredPercentage) {
        return level - 1;
      }
    } else {
      // Pourcentage pour les autres jeux
      if (bestScore.percentage < requiredPercentage) {
        return level - 1;
      }
    }
  }
  
  // Tous les niveaux complétés
  return 5;
};

export const isGameLocked = (gameName, playerName = null) => {
  const currentPlayerName = playerName || getPlayerName();
  if (!currentPlayerName) return true;
  
  const level = GAME_TO_LEVEL[gameName];
  if (!level || level === 1) return false; // Le premier jeu n'est jamais verrouillé
  
  const currentLevel = getPlayerCMMILevel(currentPlayerName);
  return currentLevel < level - 1; // Verrouillé si le niveau précédent n'est pas atteint
};

export const canAccessGame = (gameName, playerName = null) => {
  return !isGameLocked(gameName, playerName);
};

export const getGameSectionId = (gameName) => {
  const sectionMap = {
    'Quiz CMMI': 'activities',
    'Jeu de Mémoire': 'memory-game',
    'Drag & Drop Processus': 'drag-drop',
    'TrueFalse': 'truefalse',
    'OrderLevels': 'order-levels'
  };
  return sectionMap[gameName] || '';
};

