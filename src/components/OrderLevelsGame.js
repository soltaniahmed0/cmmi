import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaGripVertical, FaTrophy, FaLock } from 'react-icons/fa';
import { saveScore, getPlayerName } from '../utils/scoreManager';
import { isGameLocked, CMMI_LEVELS } from '../utils/gameLock';
import Top3Leaderboard from './Top3Leaderboard';
import './OrderLevelsGame.css';

const OrderLevelsGame = () => {
  const [levels, setLevels] = useState([
    { id: 3, name: 'Defined', description: 'Processus standardisés', order: 3 },
    { id: 1, name: 'Initial', description: 'Processus imprévisibles', order: 1 },
    { id: 5, name: 'Optimizing', description: 'Amélioration continue', order: 5 },
    { id: 2, name: 'Managed', description: 'Processus gérés', order: 2 },
    { id: 4, name: 'Quantitatively Managed', description: 'Gestion quantitative', order: 4 }
  ]);
  
  const [draggedItem, setDraggedItem] = useState(null);
  const [gameComplete, setGameComplete] = useState(false);
  const [showTop3, setShowTop3] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    const playerName = getPlayerName();
    setIsLocked(isGameLocked('OrderLevels', playerName));
  }, []);

  const correctOrder = [1, 2, 3, 4, 5];

  const handleDragStart = (e, level) => {
    setDraggedItem(level);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    if (!draggedItem) return;

    const newLevels = [...levels];
    const draggedIndex = newLevels.findIndex(l => l.id === draggedItem.id);
    const targetItem = newLevels[targetIndex];

    // Swap items
    newLevels[draggedIndex] = targetItem;
    newLevels[targetIndex] = draggedItem;

    setLevels(newLevels);
    setDraggedItem(null);

    // Check if correct
    checkWin(newLevels);
  };

  const handleTouchStart = (e, level) => {
    setDraggedItem(level);
  };

  const handleTouchMove = (e, targetIndex) => {
    if (!draggedItem) return;
    e.preventDefault();
    
    const newLevels = [...levels];
    const draggedIndex = newLevels.findIndex(l => l.id === draggedItem.id);
    const targetItem = newLevels[targetIndex];

    if (draggedIndex !== targetIndex) {
      newLevels[draggedIndex] = targetItem;
      newLevels[targetIndex] = draggedItem;
      setLevels(newLevels);
    }
  };

  const handleTouchEnd = () => {
    if (draggedItem) {
      checkWin(levels);
      setDraggedItem(null);
    }
  };

  const checkWin = (currentLevels) => {
    const currentOrder = currentLevels.map(l => l.order);
    const isCorrect = JSON.stringify(currentOrder) === JSON.stringify(correctOrder);
    
    if (isCorrect && !gameComplete) {
      setGameComplete(true);
      // Save score
      const playerName = getPlayerName();
      if (playerName) {
        saveScore(playerName, 'OrderLevels', 5, 5); // Perfect score
      }
    }
  };

  const resetGame = () => {
    // Shuffle levels
    const shuffled = [...levels].sort(() => Math.random() - 0.5);
    setLevels(shuffled);
    setGameComplete(false);
  };

  const isCorrect = (index, order) => {
    if (!gameComplete) return false;
    return order === correctOrder[index];
  };

  if (isLocked) {
    return (
      <section id="order-levels" className="order-levels-section">
        <div className="container">
          <div className="locked-game-overlay">
            <FaLock className="lock-big-icon" />
            <h2>🔒 Étape Verrouillée</h2>
            <p>Vous devez d'abord compléter le Niveau 4: {CMMI_LEVELS[4].name} avec {CMMI_LEVELS[4].required}% ou plus.</p>
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
    <section id="order-levels" className="order-levels-section">
      <div className="container">
        <div className="game-header">
            <h2 className="game-title">Niveau 5: Ordre des Niveaux CMMI</h2>
            <p className="game-description">
              Dernière étape ! Organisez les niveaux dans le bon ordre (Niveau 5: Optimizing)
            </p>
        </div>

        {!gameComplete ? (
          <div className="game-container">
            <div className="instructions">
              <p>📱 <strong>Sur mobile:</strong> Maintenez et glissez pour réorganiser</p>
              <p>💻 <strong>Sur ordinateur:</strong> Glissez-déposez pour réorganiser</p>
            </div>

            <div className="levels-container">
              {levels.map((level, index) => {
                const levelColors = {
                  1: '#ef4444',
                  2: '#f59e0b',
                  3: '#3b82f6',
                  4: '#8b5cf6',
                  5: '#10b981'
                };

                return (
                  <motion.div
                    key={level.id}
                    className={`level-item ${draggedItem?.id === level.id ? 'dragging' : ''}`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, level)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, index)}
                    onTouchStart={(e) => handleTouchStart(e, level)}
                    onTouchMove={(e) => handleTouchMove(e, index)}
                    onTouchEnd={handleTouchEnd}
                    style={{ borderLeftColor: levelColors[level.order] }}
                    whileHover={!draggedItem ? { scale: 1.03, y: -3 } : {}}
                    whileDrag={{ scale: 1.15, opacity: 0.85, rotate: 3, zIndex: 1000 }}
                    whileTap={{ scale: 0.97 }}
                    initial={{ opacity: 0, y: 30, rotateX: -15 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    transition={{ delay: index * 0.1, type: 'spring', stiffness: 150 }}
                    layout
                  >
                    <FaGripVertical className="grip-icon" />
                    <div className="level-number" style={{ backgroundColor: levelColors[level.order] }}>
                      {index + 1}
                    </div>
                    <div className="level-info">
                      <h3 className="level-name">Niveau {level.order} - {level.name}</h3>
                      <p className="level-description">{level.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <button className="reset-btn" onClick={resetGame}>
              🔄 Réorganiser
            </button>
          </div>
        ) : (
          <motion.div
            className="game-complete"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="complete-content">
              <FaTrophy className="trophy-icon" />
              <h2>🎉 Excellent !</h2>
              <p>Vous avez correctement ordonné tous les niveaux CMMI !</p>
              
              <div className="correct-levels">
                {levels.map((level, index) => (
                  <motion.div
                    key={level.id}
                    className="correct-level-item"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <FaCheckCircle className="check-icon" />
                    <span>Niveau {level.order}: {level.name}</span>
                  </motion.div>
                ))}
              </div>

              <div className="game-buttons">
                <button className="replay-btn" onClick={resetGame}>
                  Rejouer
                </button>
                <button className="top3-btn" onClick={() => setShowTop3(true)}>
                  🏆 Voir le Top 3
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Top 3 Modal */}
        {showTop3 && (
          <Top3Leaderboard 
            gameName="OrderLevels" 
            onClose={() => setShowTop3(false)} 
          />
        )}
      </div>
    </section>
  );
};

export default OrderLevelsGame;

