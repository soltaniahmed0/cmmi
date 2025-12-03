import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle, FaTimesCircle, FaTrophy, FaLock, FaClipboardList } from 'react-icons/fa';
import { saveScore, getPlayerName } from '../utils/scoreManager';
import { isGameLocked } from '../utils/gameLock';
import Top3Leaderboard from './Top3Leaderboard';
import ParticleEffect from './ParticleEffect';
import GameTimer from './GameTimer';
import './Level2Managed.css';

const Level2Managed = () => {
  const questions = [
    {
      id: 1,
      question: 'Au niveau 2 CMMI, quel est l\'objectif principal de la gestion de projet ?',
      options: [
        'Développer rapidement sans planification',
        'Gérer les projets de manière contrôlée avec des processus documentés',
        'Improviser selon les besoins du moment',
        'Se concentrer uniquement sur le code'
      ],
      correct: 1,
      explanation: 'Au niveau 2 (Managed), les projets sont gérés de manière contrôlée avec des processus documentés et établis.'
    },
    {
      id: 2,
      question: 'Quelle pratique est essentielle au niveau 2 CMMI ?',
      options: [
        'Planification de projet',
        'Optimisation continue',
        'Innovation aléatoire',
        'Aucune documentation'
      ],
      correct: 0,
      explanation: 'La planification de projet est une pratique fondamentale du niveau 2 Managed.'
    },
    {
      id: 3,
      question: 'Au niveau 2, comment sont gérées les exigences ?',
      options: [
        'Elles ne sont pas documentées',
        'Elles sont gérées et tracées de manière contrôlée',
        'Elles changent librement sans contrôle',
        'Elles sont ignorées'
      ],
      correct: 1,
      explanation: 'Au niveau 2, les exigences sont gérées et tracées de manière contrôlée.'
    },
    {
      id: 4,
      question: 'Qu\'est-ce que la "mesure et analyse" au niveau 2 ?',
      options: [
        'Ignorer les métriques',
        'Collecter et analyser des données pour comprendre la performance du projet',
        'Mesurer uniquement le temps',
        'Ne rien mesurer'
      ],
      correct: 1,
      explanation: 'La mesure et analyse permet de collecter et analyser des données pour comprendre la performance.'
    },
    {
      id: 5,
      question: 'Qu\'est-ce qui distingue le niveau 2 du niveau 1 ?',
      options: [
        'Rien, ils sont identiques',
        'Le niveau 2 introduit la gestion de projet contrôlée et des processus documentés',
        'Le niveau 2 supprime toute planification',
        'Le niveau 2 est moins structuré'
      ],
      correct: 1,
      explanation: 'Le niveau 2 introduit la gestion de projet contrôlée et des processus documentés, contrairement au niveau 1 qui est chaotique.'
    }
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [showTop3, setShowTop3] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [particleTrigger, setParticleTrigger] = useState(0);
  const [timeUp, setTimeUp] = useState(false);
  const [gameActive, setGameActive] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  React.useEffect(() => {
    const updateLockStatus = async () => {
      const playerName = getPlayerName();
      const locked = await isGameLocked('Niveau 2: Managed', playerName);
      setIsLocked(locked);
    };
    
    updateLockStatus();
    
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
      saveScore(playerName, 'Niveau 2: Managed', correctCount, questions.length).catch(err => 
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
    setShowExplanation(false);
  };

  const handleAnswer = (questionId, answerIndex) => {
    if (!gameActive || timeUp || gameComplete || showExplanation) return;
    
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: answerIndex
    });
    
    // Afficher l'explication
    setShowExplanation(true);
    
    // Vérifier si la réponse est correcte
    const question = questions.find(q => q.id === questionId);
    if (question && answerIndex === question.correct) {
      setParticleTrigger(prev => prev + 1);
    }
    
    // Passer à la question suivante après un délai
    setTimeout(() => {
      setShowExplanation(false);
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        submitQuiz();
      }
    }, 2000);
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
      saveScore(playerName, 'Niveau 2: Managed', correctCount, questions.length).catch(err => 
        console.error('Erreur lors de la sauvegarde du score:', err)
      );
    }
  };

  const resetGame = () => {
    setScore(0);
    setGameComplete(false);
    setTimeUp(false);
    setGameActive(false);
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setShowExplanation(false);
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

  return (
    <section id="level2-managed" className="level2-section">
      <ParticleEffect trigger={particleTrigger} type="confetti" />
      <div className="container">
        <div className="game-header">
          <h2 className="game-title">Niveau 2: Managed - Gestion de Projet</h2>
          <p className="game-description">
            Testez vos connaissances sur la gestion contrôlée de projet au niveau 2 CMMI
          </p>
        </div>

        {!gameActive && !gameComplete && (
          <motion.div
            className="start-screen"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <FaClipboardList className="start-icon" />
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
                  const isCorrect = index === questions[currentQuestion].correct;
                  const showResult = showExplanation && isSelected;
                  
                  return (
                    <motion.button
                      key={index}
                      className={`option-btn ${isSelected ? 'selected' : ''} ${showResult ? (isCorrect ? 'correct' : 'incorrect') : ''}`}
                      onClick={() => handleAnswer(questions[currentQuestion].id, index)}
                      whileHover={{ scale: 1.05, y: -3 }}
                      whileTap={{ scale: 0.95 }}
                      disabled={timeUp || showExplanation}
                    >
                      {showResult && (
                        <span className="result-icon">
                          {isCorrect ? <FaCheckCircle /> : <FaTimesCircle />}
                        </span>
                      )}
                      {option}
                    </motion.button>
                  );
                })}
              </div>

              {showExplanation && (
                <motion.div
                  className="explanation-box"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <p>{questions[currentQuestion].explanation}</p>
                </motion.div>
              )}
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
            <div className="result-message">
              {score >= questions.length * 0.7 ? (
                <p className="success-message">🎉 Excellent ! Vous maîtrisez la gestion de projet !</p>
              ) : (
                <p className="encourage-message">💪 Continuez à apprendre, vous y êtes presque !</p>
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
            gameName="Niveau 2: Managed" 
            onClose={() => setShowTop3(false)} 
          />
        )}
      </div>
    </section>
  );
};

export default Level2Managed;
