import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaTrophy, FaLock, FaShieldAlt } from 'react-icons/fa';
import { saveScore, getPlayerName } from '../utils/scoreManager';
import { isGameLocked, CMMI_LEVELS } from '../utils/gameLock';
import Top3Leaderboard from './Top3Leaderboard';
import ParticleEffect from './ParticleEffect';
import GameTimer from './GameTimer';
import './Level3Defined.css';

const Level3Defined = () => {
  const initialStandards = [
    { id: 1, name: 'Processus de Développement', category: null, correctCategory: 'Standardisé' },
    { id: 2, name: 'Processus de Test', category: null, correctCategory: 'Standardisé' },
    { id: 3, name: 'Processus de Documentation', category: null, correctCategory: 'Standardisé' },
    { id: 4, name: 'Processus de Revue', category: null, correctCategory: 'Standardisé' },
    { id: 5, name: 'Processus de Formation', category: null, correctCategory: 'Standardisé' },
    { id: 6, name: 'Méthode personnelle', category: null, correctCategory: 'Non Standardisé' },
    { id: 7, name: 'Processus improvisé', category: null, correctCategory: 'Non Standardisé' },
    { id: 8, name: 'Processus variable par projet', category: null, correctCategory: 'Non Standardisé' }
  ];

  const [standards, setStandards] = useState(initialStandards);

  const [score, setScore] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [showTop3, setShowTop3] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [particleTrigger, setParticleTrigger] = useState(0);
  const [timeUp, setTimeUp] = useState(false);
  const [gameActive, setGameActive] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);
  const [selectedStandard, setSelectedStandard] = useState(null); // Pour mobile: processus sélectionné

  React.useEffect(() => {
    const updateLockStatus = async () => {
      const playerName = getPlayerName();
      const locked = await isGameLocked('Niveau 3: Defined', playerName);
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

  const categories = [
    { id: 'Standardisé', name: 'Standardisé', color: '#3b82f6', icon: '✓' },
    { id: 'Non Standardisé', name: 'Non Standardisé', color: '#ef4444', icon: '✗' }
  ];

  const handleTimeUp = () => {
    setTimeUp(true);
    setGameActive(false);
    // Calculer le score final avec les réponses actuelles
    const correctCount = standards.filter(s => s.category === s.correctCategory).length;
    setGameComplete(true);
    const playerName = getPlayerName();
    if (playerName) {
      saveScore(playerName, 'Niveau 3: Defined', correctCount, standards.length).catch(err => 
        console.error('Erreur lors de la sauvegarde du score:', err)
      );
    }
  };

  const startGame = () => {
    setGameActive(true);
    setTimeUp(false);
    setStandards(initialStandards.map(s => ({ ...s, category: null })));
    setScore(0);
    setGameComplete(false);
  };

  // Gestion drag and drop (desktop)
  const handleDragStart = (e, standard) => {
    if (!gameActive || timeUp || standard.category) return;
    setDraggedItem(standard);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, categoryId) => {
    e.preventDefault();
    if (!draggedItem || !gameActive || timeUp) return;
    assignStandardToCategory(draggedItem, categoryId);
    setDraggedItem(null);
  };

  // Gestion tap/click (mobile-friendly)
  const handleStandardClick = (standard) => {
    if (!gameActive || timeUp || standard.category) return;
    // Si un processus est déjà sélectionné et qu'on clique sur le même, désélectionner
    if (selectedStandard?.id === standard.id) {
      setSelectedStandard(null);
    } else {
      setSelectedStandard(standard);
    }
  };

  const handleCategoryClick = (categoryId) => {
    if (!selectedStandard || !gameActive || timeUp) return;
    assignStandardToCategory(selectedStandard, categoryId);
    setSelectedStandard(null);
  };

  // Fonction commune pour assigner un processus à une catégorie
  const assignStandardToCategory = (standard, categoryId) => {
    const updatedStandards = standards.map(s =>
      s.id === standard.id ? { ...s, category: categoryId } : s
    );

    setStandards(updatedStandards);

    if (standard.correctCategory === categoryId) {
      setScore(prev => prev + 1);
      setParticleTrigger(prev => prev + 1);
    }

    const allClassified = updatedStandards.every(s => s.category !== null);
    if (allClassified) {
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
      const correctCount = standards.filter(s => s.category === s.correctCategory).length;
      saveScore(playerName, 'Niveau 3: Defined', correctCount, standards.length).catch(err => 
        console.error('Erreur lors de la sauvegarde du score:', err)
      );
    }
  };

  const resetGame = () => {
    setScore(0);
    setGameComplete(false);
    setTimeUp(false);
    setGameActive(false);
    setStandards(initialStandards.map(s => ({ ...s, category: null })));
    setSelectedStandard(null);
    setDraggedItem(null);
  };

  if (isLocked) {
    return (
      <section id="level3-defined" className="level3-section">
        <div className="container">
          <div className="locked-game-overlay">
            <FaLock className="lock-big-icon" />
            <h2>🔒 Étape Verrouillée</h2>
            <p>Vous devez d'abord compléter le Niveau 2: Managed.</p>
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
    <section id="level3-defined" className="level3-section">
      <ParticleEffect trigger={particleTrigger} type="confetti" />
      <div className="container">
        <div className="game-header">
          <h2 className="game-title">Niveau 3: Defined - Standardisation</h2>
          <p className="game-description">
            Standardisez les processus ! Classez chaque processus comme standardisé ou non standardisé
          </p>
        </div>

        {!gameActive && !gameComplete && (
          <motion.div
            className="start-screen"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <FaShieldAlt className="start-icon" />
            <p>Classez {standards.length} processus en 3 minutes !</p>
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
                Score: <strong>{score}/{standards.length}</strong>
              </div>
            </div>

            <div className="game-layout">
              {selectedStandard && (
                <motion.div
                  className="mobile-selection-hint"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <p>💡 {selectedStandard.name} sélectionné. Choisissez une catégorie ci-dessous.</p>
                </motion.div>
              )}
              <div className="standards-list">
                <h3 className="section-title">
                  Processus
                  <span className="mobile-hint"> (Appuyez pour sélectionner)</span>
                </h3>
                <div className="standards-container">
                  {standards.map((standard) => (
                    <motion.button
                      key={standard.id}
                      type="button"
                      className={`standard-item ${standard.category ? 'placed' : ''} ${draggedItem?.id === standard.id ? 'dragging' : ''} ${selectedStandard?.id === standard.id ? 'selected-mobile' : ''}`}
                      draggable={!standard.category && gameActive && !timeUp}
                      onDragStart={(e) => handleDragStart(e, standard)}
                      onClick={() => handleStandardClick(standard)}
                      whileDrag={{ scale: 1.1, rotate: 5, zIndex: 1000 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ 
                        opacity: standard.category ? 0.5 : 1,
                        y: 0 
                      }}
                      transition={{ type: 'spring', stiffness: 200 }}
                      disabled={!!standard.category || !gameActive || timeUp}
                    >
                      {standard.name}
                      {standard.category && (
                        <motion.div
                          className="check-mark"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                        >
                          <FaCheckCircle />
                        </motion.div>
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>

              <div className="categories-area">
                {categories.map((category) => {
                  const categoryStandards = standards.filter(s => s.category === category.id);
                  return (
                    <motion.button
                      key={category.id}
                      type="button"
                      className={`category-box ${selectedStandard ? 'category-active' : ''}`}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, category.id)}
                      onClick={() => handleCategoryClick(category.id)}
                      style={{ borderColor: category.color }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="category-header" style={{ backgroundColor: `${category.color}20` }}>
                        <span className="category-icon">{category.icon}</span>
                        <h3 className="category-name" style={{ color: category.color }}>
                          {category.name}
                        </h3>
                      </div>
                      <div className="category-items">
                        {categoryStandards.map((standard) => (
                          <motion.div
                            key={standard.id}
                            className="category-item"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring' }}
                          >
                            {standard.name}
                          </motion.div>
                        ))}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
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
            <h2>Standardisation Terminée !</h2>
            <div className="score-display">
              <div className="score-value">
                {standards.filter(s => s.category === s.correctCategory).length} / {standards.length}
              </div>
              <div className="score-percentage">
                {Math.round((standards.filter(s => s.category === s.correctCategory).length / standards.length) * 100)}%
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
            gameName="Niveau 3: Defined" 
            onClose={() => setShowTop3(false)} 
          />
        )}
      </div>
    </section>
  );
};

export default Level3Defined;

