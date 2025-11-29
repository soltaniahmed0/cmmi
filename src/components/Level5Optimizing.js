import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaRocket, FaTrophy, FaLock } from 'react-icons/fa';
import { saveScore, getPlayerName } from '../utils/scoreManager';
import { isGameLocked, CMMI_LEVELS } from '../utils/gameLock';
import Top3Leaderboard from './Top3Leaderboard';
import ParticleEffect from './ParticleEffect';
import GameTimer from './GameTimer';
import './Level5Optimizing.css';

const Level5Optimizing = () => {
  const initialImprovements = [
    { id: 1, problem: 'Délais non respectés', solutions: ['Analyse causale', 'Optimisation des processus', 'Ignorer le problème'], correct: 0 },
    { id: 2, problem: 'Qualité variable', solutions: ['Mesures continues', 'Formation', 'Accepter la variance'], correct: 0 },
    { id: 3, problem: 'Coûts élevés', solutions: ['Innovation', 'Automatisation', 'Réduire la qualité'], correct: 1 },
    { id: 4, problem: 'Ressources sous-utilisées', solutions: ['Réallocation', 'Optimisation', 'Laisser tel quel'], correct: 1 },
    { id: 5, problem: 'Processus obsolètes', solutions: ['Amélioration continue', 'Innovation', 'Maintenir l\'existant'], correct: 0 }
  ];

  const [improvements, setImprovements] = useState(initialImprovements);
  const [selectedSolutions, setSelectedSolutions] = useState({});
  const [score, setScore] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [showTop3, setShowTop3] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [particleTrigger, setParticleTrigger] = useState(0);
  const [timeUp, setTimeUp] = useState(false);
  const [gameActive, setGameActive] = useState(false);

  React.useEffect(() => {
    const updateLockStatus = () => {
      const playerName = getPlayerName();
      setIsLocked(isGameLocked('Niveau 5: Optimizing', playerName));
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
    const finalScore = Object.keys(selectedSolutions).reduce((acc, id) => {
      const imp = improvements.find(i => i.id === parseInt(id));
      return acc + (selectedSolutions[id] === imp?.correct ? 1 : 0);
    }, 0);
    
    setGameComplete(true);
    const playerName = getPlayerName();
    if (playerName) {
      saveScore(playerName, 'Niveau 5: Optimizing', finalScore, improvements.length);
    }
  };

  const startGame = () => {
    setGameActive(true);
    setTimeUp(false);
    setSelectedSolutions({});
    setScore(0);
    setGameComplete(false);
  };

  const handleSolutionSelect = (improvementId, solutionIndex) => {
    if (!gameActive || timeUp || gameComplete) return;

    const improvement = improvements.find(i => i.id === improvementId);
    if (!improvement || selectedSolutions[improvementId] !== undefined) return;

    const newSelectedSolutions = {
      ...selectedSolutions,
      [improvementId]: solutionIndex
    };

    setSelectedSolutions(newSelectedSolutions);

    if (solutionIndex === improvement.correct) {
      const newScore = Object.keys(newSelectedSolutions).reduce((acc, id) => {
        const imp = improvements.find(i => i.id === parseInt(id));
        return acc + (newSelectedSolutions[id] === imp?.correct ? 1 : 0);
      }, 0);
      setScore(newScore);
      setParticleTrigger(prev => prev + 1);
    }

    if (Object.keys(newSelectedSolutions).length === improvements.length) {
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
      const finalScore = Object.keys(selectedSolutions).reduce((acc, id) => {
        const imp = improvements.find(i => i.id === parseInt(id));
        return acc + (selectedSolutions[id] === imp?.correct ? 1 : 0);
      }, 0);
      saveScore(playerName, 'Niveau 5: Optimizing', finalScore, improvements.length);
    }
  };

  const resetGame = () => {
    setScore(0);
    setGameComplete(false);
    setTimeUp(false);
    setGameActive(false);
    setSelectedSolutions({});
    setImprovements(initialImprovements);
  };

  if (isLocked) {
    return (
      <section id="level5-optimizing" className="level5-section">
        <div className="container">
          <div className="locked-game-overlay">
            <FaLock className="lock-big-icon" />
            <h2>🔒 Étape Verrouillée</h2>
            <p>Vous devez d'abord compléter le Niveau 4: Quantitatively Managed.</p>
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
    <section id="level5-optimizing" className="level5-section">
      <ParticleEffect trigger={particleTrigger} type="confetti" />
      <div className="container">
        <div className="game-header">
          <h2 className="game-title">Niveau 5: Optimizing - Amélioration Continue</h2>
          <p className="game-description">
            Optimisez l'organisation ! Choisissez les meilleures solutions d'amélioration continue
          </p>
        </div>

        {!gameActive && !gameComplete && (
          <motion.div
            className="start-screen"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <FaRocket className="start-icon" />
            <p>Résolvez {improvements.length} problèmes en 3 minutes !</p>
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
                Score: <strong>{score}/{improvements.length}</strong>
              </div>
            </div>

            <div className="improvements-container">
              {improvements.map((improvement, index) => {
                const selectedIndex = selectedSolutions[improvement.id];
                const isCorrect = selectedIndex === improvement.correct;
                const isAnswered = selectedIndex !== undefined;

                return (
                  <motion.div
                    key={improvement.id}
                    className={`improvement-card ${isAnswered ? (isCorrect ? 'correct' : 'incorrect') : ''}`}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.15, type: 'spring' }}
                  >
                    <div className="problem-header">
                      <span className="problem-number">{index + 1}.</span>
                      <h3 className="problem-text">Problème: {improvement.problem}</h3>
                    </div>
                    <p className="solution-prompt">Choisissez la meilleure solution :</p>
                    <div className="solutions-grid">
                      {improvement.solutions.map((solution, solIndex) => {
                        const isSelected = selectedIndex === solIndex;
                        return (
                          <motion.button
                            key={solIndex}
                            className={`solution-btn ${isSelected ? 'selected' : ''} ${isAnswered && solIndex === improvement.correct ? 'correct-solution' : ''} ${isAnswered && isSelected && !isCorrect ? 'wrong-solution' : ''}`}
                            onClick={() => handleSolutionSelect(improvement.id, solIndex)}
                            disabled={isAnswered || !gameActive || timeUp}
                            whileHover={!isAnswered ? { scale: 1.05, y: -3 } : {}}
                            whileTap={!isAnswered ? { scale: 0.95 } : {}}
                          >
                            {solution}
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
            <h2>Optimisation Terminée !</h2>
            <div className="score-display">
              <div className="score-value">{score} / {improvements.length}</div>
              <div className="score-percentage">
                {Math.round((score / improvements.length) * 100)}%
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
            gameName="Niveau 5: Optimizing" 
            onClose={() => setShowTop3(false)} 
          />
        )}
      </div>
    </section>
  );
};

export default Level5Optimizing;

