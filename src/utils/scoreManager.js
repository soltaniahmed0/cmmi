// Gestionnaire de scores avec localStorage

export const saveScore = (playerName, gameName, score, maxScore, timeSpent = 0) => {
  const scores = getScores();
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
  
  // Émettre un événement personnalisé pour la mise à jour en temps réel
  window.dispatchEvent(new Event('scoreUpdated'));
  
  return newScore;
};

export const getScores = () => {
  const scoresJson = localStorage.getItem('cmmi_scores');
  return scoresJson ? JSON.parse(scoresJson) : [];
};

export const getScoresByGame = (gameName) => {
  return getScores().filter(s => s.gameName === gameName);
};

export const getTopScores = (limit = 10, gameName = null) => {
  let scores = getScores();
  
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

export const getTop3 = (gameName = null) => {
  return getTopScores(3, gameName);
};

export const getOverallRanking = () => {
  const scores = getScores();
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

  // Convertir en array et trier
  const ranking = Object.values(playerStats).sort((a, b) => {
    if (b.averagePercentage !== a.averagePercentage) {
      return b.averagePercentage - a.averagePercentage;
    }
    return b.totalScore - a.totalScore;
  });

  return ranking;
};

export const clearAllScores = () => {
  localStorage.removeItem('cmmi_scores');
};

export const getPlayerName = () => {
  return localStorage.getItem('cmmi_player_name') || '';
};

export const savePlayerName = (name) => {
  localStorage.setItem('cmmi_player_name', name);
};

