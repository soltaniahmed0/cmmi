import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaLock, FaStar, FaTrophy } from 'react-icons/fa';
import { getScores, getPlayerName } from '../utils/scoreManager';
import { CMMI_LEVELS, getPlayerCMMILevel, isGameLocked, getGameSectionId } from '../utils/gameLock';
import './ProgressTracker.css';

const ProgressTracker = () => {
  const [playerProgress, setPlayerProgress] = useState({});
  const [masteryLevel, setMasteryLevel] = useState(0);
  const [currentCMMILevel, setCurrentCMMILevel] = useState(0);

  const games = Object.keys(CMMI_LEVELS).map(levelNum => {
    const level = CMMI_LEVELS[levelNum];
    return {
      id: level.game,
      name: `Niveau ${levelNum}: ${level.name}`,
      icon: levelNum === '1' ? '🎯' : levelNum === '2' ? '🎴' : levelNum === '3' ? '🎲' : levelNum === '4' ? '✅' : '📊',
      description: level.description,
      required: level.required,
      section: getGameSectionId(level.game),
      level: parseInt(levelNum),
      levelInfo: level
    };
  });

  useEffect(() => {
    updateProgress();
    // Refresh progress every 2 seconds to check for new completions
    const interval = setInterval(updateProgress, 2000);
    return () => clearInterval(interval);
  }, []);

  const updateProgress = () => {
    const playerName = getPlayerName();
    if (!playerName) return;

    const scores = getScores();
    const playerScores = scores.filter(s => s.playerName === playerName);
    
    const progress = {};
    games.forEach(game => {
      const gameScores = playerScores.filter(s => s.gameName === game.id);
      if (gameScores.length > 0) {
        const bestScore = gameScores.sort((a, b) => {
          // Pour les jeux avec score absolu, trier par score, sinon par pourcentage
          if (game.level === 2 || game.level === 3) {
            return b.score - a.score;
          }
          return b.percentage - a.percentage;
        })[0];
        
        // Vérifier la complétion selon le type de jeu
        let completed = false;
        if (game.level === 2 || game.level === 3) {
          // Score absolu pour Mémoire et Drag & Drop
          completed = bestScore.score >= game.required;
        } else {
          // Pourcentage pour les autres
          completed = bestScore.percentage >= game.required;
        }
        
        progress[game.id] = {
          completed,
          bestScore: game.level === 2 || game.level === 3 ? bestScore.score : bestScore.percentage,
          attempts: gameScores.length,
          percentage: bestScore.percentage
        };
      } else {
        progress[game.id] = {
          completed: false,
          bestScore: 0,
          attempts: 0,
          percentage: 0
        };
      }
    });

    setPlayerProgress(progress);
    
    // Get current CMMI level
    const cmmiLevel = getPlayerCMMILevel(playerName);
    setCurrentCMMILevel(cmmiLevel);
    
    // Calculate mastery level
    const mastery = Math.floor((cmmiLevel / 5) * 100);
    setMasteryLevel(mastery);
  };

  const completedCount = Object.values(playerProgress).filter(p => p.completed).length;

  return (
    <section id="progress" className="progress-tracker">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">📈 Votre Progression CMMI</h2>
          <p className="section-description">
            Suivez votre apprentissage étape par étape et devenez un expert CMMI
          </p>
        </div>

        {/* Mastery Level */}
        <motion.div
          className="mastery-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ borderColor: currentCMMILevel > 0 ? CMMI_LEVELS[currentCMMILevel].color : '#4a5568' }}
        >
          <div className="mastery-header">
            <FaTrophy className="trophy-icon" style={{ color: currentCMMILevel > 0 ? CMMI_LEVELS[currentCMMILevel].color : '#a0aec0' }} />
            <div>
              <h3>Niveau CMMI Atteint</h3>
              <p>
                {currentCMMILevel > 0 
                  ? `Niveau ${currentCMMILevel}: ${CMMI_LEVELS[currentCMMILevel].name}`
                  : 'Aucun niveau atteint'
                }
              </p>
            </div>
          </div>
          <div className="mastery-bar-container">
            <motion.div
              className="mastery-bar"
              initial={{ width: 0 }}
              animate={{ width: `${masteryLevel}%` }}
              transition={{ duration: 1 }}
              style={{ 
                background: currentCMMILevel > 0 
                  ? `linear-gradient(90deg, ${CMMI_LEVELS[currentCMMILevel].color} 0%, ${CMMI_LEVELS[Math.min(currentCMMILevel + 1, 5)].color} 100%)`
                  : 'linear-gradient(90deg, #4a5568 0%, #718096 100%)'
              }}
            >
              <span className="mastery-percentage">{masteryLevel}%</span>
            </motion.div>
          </div>
          <div className="mastery-level-badge" style={{ 
            backgroundColor: currentCMMILevel > 0 ? `${CMMI_LEVELS[currentCMMILevel].color}20` : 'rgba(74, 85, 104, 0.2)',
            borderColor: currentCMMILevel > 0 ? CMMI_LEVELS[currentCMMILevel].color : '#4a5568'
          }}>
            {currentCMMILevel === 5 ? '🏆 Niveau 5: Optimizing - Expert CMMI' :
             currentCMMILevel === 4 ? '⭐ Niveau 4: Quantitatively Managed' :
             currentCMMILevel === 3 ? '📚 Niveau 3: Defined' :
             currentCMMILevel === 2 ? '🎯 Niveau 2: Managed' :
             currentCMMILevel === 1 ? '🌱 Niveau 1: Initial' : '🔒 Aucun niveau atteint'}
          </div>
        </motion.div>

        {/* Games Progress */}
        <div className="games-progress">
          <h3 className="progress-subtitle">Étapes du Parcours CMMI</h3>
          <p className="progress-note">
            Complétez chaque niveau pour débloquer le suivant
          </p>
          <div className="games-list">
            {games.map((game, index) => {
              const progress = playerProgress[game.id] || { completed: false, bestScore: 0, attempts: 0, percentage: 0 };
              const isLocked = isGameLocked(game.id);
              const prerequisite = game.level > 1 ? games[game.level - 2] : null;
              
              return (
                <motion.div
                  key={game.id}
                  className={`game-progress-card ${progress.completed ? 'completed' : ''} ${isLocked ? 'locked' : ''}`}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => {
                    if (isLocked) {
                      alert(`🔒 Cette étape est verrouillée. Vous devez d'abord compléter le Niveau ${game.level - 1}: ${prerequisite?.levelInfo?.name || ''}.`);
                      return;
                    }
                    const sectionId = game.section || game.id.toLowerCase().replace(/\s+/g, '-');
                    const element = document.getElementById(sectionId);
                    if (element) element.scrollIntoView({ behavior: 'smooth' });
                  }}
                  style={{ borderLeftColor: isLocked ? '#4a5568' : game.levelInfo.color }}
                >
                  <div className="step-number-badge" style={{ 
                    backgroundColor: isLocked ? '#4a5568' : game.levelInfo.color 
                  }}>
                    N{game.level}
                  </div>
                  
                  <div className="game-icon">{game.icon}</div>
                  <div className="game-info">
                    <h4>{game.name}</h4>
                    <p>{game.description}</p>
                    {isLocked ? (
                      <div className="lock-message">
                        🔒 Verrouillé - Complétez le Niveau {game.level - 1} d'abord
                      </div>
                    ) : (
                      <div className="game-requirements">
                        Objectif: {game.required}{game.level === 2 || game.level === 3 ? '' : '%'} | 
                        Votre meilleur: {game.level === 2 || game.level === 3 ? progress.bestScore : progress.percentage}% | 
                        Tentatives: {progress.attempts}
                      </div>
                    )}
                  </div>
                  <div className="game-status">
                    {progress.completed ? (
                      <FaCheckCircle className="status-icon completed-icon" />
                    ) : isLocked ? (
                      <FaLock className="status-icon locked-icon" />
                    ) : (
                      <FaStar className="status-icon available-icon" />
                    )}
                  </div>
                  {progress.bestScore > 0 && !isLocked && (
                    <div className="progress-mini-bar">
                      <div 
                        className="progress-mini-fill" 
                        style={{ 
                          width: `${game.level === 2 || game.level === 3 
                            ? Math.min((progress.bestScore / game.required) * 100, 100)
                            : Math.min(progress.percentage, 100)}%`
                        }}
                      />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Next Steps */}
        {completedCount < games.length && (
          <motion.div
            className="next-steps"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3>🎯 Prochaines Étapes</h3>
            <p>
              {completedCount === 0 
                ? 'Commencez par le Quiz CMMI pour apprendre les bases !'
                : `Continuez avec les autres jeux pour atteindre 100% de maîtrise !`
              }
            </p>
          </motion.div>
        )}

        {completedCount === games.length && (
          <motion.div
            className="certification-badge"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            <FaStar className="star-icon" />
            <h3>🎉 Félicitations !</h3>
            <p>Vous avez complété tous les jeux et maîtrisé CMMI !</p>
            <div className="certificate">Certificat CMMI Master</div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default ProgressTracker;

