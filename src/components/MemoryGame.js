import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle, FaTimesCircle, FaSync, FaLock } from 'react-icons/fa';
import { saveScore, getPlayerName } from '../utils/scoreManager';
import { isGameLocked, CMMI_LEVELS } from '../utils/gameLock';
import Top3Leaderboard from './Top3Leaderboard';
import './MemoryGame.css';

const MemoryGame = () => {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());
  const [showTop3, setShowTop3] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    const playerName = getPlayerName();
    setIsLocked(isGameLocked('Jeu de Mémoire', playerName));
  }, []);

  const cardPairs = [
    { id: 1, term: 'CMMI', definition: 'Capability Maturity Model Integration' },
    { id: 2, term: 'Niveau 1', definition: 'Initial - Processus imprévisibles' },
    { id: 3, term: 'Niveau 2', definition: 'Managed - Processus gérés' },
    { id: 4, term: 'Niveau 3', definition: 'Defined - Processus standardisés' },
    { id: 5, term: 'Niveau 4', definition: 'Quantitatively Managed' },
    { id: 6, term: 'Niveau 5', definition: 'Optimizing - Excellence' },
    { id: 7, term: 'Processus', definition: 'Ensemble d\'activités structurées' },
    { id: 8, term: 'Qualité', definition: 'Conformité aux exigences' }
  ];

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const allCards = [
      ...cardPairs.map(pair => ({ ...pair, type: 'term', pairId: pair.id })),
      ...cardPairs.map(pair => ({ ...pair, type: 'definition', pairId: pair.id }))
    ];

    // Shuffle cards
    const shuffled = allCards.sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFlippedCards([]);
    setMatchedPairs([]);
    setMoves(0);
    setGameWon(false);
    setStartTime(Date.now());
  };

  const handleCardClick = (index) => {
    if (isProcessing || flippedCards.includes(index) || matchedPairs.includes(cards[index].pairId)) {
      return;
    }

    const newFlipped = [...flippedCards, index];
    setFlippedCards(newFlipped);
    setMoves(moves + 1);

    if (newFlipped.length === 2) {
      setIsProcessing(true);
      const [firstIndex, secondIndex] = newFlipped;
      const firstCard = cards[firstIndex];
      const secondCard = cards[secondIndex];

      if (firstCard.pairId === secondCard.pairId && firstCard.type !== secondCard.type) {
        // Match found
        setTimeout(() => {
          const newMatchedPairs = [...matchedPairs, firstCard.pairId];
          setMatchedPairs(newMatchedPairs);
          setFlippedCards([]);
          setIsProcessing(false);

          if (newMatchedPairs.length === cardPairs.length) {
            // Check win condition with correct matched pairs count
            if (newMatchedPairs.length === cardPairs.length) {
              setGameWon(true);
              // Save score when game is won
              const playerName = getPlayerName();
              if (playerName) {
                const timeSpent = Math.round((Date.now() - startTime) / 1000);
                const calculatedScore = Math.max(0, 1000 - (moves + 1 - cardPairs.length) * 10);
                // Save with correct score format for level 2 (number of pairs matched)
                saveScore(playerName, 'Jeu de Mémoire', newMatchedPairs.length, cardPairs.length, timeSpent);
              }
            }
          }
        }, 1000);
      } else {
        // No match
        setTimeout(() => {
          setFlippedCards([]);
          setIsProcessing(false);
        }, 1500);
      }
    }
  };

  if (isLocked) {
    return (
      <section id="memory-game" className="memory-game-section">
        <div className="container">
          <div className="locked-game-overlay">
            <FaLock className="lock-big-icon" />
            <h2>🔒 Étape Verrouillée</h2>
            <p>Vous devez d'abord compléter le Niveau 1: {CMMI_LEVELS[1].name} avec {CMMI_LEVELS[1].required}% ou plus.</p>
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
    <section id="memory-game" className="memory-game-section">
      <div className="container">
        <div className="game-header">
          <h2 className="game-title">Niveau 2: Jeu de Mémoire CMMI</h2>
          <p className="game-description">
            Mémorisez les concepts clés pour atteindre le Niveau 2: Managed (6 paires minimum)
          </p>
          <div className="game-stats">
            <div className="stat">
              <span className="stat-label">Coups :</span>
              <span className="stat-value">{moves}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Paires trouvées :</span>
              <span className="stat-value">{matchedPairs.length} / {cardPairs.length}</span>
            </div>
            <button className="reset-btn" onClick={initializeGame}>
              <FaSync /> Nouvelle Partie
            </button>
          </div>
        </div>

        <div className="cards-grid">
          {cards.map((card, index) => {
            const isFlipped = flippedCards.includes(index);
            const isMatched = matchedPairs.includes(card.pairId);
            const showContent = isFlipped || isMatched;

            return (
              <motion.div
                key={`${card.pairId}-${card.type}-${index}`}
                className={`memory-card ${isMatched ? 'matched' : ''} ${isFlipped ? 'flipped' : ''}`}
                onClick={() => handleCardClick(index)}
                whileHover={!isMatched && !isProcessing ? { scale: 1.08, y: -5 } : {}}
                whileTap={!isMatched && !isProcessing ? { scale: 0.92 } : {}}
                initial={{ opacity: 0, rotateY: 180, scale: 0.8 }}
                animate={{ 
                  opacity: 1, 
                  rotateY: showContent ? 0 : 180,
                  scale: isMatched ? 0.95 : 1
                }}
                transition={{ 
                  duration: 0.4,
                  type: 'spring',
                  stiffness: 200,
                  damping: 20
                }}
                style={{
                  cursor: isMatched || isProcessing ? 'default' : 'pointer',
                  WebkitTapHighlightColor: 'transparent'
                }}
              >
                <div className="card-front">
                  <div className="card-icon">🎴</div>
                  <p>Cliquez pour retourner</p>
                </div>
                <div className="card-back">
                  <div className={`card-type ${card.type}`}>
                    {card.type === 'term' ? '📝 Terme' : '📖 Définition'}
                  </div>
                  <div className="card-content">
                    {card.type === 'term' ? card.term : card.definition}
                  </div>
                  {isMatched && (
                    <motion.div
                      className="match-indicator"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <FaCheckCircle />
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        <AnimatePresence>
          {gameWon && (
            <motion.div
              className="win-modal"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
            >
              <div className="win-content">
                <div className="win-icon">🏆</div>
                <h2>Félicitations !</h2>
                <p>Vous avez complété le jeu de mémoire en {moves} coups !</p>
                <div className="win-stats">
                  <div className="win-stat">
                    <strong>Score :</strong> {Math.max(0, 1000 - (moves - cardPairs.length) * 10)} points
                  </div>
                </div>
                <div className="win-buttons">
                  <button className="win-btn" onClick={initializeGame}>
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
              gameName="Jeu de Mémoire" 
              onClose={() => setShowTop3(false)} 
            />
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default MemoryGame;

