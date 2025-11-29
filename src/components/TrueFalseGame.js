import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle, FaTimesCircle, FaTrophy, FaLock } from 'react-icons/fa';
import { saveScore, getPlayerName } from '../utils/scoreManager';
import { isGameLocked, CMMI_LEVELS } from '../utils/gameLock';
import Top3Leaderboard from './Top3Leaderboard';
import './TrueFalseGame.css';

const TrueFalseGame = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [showTop3, setShowTop3] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    const playerName = getPlayerName();
    setIsLocked(isGameLocked('TrueFalse', playerName));
  }, []);

  const questions = [
    {
      statement: 'CMMI Niveau 1 signifie que les processus sont bien organisés et prévisibles.',
      answer: false,
      explanation: 'Le Niveau 1 (Initial) signifie que les processus sont imprévisibles et réactifs, pas organisés.'
    },
    {
      statement: 'Au Niveau 2 CMMI, les processus sont gérés au niveau du projet.',
      answer: true,
      explanation: 'Correct ! Le Niveau 2 (Managed) implique que les processus sont documentés et gérés au niveau du projet.'
    },
    {
      statement: 'Le Niveau 3 CMMI implique la standardisation des processus à l\'échelle de l\'organisation.',
      answer: true,
      explanation: 'Parfait ! Le Niveau 3 (Defined) standardise les processus pour toute l\'organisation.'
    },
    {
      statement: 'Au Niveau 4, on utilise uniquement des mesures qualitatives.',
      answer: false,
      explanation: 'Faux. Le Niveau 4 (Quantitatively Managed) utilise des mesures quantitatives avancées pour la prédiction.'
    },
    {
      statement: 'Le Niveau 5 CMMI se concentre sur l\'amélioration continue et l\'innovation.',
      answer: true,
      explanation: 'Excellent ! Le Niveau 5 (Optimizing) est axé sur l\'amélioration continue et l\'optimisation des processus.'
    },
    {
      statement: 'CMMI peut seulement être utilisé pour le développement logiciel.',
      answer: false,
      explanation: 'Non, CMMI peut être utilisé pour différents domaines : développement logiciel, services, acquisition, etc.'
    },
    {
      statement: 'La certification CMMI nécessite une évaluation externe par un évaluateur certifié.',
      answer: true,
      explanation: 'Oui, pour une certification officielle, une évaluation externe par un évaluateur certifié CMMI est requise.'
    },
    {
      statement: 'Tous les projets d\'une organisation doivent être au même niveau CMMI.',
      answer: false,
      explanation: 'Non, différents projets peuvent avoir des niveaux différents. Le niveau organisationnel est une moyenne.'
    },
    {
      statement: 'Le Niveau 2 inclut la gestion de configuration et l\'assurance qualité.',
      answer: true,
      explanation: 'Correct ! Le Niveau 2 inclut effectivement la gestion de configuration, l\'assurance qualité, et la mesure.'
    },
    {
      statement: 'CMMI est obsolète et n\'est plus utilisé par les entreprises modernes.',
      answer: false,
      explanation: 'Faux. CMMI est toujours largement utilisé et reconnu par des milliers d\'entreprises dans le monde.'
    }
  ];

  const handleAnswer = (answer) => {
    if (showResult || gameComplete) return;

    setSelectedAnswer(answer);
    const isCorrect = answer === questions[currentQuestion].answer;
    
    if (isCorrect) {
      setScore(score + 1);
    }
    
    setShowResult(true);

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        setGameComplete(true);
        // Save score
        const playerName = getPlayerName();
        if (playerName) {
          const percentage = Math.round((score + (isCorrect ? 1 : 0)) / questions.length * 100);
          saveScore(playerName, 'TrueFalse', score + (isCorrect ? 1 : 0), questions.length);
        }
      }
    }, 2500);
  };

  const resetGame = () => {
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setGameComplete(false);
  };

  const progress = ((currentQuestion + (showResult ? 1 : 0)) / questions.length) * 100;
  const finalScore = gameComplete ? Math.round(score / questions.length * 100) : 0;

  if (isLocked) {
    return (
      <section id="truefalse" className="truefalse-section">
        <div className="container">
          <div className="locked-game-overlay">
            <FaLock className="lock-big-icon" />
            <h2>🔒 Étape Verrouillée</h2>
            <p>Vous devez d'abord compléter le Niveau 3: {CMMI_LEVELS[3].name} avec {CMMI_LEVELS[3].required} processus corrects.</p>
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
    <section id="truefalse" className="truefalse-section">
      <div className="container">
        <div className="game-header">
            <h2 className="game-title">Niveau 4: Vrai ou Faux CMMI</h2>
            <p className="game-description">
              Testez votre compréhension avancée des concepts CMMI (Niveau 4: Quantitatively Managed)
            </p>
        </div>

        {!gameComplete ? (
          <div className="game-container">
            {/* Progress Bar */}
            <div className="progress-bar-game">
              <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
              <span className="progress-text">Question {currentQuestion + 1} / {questions.length}</span>
            </div>

            {/* Question Card */}
            <motion.div
              key={currentQuestion}
              className="question-card"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
            >
              <div className="question-number">Question {currentQuestion + 1}</div>
              <h3 className="question-statement">{questions[currentQuestion].statement}</h3>
              
              {showResult && (
                <motion.div
                  className="explanation-box"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className={`result-icon ${selectedAnswer === questions[currentQuestion].answer ? 'correct' : 'incorrect'}`}>
                    {selectedAnswer === questions[currentQuestion].answer ? (
                      <FaCheckCircle />
                    ) : (
                      <FaTimesCircle />
                    )}
                  </div>
                  <p className="explanation-text">{questions[currentQuestion].explanation}</p>
                </motion.div>
              )}
            </motion.div>

            {/* Answer Buttons */}
            <div className="answer-buttons">
              <motion.button
                className={`answer-btn true-btn ${selectedAnswer === true && showResult ? (questions[currentQuestion].answer ? 'correct' : 'incorrect') : ''}`}
                onClick={() => handleAnswer(true)}
                disabled={showResult}
                whileHover={!showResult ? { scale: 1.05, y: -5 } : {}}
                whileTap={!showResult ? { scale: 0.95 } : {}}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <span className="btn-emoji">✅</span>
                <span className="btn-text">VRAI</span>
              </motion.button>
              <motion.button
                className={`answer-btn false-btn ${selectedAnswer === false && showResult ? (questions[currentQuestion].answer === false ? 'correct' : 'incorrect') : ''}`}
                onClick={() => handleAnswer(false)}
                disabled={showResult}
                whileHover={!showResult ? { scale: 1.05, y: -5 } : {}}
                whileTap={!showResult ? { scale: 0.95 } : {}}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <span className="btn-emoji">❌</span>
                <span className="btn-text">FAUX</span>
              </motion.button>
            </div>

            {/* Current Score */}
            <div className="current-score">
              Score actuel: {score} / {currentQuestion + (showResult ? 1 : 0)}
            </div>
          </div>
        ) : (
          <motion.div
            className="game-complete"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="complete-content">
              <FaTrophy className="trophy-icon" />
              <h2>Quiz Terminé !</h2>
              <div className="final-score-display">
                {score} / {questions.length}
              </div>
              <div className="score-percentage">
                {finalScore}% de bonnes réponses
              </div>
              <p className="score-message">
                {finalScore >= 80 ? '🎉 Excellent ! Vous maîtrisez CMMI !' :
                 finalScore >= 60 ? '👍 Bien joué ! Continuez à apprendre !' :
                 '💪 Bon début ! Continuez à pratiquer !'}
              </p>
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
        <AnimatePresence>
          {showTop3 && (
            <Top3Leaderboard 
              gameName="TrueFalse" 
              onClose={() => setShowTop3(false)} 
            />
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default TrueFalseGame;

