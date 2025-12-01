import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaChartLine, FaTrophy, FaLock } from 'react-icons/fa';
import { saveScore, getPlayerName } from '../utils/scoreManager';
import { isGameLocked, CMMI_LEVELS } from '../utils/gameLock';
import Top3Leaderboard from './Top3Leaderboard';
import ParticleEffect from './ParticleEffect';
import GameTimer from './GameTimer';
import './Level4QuantitativelyManaged.css';

const Level4QuantitativelyManaged = () => {
  const initialMetrics = [
    { id: 1, question: 'Quelle métrique mesure la qualité du code ?', answer: '', correct: 'Densité des défauts', options: ['Densité des défauts', 'Taille du code', 'Nombre de lignes', 'Vitesse de développement'] },
    { id: 2, question: 'Quelle métrique permet de prédire la durée d\'un projet ?', answer: '', correct: 'Vélocité de l\'équipe', options: ['Vélocité de l\'équipe', 'Nombre d\'employés', 'Budget alloué', 'Taille de l\'écran'] },
    { id: 3, question: 'Comment mesure-t-on l\'efficacité d\'un processus ?', answer: '', correct: 'Taux de réussite', options: ['Taux de réussite', 'Couleur de l\'interface', 'Nombre de réunions', 'Température du bureau'] },
    { id: 4, question: 'Quelle métrique est quantitative ?', answer: '', correct: 'Temps de cycle', options: ['Temps de cycle', 'Satisfaction générale', 'Beauté du code', 'Humeur de l\'équipe'] },
    { id: 5, question: 'Pour prédire les performances, on utilise :', answer: '', correct: 'Modèles statistiques', options: ['Modèles statistiques', 'Intuition', 'Chance', 'Astrologie'] },
    { id: 6, question: 'Une métrique quantitative est :', answer: '', correct: 'Mesurable numériquement', options: ['Mesurable numériquement', 'Subjectivement évaluable', 'Basée sur l\'opinion', 'Non vérifiable'] }
  ];

  const [metrics, setMetrics] = useState(initialMetrics);

  const [score, setScore] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [showTop3, setShowTop3] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [particleTrigger, setParticleTrigger] = useState(0);
  const [timeUp, setTimeUp] = useState(false);
  const [gameActive, setGameActive] = useState(false);

  React.useEffect(() => {
    const updateLockStatus = async () => {
      const playerName = getPlayerName();
      const locked = await isGameLocked('Niveau 4: Quantitatively Managed', playerName);
      setIsLocked(locked);
    };
    
    updateLockStatus();
    
    // Écouter les événements de mise à jour des scores
    window.addEventListener('scoreUpdated', updateLockStatus);
    window.addEventListener('storage', updateLockStatus);
    
    return () => {
      window.removeEventListener('scoreUpdated', updateLockStatus);
      window.removeEventListener('storage', updateLockStatus);
    };
  }, []);

  const handleTimeUp = () => {
    setTimeUp(true);
    setGameActive(false);
    // Calculer le score final avec les réponses actuelles
    const finalScore = metrics.filter(m => m.answer === m.correct).length;
    setGameComplete(true);
    const playerName = getPlayerName();
    if (playerName) {
      saveScore(playerName, 'Niveau 4: Quantitatively Managed', finalScore, metrics.length).catch(err => 
        console.error('Erreur lors de la sauvegarde du score:', err)
      );
    }
  };

  const startGame = () => {
    setGameActive(true);
    setTimeUp(false);
    setMetrics(initialMetrics.map(m => ({ ...m, answer: '' })));
    setScore(0);
    setGameComplete(false);
  };

  const handleAnswer = (metricId, selectedAnswer) => {
    if (!gameActive || timeUp || gameComplete) return;

    const metric = metrics.find(m => m.id === metricId);
    if (!metric || metric.answer) return;

    const updatedMetrics = metrics.map(m =>
      m.id === metricId ? { ...m, answer: selectedAnswer } : m
    );

    setMetrics(updatedMetrics);

    if (selectedAnswer === metric.correct) {
      setScore(prev => prev + 1);
      setParticleTrigger(prev => prev + 1);
    }

    const allAnswered = updatedMetrics.every(m => m.answer !== '');
    if (allAnswered) {
      setTimeout(() => {
        calculateFinalScore();
      }, 1000);
    }
  };

  const calculateFinalScore = () => {
    setGameActive(false);
    setGameComplete(true);
    const playerName = getPlayerName();
    if (playerName) {
      // Calculer le score final basé sur l'état actuel des métriques
      const finalScore = metrics.filter(m => m.answer === m.correct).length;
      saveScore(playerName, 'Niveau 4: Quantitatively Managed', finalScore, metrics.length).catch(err => 
        console.error('Erreur lors de la sauvegarde du score:', err)
      );
    }
  };

  const resetGame = () => {
    setScore(0);
    setGameComplete(false);
    setTimeUp(false);
    setGameActive(false);
    setMetrics(initialMetrics.map(m => ({ ...m, answer: '' })));
  };

  if (isLocked) {
    return (
      <section id="level4-quantitatively-managed" className="level4-section">
        <div className="container">
          <div className="locked-game-overlay">
            <FaLock className="lock-big-icon" />
            <h2>🔒 Étape Verrouillée</h2>
            <p>Vous devez d'abord compléter le Niveau 3: Defined.</p>
            <button 
              className="go-to-progress-btn"
              onClick={() => {
                const element = document.getElementById('progress');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Voir ma progression
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="level4-quantitatively-managed" className="level4-section">
      <ParticleEffect trigger={particleTrigger} type="confetti" />
      <div className="container">
        <div className="game-header">
          <h2 className="game-title">Niveau 4: Quantitatively Managed - Mesures Quantitatives</h2>
          <p className="game-description">
            Mesurez les performances ! Sélectionnez les bonnes métriques quantitatives
          </p>
        </div>

        {!gameActive && !gameComplete && (
          <motion.div
            className="start-screen"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <FaChartLine className="start-icon" />
            <p>Répondez à {metrics.length} questions sur les métriques en 3 minutes !</p>
            <button className="start-btn" onClick={startGame}>
              🚀 Commencer
            </button>
          </motion.div>
        )}

        {gameActive && !gameComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="game-content"
          >
            <div className="game-stats-bar">
              <GameTimer 
                initialTime={180}
                onTimeUp={handleTimeUp}
                gameActive={gameActive && !gameComplete}
              />
              <div className="score-badge">
                Score: <strong>{score}/{metrics.length}</strong>
              </div>
            </div>

            <div className="metrics-container">
              {metrics.map((metric, index) => {
                const isAnswered = metric.answer !== '';
                const isCorrect = metric.answer === metric.correct;

                return (
                  <motion.div
                    key={metric.id}
                    className={`metric-card ${isAnswered ? (isCorrect ? 'correct' : 'incorrect') : ''}`}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="metric-question">
                      <span className="question-number">{index + 1}.</span>
                      <p>{metric.question}</p>
                    </div>
                    <div className="metric-options">
                      {metric.options.map((option, optIndex) => {
                        const isSelected = metric.answer === option;
                        return (
                          <motion.button
                            key={optIndex}
                            className={`option-btn ${isSelected ? 'selected' : ''} ${isAnswered && option === metric.correct ? 'correct-answer' : ''} ${isAnswered && isSelected && !isCorrect ? 'wrong-answer' : ''}`}
                            onClick={() => handleAnswer(metric.id, option)}
                            disabled={isAnswered || !gameActive || timeUp}
                            whileHover={!isAnswered ? { scale: 1.05, y: -3 } : {}}
                            whileTap={!isAnswered ? { scale: 0.95 } : {}}
                          >
                            {option}
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {gameComplete && (
          <motion.div
            className="results-screen"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <FaTrophy className="trophy-icon" />
            <h2>Mesures Terminées !</h2>
            <div className="score-display">
              <div className="score-value">{score} / {metrics.length}</div>
              <div className="score-percentage">
                {Math.round((score / metrics.length) * 100)}%
              </div>
            </div>
            <div className="result-buttons">
              <button className="replay-btn" onClick={resetGame}>
                🔄 Rejouer
              </button>
              <button className="top3-btn" onClick={() => setShowTop3(true)}>
                🏆 Top 3
              </button>
            </div>
          </motion.div>
        )}

        {showTop3 && (
          <Top3Leaderboard 
            gameName="Niveau 4: Quantitatively Managed" 
            onClose={() => setShowTop3(false)} 
          />
        )}
      </div>
    </section>
  );
};

export default Level4QuantitativelyManaged;

