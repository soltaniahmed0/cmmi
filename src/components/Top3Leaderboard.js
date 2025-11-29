import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaTrophy, FaMedal, FaAward } from 'react-icons/fa';
import { getTop3, getOverallRanking } from '../utils/scoreManager';
import './Top3Leaderboard.css';

const Top3Leaderboard = ({ gameName = null, onClose }) => {
  const [top3, setTop3] = useState([]);
  const [overallTop3, setOverallTop3] = useState([]);
  const [viewMode, setViewMode] = useState(gameName ? 'game' : 'overall');

  useEffect(() => {
    if (viewMode === 'game' && gameName) {
      const gameTop3 = getTop3(gameName);
      setTop3(gameTop3);
    } else {
      const overall = getOverallRanking();
      setOverallTop3(overall.slice(0, 3));
    }
  }, [viewMode, gameName]);

  const medals = [
    { icon: <FaTrophy />, color: '#fbbf24', position: '1er' },
    { icon: <FaMedal />, color: '#9ca3af', position: '2ème' },
    { icon: <FaAward />, color: '#d97706', position: '3ème' }
  ];

  const displayTop3 = viewMode === 'game' ? top3 : overallTop3;

  return (
    <motion.div
      className="top3-modal"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
    >
      <div className="top3-content">
        {onClose && (
          <button className="close-btn" onClick={onClose}>×</button>
        )}
        
        <div className="top3-header">
          <h2>🏆 Top 3</h2>
          {gameName && (
            <div className="view-toggle">
              <button
                className={viewMode === 'game' ? 'active' : ''}
                onClick={() => setViewMode('game')}
              >
                Ce Jeu
              </button>
              <button
                className={viewMode === 'overall' ? 'active' : ''}
                onClick={() => setViewMode('overall')}
              >
                Classement Général
              </button>
            </div>
          )}
        </div>

        <div className="top3-list">
          {displayTop3.length > 0 ? (
            displayTop3.map((entry, index) => {
              const medal = medals[index];
              const isPlayer = index < 3;

              return (
                <motion.div
                  key={entry.id || entry.playerName}
                  className={`top3-item ${isPlayer ? 'top' : ''} position-${index + 1}`}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="medal-icon" style={{ color: medal.color }}>
                    {medal.icon}
                  </div>
                  <div className="player-info">
                    <div className="player-name">{entry.playerName}</div>
                    {viewMode === 'game' ? (
                      <div className="player-score">
                        Score: {entry.score} / {entry.maxScore} ({entry.percentage}%)
                      </div>
                    ) : (
                      <div className="player-score">
                        Moyenne: {entry.averagePercentage}% | {entry.gamesPlayed} jeu{entry.gamesPlayed > 1 ? 'x' : ''}
                      </div>
                    )}
                  </div>
                  <div className="position-badge">{medal.position}</div>
                </motion.div>
              );
            })
          ) : (
            <div className="no-scores">
              <p>Aucun score enregistré pour le moment</p>
              <p className="hint">Soyez le premier à jouer !</p>
            </div>
          )}
        </div>

        {displayTop3.length === 0 && (
          <button className="close-modal-btn" onClick={onClose}>
            Fermer
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default Top3Leaderboard;

