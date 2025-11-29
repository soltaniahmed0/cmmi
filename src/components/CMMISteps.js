import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle, FaLock, FaUser } from 'react-icons/fa';
import './CMMISteps.css';

const CMMISteps = () => {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const levels = [
    {
      level: 1,
      name: 'Initial',
      description: 'Début du parcours',
      color: '#ef4444',
      icon: '🚀',
      achievements: ['Processus informels', 'Dépendance aux individus'],
      unlockMessage: 'Vous avez commencé votre parcours CMMI !'
    },
    {
      level: 2,
      name: 'Managed',
      description: 'Premiers pas structurés',
      color: '#f59e0b',
      icon: '📋',
      achievements: ['Processus documentés', 'Planification de projets'],
      unlockMessage: 'Félicitations ! Vous avez atteint le niveau Managed !'
    },
    {
      level: 3,
      name: 'Defined',
      description: 'Standardisation en cours',
      color: '#3b82f6',
      icon: '📐',
      achievements: ['Processus standardisés', 'Formation organisée'],
      unlockMessage: 'Excellent ! Le niveau Defined est atteint !'
    },
    {
      level: 4,
      name: 'Quantitatively Managed',
      description: 'Maîtrise quantitative',
      color: '#8b5cf6',
      icon: '📊',
      achievements: ['Mesures quantitatives', 'Prédiction statistique'],
      unlockMessage: 'Impressionnant ! Vous maîtrisez la quantification !'
    },
    {
      level: 5,
      name: 'Optimizing',
      description: 'Excellence atteinte',
      color: '#10b981',
      icon: '🏆',
      achievements: ['Innovation continue', 'Optimisation des processus'],
      unlockMessage: 'Félicitations ! Vous avez atteint le niveau Optimizing !'
    }
  ];

  const handleNextLevel = () => {
    if (currentLevel < levels.length - 1 && !isAnimating) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentLevel(currentLevel + 1);
        setIsAnimating(false);
      }, 2000); // Animation plus douce et plus longue
    }
  };

  const handlePreviousLevel = () => {
    if (currentLevel > 0 && !isAnimating) {
      setCurrentLevel(currentLevel - 1);
    }
  };

  const resetJourney = () => {
    setCurrentLevel(0);
  };

  return (
    <section id="steps" className="cmmi-steps">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Votre Parcours vers l'Excellence CMMI</h2>
          <p className="section-description">
            Montez l'escalier de la qualité logicielle et découvrez chaque niveau de maturité CMMI.
            Chaque étape vous rapproche de l'excellence professionnelle.
          </p>
        </div>

        <div className="steps-container">
          {/* Person character with smooth climbing animation */}
          <div className="character-container">
            <motion.div
              className="character"
              animate={{
                bottom: `${20 + currentLevel * 180}px`,
                scale: [1, 1.15, 1],
                y: [0, -10, 0],
              }}
              transition={{
                duration: 2,
                ease: [0.4, 0, 0.2, 1], // Smooth cubic-bezier
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              <motion.div
                className="character-avatar"
                animate={{
                  rotateY: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <FaUser className="character-icon" />
              </motion.div>
              <motion.div 
                className="character-name"
                animate={{
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity
                }}
              >
                Vous
              </motion.div>
              {currentLevel > 0 && (
                <motion.div
                  className="progress-sparkles"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  ✨
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Stairs */}
          <div className="stairs-container">
            {levels.map((level, index) => {
              const isReached = index <= currentLevel;
              const isCurrent = index === currentLevel;
              
              return (
                <motion.div
                  key={level.level}
                  className={`step ${isReached ? 'unlocked' : 'locked'} ${isCurrent ? 'current' : ''}`}
                  style={{ 
                    borderColor: isReached ? level.color : '#4a5568',
                    backgroundColor: isReached ? `${level.color}20` : 'rgba(74, 85, 104, 0.1)'
                  }}
                  initial={{ opacity: 0, x: -50, y: 20 }}
                  animate={{ 
                    opacity: 1, 
                    x: 0,
                    y: isCurrent ? [-5, 5, -5] : 0,
                    boxShadow: isCurrent 
                      ? `0 0 40px ${level.color}80` 
                      : isReached 
                        ? `0 5px 20px ${level.color}40` 
                        : 'none',
                    scale: isCurrent ? [1, 1.02, 1] : 1
                  }}
                  transition={{ 
                    delay: index * 0.1, 
                    duration: 0.8,
                    ease: [0.4, 0, 0.2, 1],
                    y: {
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    },
                    scale: {
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }
                  }}
                  whileHover={isReached ? {
                    scale: 1.05,
                    y: -5,
                    boxShadow: `0 10px 30px ${level.color}60`
                  } : {}}
                  onClick={() => {
                    if (isReached) {
                      setCurrentLevel(index);
                    }
                  }}
                >
                  <div className="step-content">
                    <div className="step-icon">{level.icon}</div>
                    <div className="step-number">Niveau {level.level}</div>
                    <div className="step-name">{level.name}</div>
                    {isReached ? (
                      <FaCheckCircle className="check-icon" style={{ color: level.color }} />
                    ) : (
                      <FaLock className="lock-icon" />
                    )}
                  </div>
                  
                  {isCurrent && (
                    <motion.div
                      className="current-level-info"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <h4>Niveau Actuel</h4>
                      <p>{level.description}</p>
                      <div className="achievements-list">
                        {level.achievements.map((achievement, idx) => (
                          <div key={idx} className="achievement-item">
                            <span>✓</span> {achievement}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Control buttons */}
          <div className="steps-controls">
            <button
              className="control-btn prev-btn"
              onClick={handlePreviousLevel}
              disabled={currentLevel === 0 || isAnimating}
            >
              ⬅ Niveau Précédent
            </button>
            <motion.button
              className="control-btn next-btn"
              onClick={handleNextLevel}
              disabled={currentLevel === levels.length - 1 || isAnimating}
              whileHover={!isAnimating && currentLevel < levels.length - 1 ? { scale: 1.05, y: -2 } : {}}
              whileTap={!isAnimating ? { scale: 0.95 } : {}}
              style={{
                background: currentLevel < levels.length - 1 
                  ? `linear-gradient(135deg, ${levels[currentLevel + 1].color}, ${levels[currentLevel + 1].color}dd)`
                  : undefined
              }}
            >
              {isAnimating ? '⏳ En cours...' : currentLevel < levels.length - 1 ? 'Niveau Suivant ➡' : '🎉 Terminé !'}
            </motion.button>
            <button
              className="control-btn reset-btn"
              onClick={resetJourney}
              disabled={isAnimating}
            >
              🔄 Recommencer
            </button>
          </div>


        </div>

        {/* Progress bar */}
        <div className="progress-section">
          <div className="progress-header">
            <h3>Progression Globale</h3>
            <span className="progress-percentage">
              {Math.round((currentLevel + 1) / levels.length * 100)}%
            </span>
          </div>
          <div className="progress-bar">
            <motion.div
              className="progress-fill"
              initial={{ width: '20%' }}
              animate={{ 
                width: `${((currentLevel + 1) / levels.length) * 100}%`,
                background: `linear-gradient(90deg, ${levels[Math.min(currentLevel, levels.length - 1)].color}, ${levels[Math.min(currentLevel + 1, levels.length - 1)]?.color || levels[currentLevel].color})`
              }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
          </div>
          <p className="progress-text">
            {currentLevel === levels.length - 1 
              ? '🎉 Parcours complété ! Vous êtes un expert CMMI !'
              : `Prochain objectif : Atteindre le niveau ${levels[currentLevel + 1]?.name || 'Final'}`
            }
          </p>
        </div>
      </div>
    </section>
  );
};

export default CMMISteps;

