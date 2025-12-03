import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle, FaTimesCircle, FaTrophy, FaLock } from 'react-icons/fa';
import { saveScore, getPlayerName } from '../utils/scoreManager';
import { isGameLocked, CMMI_LEVELS } from '../utils/gameLock';
import Top3Leaderboard from './Top3Leaderboard';
import ParticleEffect from './ParticleEffect';
import GameTimer from './GameTimer';
import './Level1Initial.css';

const Level1Initial = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
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
      const locked = await isGameLocked('Niveau 1: Initial', playerName);
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

  const questions = [
    {
      id: 1,
      question: 'Qu\'est-ce que CMMI signifie ?',
      options: [
        'Capability Maturity Model Integration',
        'Computer Management Model Interface',
        'Continuous Measurement Methodology Index',
        'Customer Management Model Implementation'
      ],
      correct: 0,
      explanation: 'CMMI signifie Capability Maturity Model Integration - un modèle d\'évaluation de la maturité des capacités d\'une organisation.'
    },
    {
      id: 2,
      question: 'Combien de niveaux de maturité CMMI existe-t-il ?',
      options: ['3', '4', '5', '6'],
      correct: 2,
      explanation: 'CMMI définit 5 niveaux de maturité : Initial, Managed, Defined, Quantitatively Managed, et Optimizing.'
    },
    {
      id: 3,
      question: 'Au Niveau 1 (Initial), comment sont les processus ?',
      options: [
        'Bien organisés et prévisibles',
        'Imprévisibles et réactifs',
        'Standardisés',
        'Optimisés'
      ],
      correct: 1,
      explanation: 'Au Niveau 1, les processus sont imprévisibles et réactifs. L\'organisation fonctionne de manière chaotique.'
    },
    {
      id: 4,
      question: 'Quel est le premier niveau que les organisations cherchent à atteindre ?',
      options: ['Niveau 1', 'Niveau 2', 'Niveau 3', 'Niveau 4'],
      correct: 1,
      explanation: 'Le Niveau 2 (Managed) est généralement le premier objectif, car il apporte une gestion de base au niveau du projet.'
    },
    {
      id: 5,
      question: 'CMMI peut être utilisé pour :',
      options: [
        'Uniquement le développement logiciel',
        'Développement logiciel, services, et acquisition',
        'Uniquement les services',
        'Uniquement l\'acquisition'
      ],
      correct: 1,
      explanation: 'CMMI peut être appliqué dans plusieurs domaines : développement logiciel, services, et acquisition.'
    }
  ];

  const handleTimeUp = () => {
    setTimeUp(true);
    setGameActive(false);
    // Calculer le score final avec les réponses actuelles
    let correctCount = 0;
    questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correct) {
        correctCount++;
      }
    });
    setScore(correctCount);
    setGameComplete(true);
    
    if (correctCount >= questions.length * 0.7) {
      setParticleTrigger(prev => prev + 1);
    }
    
    const playerName = getPlayerName();
    if (playerName) {
      saveScore(playerName, 'Niveau 1: Initial', correctCount, questions.length).catch(err => 
        console.error('Erreur lors de la sauvegarde du score:', err)
      );
    }
  };

  const startGame = () => {
    setGameActive(true);
    setTimeUp(false);
    setSelectedAnswers({});
    setGameComplete(false);
    setScore(0);
    setCurrentQuestion(0);
  };

  const handleAnswer = (questionId, answerIndex) => {
    if (!gameActive || timeUp || gameComplete) return;
    
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: answerIndex
    });
  };

  const submitQuiz = () => {
    setGameActive(false);
    let correctCount = 0;
    questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correct) {
        correctCount++;
      }
    });
    setScore(correctCount);
    setGameComplete(true);
    
    if (correctCount >= questions.length * 0.7) {
      setParticleTrigger(prev => prev + 1);
    }
    
    const playerName = getPlayerName();
    if (playerName) {
      saveScore(playerName, 'Niveau 1: Initial', correctCount, questions.length).catch(err => 
        console.error('Erreur lors de la sauvegarde du score:', err)
      );
    }
  };

  const resetGame = () => {
    setSelectedAnswers({});
    setGameComplete(false);
    setScore(0);
    setTimeUp(false);
    setGameActive(false);
    setCurrentQuestion(0);
  };

  if (isLocked) {
    return (
      <section id="level1-initial" className="level1-section">
        <div className="container">
          <div className="locked-game-overlay">
            <FaLock className="lock-big-icon" />
            <h2>🔒 Étape Verrouillée</h2>
            <p>Ce jeu est accessible à tous !</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="level1-initial" className="level1-section">
      <ParticleEffect trigger={particleTrigger} type="confetti" />
      <div className="container">
        <div className="game-header">
          <h2 className="game-title">Niveau 1: Initial - Découverte de CMMI</h2>
          <p className="game-description">
            Commencez votre parcours ! Découvrez les concepts fondamentaux du CMMI
          </p>
        </div>

        {!gameActive && !gameComplete && (
          <motion.div
            className="start-screen"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <p>Vous avez 3 minutes pour répondre à {questions.length} questions !</p>
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
            <div className="quiz-header">
              <GameTimer 
                initialTime={180}
                onTimeUp={handleTimeUp}
                gameActive={gameActive && !gameComplete}
              />
              <div className="progress-indicator">
                Question {currentQuestion + 1} / {questions.length}
              </div>
            </div>

            <motion.div
              key={currentQuestion}
              className="question-card"
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            >
              <h3 className="question-text">{questions[currentQuestion].question}</h3>
              
              <div className="options-grid">
                {questions[currentQuestion].options.map((option, index) => {
                  const isSelected = selectedAnswers[questions[currentQuestion].id] === index;
                  return (
                    <motion.button
                      key={index}
                      className={`option-btn ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleAnswer(questions[currentQuestion].id, index)}
                      whileHover={{ scale: 1.05, y: -3 }}
                      whileTap={{ scale: 0.95 }}
                      disabled={timeUp}
                    >
                      {option}
                    </motion.button>
                  );
                })}
              </div>

              <div className="navigation-buttons">
                <button
                  className="nav-btn"
                  onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                  disabled={currentQuestion === 0}
                >
                  ← Précédent
                </button>
                {currentQuestion < questions.length - 1 ? (
                  <button
                    className="nav-btn primary"
                    onClick={() => setCurrentQuestion(currentQuestion + 1)}
                  >
                    Suivant →
                  </button>
                ) : (
                  <button
                    className="nav-btn primary"
                    onClick={submitQuiz}
                  >
                    Terminer
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}

        {gameComplete && (
          <motion.div
            className="results-screen"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <FaTrophy className="trophy-icon" />
            <h2>Quiz Terminé !</h2>
            <div className="score-display">
              <div className="score-value">{score} / {questions.length}</div>
              <div className="score-percentage">
                {Math.round((score / questions.length) * 100)}%
              </div>
            </div>
            <div className="score-message">
              {score >= questions.length * 0.7 ? (
                <p className="success">🎉 Excellent ! Vous maîtrisez les bases de CMMI !</p>
              ) : (
                <p className="warning">💪 Continuez à apprendre ! Vous pouvez réessayer.</p>
              )}
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
            gameName="Niveau 1: Initial" 
            onClose={() => setShowTop3(false)} 
          />
        )}
      </div>
    </section>
  );
};

export default Level1Initial;

