import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle, FaTimesCircle, FaTrophy, FaLightbulb } from 'react-icons/fa';
import { saveScore, getPlayerName } from '../utils/scoreManager';
import Top3Leaderboard from './Top3Leaderboard';
import './InteractiveActivities.css';

const InteractiveActivities = () => {
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [score, setScore] = useState(0);
  const [showTop3, setShowTop3] = useState(false);

  const quizQuestions = [
    {
      id: 1,
      question: 'Quel est le niveau CMMI le plus élevé ?',
      options: ['Niveau 3', 'Niveau 4', 'Niveau 5', 'Niveau 6'],
      correct: 2,
      explanation: 'Le niveau 5 (Optimizing) est le niveau le plus élevé, où l\'organisation se concentre sur l\'amélioration continue.'
    },
    {
      id: 2,
      question: 'Quel avantage principal apporte CMMI aux étudiants ?',
      options: [
        'Réduction des coûts',
        'Amélioration des compétences et opportunités de carrière',
        'Augmentation de la productivité',
        'Réduction des bugs'
      ],
      correct: 1,
      explanation: 'CMMI offre une amélioration complète des compétences et ouvre de nombreuses opportunités de carrière dans les entreprises de premier plan.'
    },
    {
      id: 3,
      question: 'Combien de niveaux de maturité CMMI existe-t-il ?',
      options: ['3', '4', '5', '6'],
      correct: 2,
      explanation: 'CMMI définit 5 niveaux de maturité : Initial, Managed, Defined, Quantitatively Managed, et Optimizing.'
    },
    {
      id: 4,
      question: 'Quelle entreprise est connue pour utiliser CMMI depuis plus de 20 ans ?',
      options: ['Google', 'IBM', 'Apple', 'Amazon'],
      correct: 1,
      explanation: 'IBM utilise CMMI depuis plus de 20 ans et a atteint le niveau 5, devenant une référence mondiale.'
    },
    {
      id: 5,
      question: 'Quel est l\'impact moyen sur le salaire avec une compréhension de CMMI ?',
      options: ['+10%', '+20%', '+30-50%', '+60%'],
      correct: 2,
      explanation: 'Les professionnels avec une compréhension de CMMI gagnent en moyenne 30-50% de plus que leurs pairs.'
    }
  ];

  const scenarioActivities = [
    {
      title: 'Scénario 1: Projet en Dérive',
      situation: 'Un projet de développement logiciel dépasse constamment les délais et le budget.',
      challenge: 'Comment CMMI peut-il aider ?',
      solutions: [
        'Planification et estimation améliorées (Niveau 2)',
        'Processus standardisés et prévisibles (Niveau 3)',
        'Mesures quantitatives pour prédire les problèmes (Niveau 4)',
        'Amélioration continue pour optimiser les processus (Niveau 5)'
      ],
      correctSolution: 'Tous les niveaux contribuent à résoudre ce problème'
    },
    {
      title: 'Scénario 2: Qualité Inconstante',
      situation: 'Certains projets sont excellents, d\'autres sont médiocres. La qualité varie considérablement.',
      challenge: 'Quelle approche CMMI résout ce problème ?',
      solutions: [
        'Niveau 1 - Travailler plus dur',
        'Niveau 3 - Standardisation des processus',
        'Niveau 4 - Mesures quantitatives',
        'Niveau 5 - Optimisation continue'
      ],
      correctSolution: 'Niveau 3 - La standardisation garantit une qualité constante'
    },
    {
      title: 'Scénario 3: Équipe Inexpérimentée',
      situation: 'Une nouvelle équipe manque d\'expérience et commet beaucoup d\'erreurs.',
      challenge: 'Comment CMMI soutient-il l\'équipe ?',
      solutions: [
        'Formation et documentation (Niveau 3)',
        'Mentoring et partage de connaissances',
        'Processus clairement définis',
        'Toutes les réponses ci-dessus'
      ],
      correctSolution: 'Toutes - CMMI fournit structure, formation et meilleures pratiques'
    }
  ];

  const handleQuizAnswer = (questionId, answerIndex) => {
    if (!quizSubmitted) {
      setQuizAnswers({
        ...quizAnswers,
        [questionId]: answerIndex
      });
    }
  };

  const submitQuiz = () => {
    let correctCount = 0;
    quizQuestions.forEach((q) => {
      if (quizAnswers[q.id] === q.correct) {
        correctCount++;
      }
    });
    setScore(correctCount);
    setQuizSubmitted(true);
    
    // Save score
    const playerName = getPlayerName();
    if (playerName) {
      saveScore(playerName, 'Quiz CMMI', correctCount, quizQuestions.length);
    }
  };

  const resetQuiz = () => {
    setQuizAnswers({});
    setQuizSubmitted(false);
    setScore(0);
  };

  const handleScenarioClick = (index) => {
    setSelectedLevel(selectedLevel === index ? null : index);
  };

  return (
    <section id="activities" className="interactive-activities">
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="section-title">Niveau 1: Quiz CMMI</h2>
          <p className="section-description">
            Commencez votre parcours ! Testez vos connaissances de base (Niveau 1: Initial)
          </p>
        </motion.div>

        {/* Quiz Section */}
        <motion.div
          className="activity-section"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h3 className="activity-title">🎯 Quiz de Connaissances CMMI</h3>
          <div className="quiz-container">
            {quizQuestions.map((question, index) => {
              const userAnswer = quizAnswers[question.id];
              const isCorrect = userAnswer === question.correct;
              
              return (
                <div key={question.id} className="quiz-question">
                  <div className="question-header">
                    <span className="question-number">Question {index + 1}</span>
                    {quizSubmitted && (
                      <span className={`result-icon ${isCorrect ? 'correct' : 'incorrect'}`}>
                        {isCorrect ? <FaCheckCircle /> : <FaTimesCircle />}
                      </span>
                    )}
                  </div>
                  <h4 className="question-text">{question.question}</h4>
                  <div className="options-grid">
                    {question.options.map((option, optIndex) => {
                      const isSelected = userAnswer === optIndex;
                      const showCorrect = quizSubmitted && optIndex === question.correct;
                      const showIncorrect = quizSubmitted && isSelected && !isCorrect;
                      
                      return (
                        <motion.button
                          key={optIndex}
                          className={`option-btn ${
                            isSelected ? 'selected' : ''
                          } ${showCorrect ? 'correct-answer' : ''} ${
                            showIncorrect ? 'incorrect-answer' : ''
                          }`}
                          onClick={() => handleQuizAnswer(question.id, optIndex)}
                          disabled={quizSubmitted}
                          whileHover={!quizSubmitted ? { scale: 1.05, y: -2 } : {}}
                          whileTap={!quizSubmitted ? { scale: 0.95 } : {}}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: optIndex * 0.1 }}
                          style={{
                            cursor: quizSubmitted ? 'default' : 'pointer'
                          }}
                        >
                          <span className="option-letter">
                            {String.fromCharCode(65 + optIndex)}
                          </span>
                          <span className="option-text">{option}</span>
                          {showCorrect && (
                            <motion.span
                              className="check-mark"
                              initial={{ scale: 0, rotate: -180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{ type: 'spring', stiffness: 200 }}
                            >
                              ✓
                            </motion.span>
                          )}
                          {showIncorrect && (
                            <motion.span
                              className="cross-mark"
                              initial={{ scale: 0, rotate: 180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{ type: 'spring', stiffness: 200 }}
                            >
                              ✗
                            </motion.span>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                  {quizSubmitted && (
                    <motion.div
                      className="explanation"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.3 }}
                    >
                      <FaLightbulb className="explanation-icon" />
                      <span>{question.explanation}</span>
                    </motion.div>
                  )}
                </div>
              );
            })}

            {!quizSubmitted ? (
              <button className="submit-quiz-btn" onClick={submitQuiz}>
                Soumettre le Quiz
              </button>
            ) : (
              <motion.div
                className="quiz-results"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="results-content">
                  <FaTrophy className="trophy-icon" />
                  <h3>Résultats du Quiz</h3>
                  <div className="score-display">
                    {score} / {quizQuestions.length}
                  </div>
                  <p className="score-message">
                    {score === quizQuestions.length
                      ? 'Excellent ! Vous maîtrisez parfaitement CMMI ! 🎉'
                      : score >= quizQuestions.length * 0.7
                      ? 'Bien joué ! Vous avez une bonne compréhension de CMMI ! 👍'
                      : 'Continuez à apprendre ! CMMI est une compétence précieuse ! 💪'}
                  </p>
                  <div className="quiz-result-buttons">
                    <button className="reset-quiz-btn" onClick={resetQuiz}>
                      Réessayer
                    </button>
                    <button 
                      className="top3-btn" 
                      onClick={() => setShowTop3(true)}
                    >
                      🏆 Voir le Top 3
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Scenario Activities */}
        <motion.div
          className="activity-section"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h3 className="activity-title">📚 Scénarios Pratiques</h3>
          <div className="scenarios-container">
            {scenarioActivities.map((scenario, index) => (
              <motion.div
                key={index}
                className={`scenario-card ${selectedLevel === index ? 'expanded' : ''}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                onClick={() => handleScenarioClick(index)}
              >
                <div className="scenario-header">
                  <h4 className="scenario-title">{scenario.title}</h4>
                </div>
                <div className="scenario-content">
                  <div className="situation-box">
                    <strong>Situation :</strong>
                    <p>{scenario.situation}</p>
                  </div>
                  <div className="challenge-box">
                    <strong>Défi :</strong>
                    <p>{scenario.challenge}</p>
                  </div>
                  {selectedLevel === index && (
                    <motion.div
                      className="solutions-box"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <strong>Solutions CMMI :</strong>
                      <ul className="solutions-list">
                        {scenario.solutions.map((solution, solIndex) => (
                          <li key={solIndex}>{solution}</li>
                        ))}
                      </ul>
                      <div className="correct-solution">
                        <strong>💡 Réponse :</strong> {scenario.correctSolution}
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Top 3 Modal */}
        <AnimatePresence>
          {showTop3 && (
            <Top3Leaderboard 
              gameName="Quiz CMMI" 
              onClose={() => setShowTop3(false)} 
            />
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default InteractiveActivities;

