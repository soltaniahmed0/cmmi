import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle, FaTimesCircle, FaTrophy, FaLock, FaProjectDiagram } from 'react-icons/fa';
import { saveScore, getPlayerName } from '../utils/scoreManager';
import { isGameLocked, CMMI_LEVELS } from '../utils/gameLock';
import Top3Leaderboard from './Top3Leaderboard';
import ParticleEffect from './ParticleEffect';
import GameTimer from './GameTimer';
import './Level2Managed.css';

const Level2Managed = () => {
  const [projects, setProjects] = useState([
    { id: 1, name: 'Projet Alpha', tasks: ['Planification', 'Exécution', 'Suivi'], completed: [] },
    { id: 2, name: 'Projet Beta', tasks: ['Planification', 'Exécution', 'Contrôle'], completed: [] },
    { id: 3, name: 'Projet Gamma', tasks: ['Planification', 'Exécution', 'Mesure'], completed: [] }
  ]);
  
  const [currentProject, setCurrentProject] = useState(0);
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
      setIsLocked(isGameLocked('Niveau 2: Managed', playerName));
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

  const processOrder = ['Planification', 'Exécution', 'Suivi', 'Contrôle', 'Mesure'];
  const correctSequence = ['Planification', 'Exécution', 'Suivi'];

  const handleTimeUp = () => {
    setTimeUp(true);
    setGameActive(false);
    // Calculer le score final avec les projets actuels
    const finalScore = projects.filter(p => {
      const correctOrder = correctSequence.filter(t => p.tasks.includes(t));
      return p.completed.length === correctOrder.length &&
             correctOrder.every((t, idx) => p.completed[idx] === t);
    }).length;
    
    setGameComplete(true);
    const playerName = getPlayerName();
    if (playerName) {
      saveScore(playerName, 'Niveau 2: Managed', finalScore, projects.length);
    }
  };

  const startGame = () => {
    setGameActive(true);
    setTimeUp(false);
    setProjects([
      { id: 1, name: 'Projet Alpha', tasks: ['Planification', 'Exécution', 'Suivi'], completed: [] },
      { id: 2, name: 'Projet Beta', tasks: ['Planification', 'Exécution', 'Contrôle'], completed: [] },
      { id: 3, name: 'Projet Gamma', tasks: ['Planification', 'Exécution', 'Mesure'], completed: [] }
    ]);
    setCurrentProject(0);
    setScore(0);
    setGameComplete(false);
  };

  const handleTaskComplete = (projectId, task) => {
    if (!gameActive || timeUp) return;

    const project = projects.find(p => p.id === projectId);
    if (!project || project.completed.includes(task)) return;

    const updatedProjects = projects.map(p => {
      if (p.id === projectId) {
        const newCompleted = [...p.completed, task];
        // Vérifier si les tâches sont dans le bon ordre
        const correctOrder = correctSequence.filter(t => p.tasks.includes(t));
        const isCorrect = correctOrder.every((t, idx) => newCompleted[idx] === t);
        
        if (isCorrect && newCompleted.length === correctOrder.length) {
          setParticleTrigger(prev => prev + 1);
          setScore(prev => prev + 1);
        }
        
        return { ...p, completed: newCompleted };
      }
      return p;
    });

    setProjects(updatedProjects);

    // Vérifier si tous les projets sont complétés
    const allCompleted = updatedProjects.every(p => 
      p.completed.length === p.tasks.length
    );

    if (allCompleted) {
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
      // Calculer le score final basé sur l'état actuel des projets
      const finalScore = projects.filter(p => {
        const correctOrder = correctSequence.filter(t => p.tasks.includes(t));
        return p.completed.length === correctOrder.length &&
               correctOrder.every((t, idx) => p.completed[idx] === t);
      }).length;
      saveScore(playerName, 'Niveau 2: Managed', finalScore, projects.length);
    }
  };

  const resetGame = () => {
    setScore(0);
    setGameComplete(false);
    setTimeUp(false);
    setGameActive(false);
    setCurrentProject(0);
    setProjects([
      { id: 1, name: 'Projet Alpha', tasks: ['Planification', 'Exécution', 'Suivi'], completed: [] },
      { id: 2, name: 'Projet Beta', tasks: ['Planification', 'Exécution', 'Contrôle'], completed: [] },
      { id: 3, name: 'Projet Gamma', tasks: ['Planification', 'Exécution', 'Mesure'], completed: [] }
    ]);
  };

  if (isLocked) {
    return (
      <section id="level2-managed" className="level2-section">
        <div className="container">
          <div className="locked-game-overlay">
            <FaLock className="lock-big-icon" />
            <h2>🔒 Étape Verrouillée</h2>
            <p>Vous devez d'abord compléter le Niveau 1: Initial.</p>
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

  const currentProjectData = projects[currentProject];

  return (
    <section id="level2-managed" className="level2-section">
      <ParticleEffect trigger={particleTrigger} type="confetti" />
      <div className="container">
        <div className="game-header">
          <h2 className="game-title">Niveau 2: Managed - Gestion de Projet</h2>
          <p className="game-description">
            Gérez les projets ! Organisez les processus dans le bon ordre pour chaque projet
          </p>
        </div>

        {!gameActive && !gameComplete && (
          <motion.div
            className="start-screen"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <FaProjectDiagram className="start-icon" />
            <p>Gérez {projects.length} projets en 3 minutes !</p>
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
              <div className="score-badge">Score: <strong>{score}/{projects.length}</strong></div>
              <div className="project-indicator">
                Projet {currentProject + 1} / {projects.length}
              </div>
            </div>

            <div className="projects-container">
              {projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  className={`project-card ${index === currentProject ? 'active' : ''}`}
                  onClick={() => setCurrentProject(index)}
                  whileHover={{ scale: 1.02 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <h3 className="project-name">{project.name}</h3>
                  <div className="tasks-container">
                    {project.tasks.map((task, taskIndex) => {
                      const isCompleted = project.completed.includes(task);
                      const isClickable = !isCompleted && 
                        (project.completed.length === 0 || 
                         processOrder.indexOf(task) > processOrder.indexOf(project.completed[project.completed.length - 1]));
                      
                      return (
                        <motion.button
                          key={taskIndex}
                          className={`task-btn ${isCompleted ? 'completed' : ''} ${isClickable ? 'clickable' : ''}`}
                          onClick={() => handleTaskComplete(project.id, task)}
                          disabled={!isClickable || !gameActive || timeUp || index !== currentProject}
                          whileHover={isClickable ? { scale: 1.1, y: -5 } : {}}
                          whileTap={isClickable ? { scale: 0.95 } : {}}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: taskIndex * 0.1, type: 'spring' }}
                        >
                          {isCompleted ? <FaCheckCircle /> : <span className="task-number">{taskIndex + 1}</span>}
                          <span>{task}</span>
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              ))}
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
            <h2>Gestion Terminée !</h2>
            <div className="score-display">
              <div className="score-value">{score} / {projects.length}</div>
              <div className="score-percentage">
                {Math.round((score / projects.length) * 100)}%
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
            gameName="Niveau 2: Managed" 
            onClose={() => setShowTop3(false)} 
          />
        )}
      </div>
    </section>
  );
};

export default Level2Managed;

