import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle, FaTimesCircle, FaSync, FaGripVertical, FaLock } from 'react-icons/fa';
import { saveScore, getPlayerName } from '../utils/scoreManager';
import { isGameLocked, CMMI_LEVELS } from '../utils/gameLock';
import Top3Leaderboard from './Top3Leaderboard';
import './ProcessDragDrop.css';

const ProcessDragDrop = () => {
  const [draggedItem, setDraggedItem] = useState(null);
  const [processes, setProcesses] = useState([
    { id: 1, name: 'Planification du Projet', category: null, correctCategory: 'Niveau 2' },
    { id: 2, name: 'Gestion de Configuration', category: null, correctCategory: 'Niveau 2' },
    { id: 3, name: 'Assurance Qualité', category: null, correctCategory: 'Niveau 2' },
    { id: 4, name: 'Mesure et Analyse', category: null, correctCategory: 'Niveau 2' },
    { id: 5, name: 'Processus Standardisés', category: null, correctCategory: 'Niveau 3' },
    { id: 6, name: 'Formation Organisationnelle', category: null, correctCategory: 'Niveau 3' },
    { id: 7, name: 'Intégration des Processus', category: null, correctCategory: 'Niveau 3' },
    { id: 8, name: 'Ingénierie Produit', category: null, correctCategory: 'Niveau 3' },
    { id: 9, name: 'Gestion Quantitative', category: null, correctCategory: 'Niveau 4' },
    { id: 10, name: 'Performance Organisationnelle', category: null, correctCategory: 'Niveau 4' },
    { id: 11, name: 'Analyse Causale', category: null, correctCategory: 'Niveau 5' },
    { id: 12, name: 'Innovation Organisationnelle', category: null, correctCategory: 'Niveau 5' }
  ]);

  const categories = [
    { id: 'Niveau 2', name: 'Niveau 2 - Managed', color: '#f59e0b', description: 'Processus gérés au niveau du projet' },
    { id: 'Niveau 3', name: 'Niveau 3 - Defined', color: '#3b82f6', description: 'Processus standardisés et intégrés' },
    { id: 'Niveau 4', name: 'Niveau 4 - Quantitatively Managed', color: '#8b5cf6', description: 'Gestion quantitative et prédictive' },
    { id: 'Niveau 5', name: 'Niveau 5 - Optimizing', color: '#10b981', description: 'Amélioration continue et innovation' }
  ];

  const [score, setScore] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [showTop3, setShowTop3] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    const playerName = getPlayerName();
    setIsLocked(isGameLocked('Drag & Drop Processus', playerName));
  }, []);

  const handleDragStart = (e, process) => {
    setDraggedItem(process);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, categoryId) => {
    e.preventDefault();
    if (draggedItem) {
      const updatedProcesses = processes.map(p =>
        p.id === draggedItem.id ? { ...p, category: categoryId } : p
      );
      setProcesses(updatedProcesses);
      
      // Check if correct
      if (draggedItem.correctCategory === categoryId) {
        setScore(score + 1);
      }
      
      // Check if game is complete
      const allPlaced = updatedProcesses.every(p => p.category !== null);
      if (allPlaced) {
        setGameComplete(true);
        // Save score when game is complete
        const playerName = getPlayerName();
        if (playerName) {
          const finalScore = calculateFinalScore();
          saveScore(playerName, 'Drag & Drop Processus', finalScore, processes.length);
        }
      }
      
      setDraggedItem(null);
    }
  };

  const removeProcess = (processId) => {
    setProcesses(processes.map(p =>
      p.id === processId ? { ...p, category: null } : p
    ));
  };

  const resetGame = () => {
    setProcesses(processes.map(p => ({ ...p, category: null })));
    setScore(0);
    setGameComplete(false);
  };

  const getProcessesByCategory = (categoryId) => {
    return processes.filter(p => p.category === categoryId);
  };

  const getUnassignedProcesses = () => {
    return processes.filter(p => p.category === null);
  };

  const calculateFinalScore = () => {
    return processes.filter(p => p.category === p.correctCategory).length;
  };

  const calculateScore = () => {
    return calculateFinalScore();
  };

  if (isLocked) {
    return (
      <section id="drag-drop" className="process-dragdrop-section">
        <div className="container">
          <div className="locked-game-overlay">
            <FaLock className="lock-big-icon" />
            <h2>🔒 Étape Verrouillée</h2>
            <p>Vous devez d'abord compléter le Niveau 2: {CMMI_LEVELS[2].name} avec {CMMI_LEVELS[2].required} paires minimum.</p>
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
    <section id="drag-drop" className="process-dragdrop-section">
      <div className="container">
        <div className="game-header">
          <h2 className="game-title">Niveau 3: Classer les Processus CMMI</h2>
          <p className="game-description">
            Classez les processus pour atteindre le Niveau 3: Defined (10 processus corrects minimum)
          </p>
          <div className="game-stats">
            <div className="stat">
              <span className="stat-label">Score :</span>
              <span className="stat-value">{calculateScore()} / {processes.length}</span>
            </div>
            <button className="reset-btn" onClick={resetGame}>
              <FaSync /> Réinitialiser
            </button>
          </div>
        </div>

        <div className="dragdrop-container">
          {/* Unassigned processes */}
          <div className="unassigned-section">
            <h3>📦 Processus à Classer</h3>
            <div className="unassigned-processes">
              {getUnassignedProcesses().map((process, idx) => (
                <motion.div
                  key={process.id}
                  className="process-item"
                  draggable
                  onDragStart={(e) => handleDragStart(e, process)}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileDrag={{ scale: 1.15, opacity: 0.9, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  style={{
                    cursor: 'grab',
                    WebkitTapHighlightColor: 'transparent'
                  }}
                >
                  <FaGripVertical className="drag-icon" />
                  <span>{process.name}</span>
                  {idx === 0 && getUnassignedProcesses().length > 0 && (
                    <motion.div
                      className="drag-hint"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      👆
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="categories-section">
            {categories.map((category) => {
              const categoryProcesses = getProcessesByCategory(category.id);
              const correctCount = categoryProcesses.filter(
                p => p.correctCategory === category.id
              ).length;

              return (
                <motion.div
                  key={category.id}
                  className="category-box"
                  style={{ borderColor: category.color }}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, category.id)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div 
                    className="category-header"
                    style={{ backgroundColor: `${category.color}20` }}
                  >
                    <h3 style={{ color: category.color }}>{category.name}</h3>
                    <p className="category-description">{category.description}</p>
                    <div className="category-score">
                      {correctCount} / {categoryProcesses.length} correct(s)
                    </div>
                  </div>
                  
                  <div className="category-processes">
                    {categoryProcesses.map((process) => {
                      const isCorrect = process.correctCategory === category.id;
                      return (
                        <motion.div
                          key={process.id}
                          className={`process-item placed ${isCorrect ? 'correct' : 'incorrect'}`}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          onClick={() => removeProcess(process.id)}
                        >
                          {isCorrect ? (
                            <FaCheckCircle className="status-icon correct-icon" />
                          ) : (
                            <FaTimesCircle className="status-icon incorrect-icon" />
                          )}
                          <span>{process.name}</span>
                        </motion.div>
                      );
                    })}
                    {categoryProcesses.length === 0 && (
                      <div className="empty-dropzone">
                        Déposez ici les processus du {category.name}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        <AnimatePresence>
          {gameComplete && (
            <motion.div
              className="completion-modal"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
            >
              <div className="completion-content">
                <div className="completion-icon">🎉</div>
                <h2>Félicitations !</h2>
                <p>Vous avez classé tous les processus !</p>
                <div className="final-score">
                  <strong>Score Final :</strong> {calculateScore()} / {processes.length}
                </div>
                <div className="score-percentage">
                  {Math.round((calculateScore() / processes.length) * 100)}% de réussite
                </div>
                <div className="completion-buttons">
                  <button className="completion-btn" onClick={resetGame}>
                    Rejouer
                  </button>
                  <button className="top3-btn" onClick={() => setShowTop3(true)}>
                    🏆 Voir le Top 3
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Top 3 Modal */}
        <AnimatePresence>
          {showTop3 && (
            <Top3Leaderboard 
              gameName="Drag & Drop Processus" 
              onClose={() => setShowTop3(false)} 
            />
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default ProcessDragDrop;

