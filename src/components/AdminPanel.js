import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaTrophy, FaMedal, FaAward, FaLock, FaUsers, FaChartBar } from 'react-icons/fa';
import { getOverallRanking, clearAllScores, subscribeToScores } from '../utils/scoreManager';
import { getPlayerCMMILevel, CMMI_LEVELS } from '../utils/gameLock';
import Top3Leaderboard from './Top3Leaderboard';
import './AdminPanel.css';

const AdminPanel = ({ onClose }) => {
  // useNavigate doit être appelé inconditionnellement, mais on ne l'utilise que si onClose n'est pas fourni
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [allScores, setAllScores] = useState([]);
  const [overallRanking, setOverallRanking] = useState([]);
  const [activeTab, setActiveTab] = useState('overall');
  const [lastUpdateTime, setLastUpdateTime] = useState(Date.now());
  const [newScoresCount, setNewScoresCount] = useState(0);

  const ADMIN_PASSWORD = 'admin123'; // Simple password for demo

  useEffect(() => {
    if (isAuthenticated) {
      // Utiliser subscribeToScores pour les mises à jour en temps réel depuis Firestore
      const unsubscribe = subscribeToScores((newScores) => {
        setAllScores(prevScores => {
          const previousScoresCount = prevScores.length;
          
          // Détecter les nouveaux scores
          if (newScores.length > previousScoresCount) {
            setNewScoresCount(newScores.length - previousScoresCount);
            setLastUpdateTime(Date.now());
            // Réinitialiser le compteur après 3 secondes
            setTimeout(() => setNewScoresCount(0), 3000);
          }
          
          return newScores;
        });

        // Mettre à jour le classement général (async)
        getOverallRanking().then(async (ranking) => {
          // Récupérer les niveaux CMMI pour chaque joueur (async)
          const rankingWithLevelPromises = ranking.map(async (player) => {
            const cmmiLevel = await getPlayerCMMILevel(player.playerName);
            return {
              ...player,
              cmmiLevel,
              cmmiLevelName: cmmiLevel > 0 
                ? `Niveau ${cmmiLevel}: ${CMMI_LEVELS[cmmiLevel].name}`
                : 'Aucun niveau'
            };
          });
          
          const rankingWithLevel = await Promise.all(rankingWithLevelPromises);
          setOverallRanking(rankingWithLevel);
        }).catch(err => {
          console.error('Erreur lors de la mise à jour du classement:', err);
        });
      });
      
      return () => {
        if (unsubscribe) unsubscribe();
      };
    }
  }, [isAuthenticated]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      alert('Mot de passe incorrect');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
    if (onClose) {
      onClose();
    } else if (navigate) {
      // Si on est sur la page admin dédiée, rediriger vers la page d'accueil
      navigate('/');
    }
  };

  const handleClearScores = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir effacer tous les scores ?')) {
      await clearAllScores();
      // Les données seront mises à jour automatiquement via subscribeToScores
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-login-overlay">
        <motion.div
          className="admin-login"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="admin-login-header">
            <FaLock className="lock-icon" />
            <h2>Accès Admin</h2>
            <p>Entrez le mot de passe pour voir les classements</p>
          </div>
          <form onSubmit={handleLogin} className="admin-login-form">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe..."
              className="admin-password-input"
              required
              autoFocus
            />
            <button type="submit" className="admin-login-btn">
              Se connecter
            </button>
            {onClose && (
              <button type="button" className="admin-cancel-btn" onClick={onClose}>
                Annuler
              </button>
            )}
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="admin-panel-overlay">
      <motion.div
        className="admin-panel"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="admin-header">
          <div className="admin-title">
            <FaChartBar className="admin-icon" />
            <div>
              <h2>Panneau d'Administration</h2>
              <div className="real-time-indicator">
                <span className={`live-dot ${newScoresCount > 0 ? 'pulsing' : ''}`}></span>
                <span>Mise à jour en temps réel</span>
                {newScoresCount > 0 && (
                  <motion.span
                    className="new-scores-badge"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    +{newScoresCount} nouveau{newScoresCount > 1 ? 'x' : ''} score{newScoresCount > 1 ? 's' : ''}
                  </motion.span>
                )}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            {onClose && (
              <button className="admin-back-btn" onClick={onClose}>
                ← Retour au QR Code
              </button>
            )}
            <button className="admin-logout-btn" onClick={handleLogout}>
              Déconnexion
            </button>
          </div>
        </div>

        <div className="admin-tabs">
          <button
            className={`admin-tab ${activeTab === 'overall' ? 'active' : ''}`}
            onClick={() => setActiveTab('overall')}
          >
            <FaUsers /> Classement Général
          </button>
          <button
            className={`admin-tab ${activeTab === 'scores' ? 'active' : ''}`}
            onClick={() => setActiveTab('scores')}
          >
            <FaTrophy /> Tous les Scores
          </button>
          <button
            className={`admin-tab ${activeTab === 'top3' ? 'active' : ''}`}
            onClick={() => setActiveTab('top3')}
          >
            <FaMedal /> Top 3 Global
          </button>
        </div>

        <div className="admin-content">
          {activeTab === 'overall' && (
            <div className="admin-section">
              <h3>Classement Général des Étudiants</h3>
              <div className="ranking-table">
                <div className="table-header">
                  <div className="col-rank">#</div>
                  <div className="col-name">Nom</div>
                  <div className="col-level">Niveau CMMI</div>
                  <div className="col-games">Jeux Joués</div>
                  <div className="col-avg">Moyenne %</div>
                  <div className="col-total">Score Total</div>
                </div>
                {overallRanking.map((player, index) => {
                  const level = player.cmmiLevel || 0;
                  const levelColor = level > 0 ? CMMI_LEVELS[level].color : '#4a5568';
                  
                  return (
                    <motion.div
                      key={player.playerName}
                      className={`table-row ${index < 3 ? 'top-row' : ''}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <div className="col-rank">
                        {index === 0 && <FaTrophy className="trophy" style={{ color: '#fbbf24' }} />}
                        {index === 1 && <FaMedal className="medal" style={{ color: '#9ca3af' }} />}
                        {index === 2 && <FaAward className="award" style={{ color: '#d97706' }} />}
                        {index >= 3 && <span>{index + 1}</span>}
                      </div>
                      <div className="col-name">{player.playerName}</div>
                      <div className="col-level">
                        <span 
                          className="cmmi-level-badge"
                          style={{ 
                            backgroundColor: `${levelColor}20`,
                            borderColor: levelColor,
                            color: levelColor
                          }}
                        >
                          {player.cmmiLevelName || 'Aucun niveau'}
                        </span>
                      </div>
                      <div className="col-games">{player.gamesPlayed}</div>
                      <div className="col-avg">{player.averagePercentage}%</div>
                      <div className="col-total">{player.totalScore}</div>
                    </motion.div>
                  );
                })}
                {overallRanking.length === 0 && (
                  <div className="no-data">Aucun score enregistré</div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'scores' && (
            <div className="admin-section">
              <h3>Tous les Scores Enregistrés ({allScores.length})</h3>
              <div className="scores-list">
                {allScores
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .map((score, index) => (
                    <motion.div
                      key={score.id}
                      className="score-item"
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: index * 0.02 }}
                      layout
                      whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 255, 255, 0.08)' }}
                    >
                      <div className="score-player">{score.playerName}</div>
                      <div className="score-game">{score.gameName}</div>
                      <div className="score-details">
                        {score.score} / {score.maxScore} ({score.percentage}%)
                      </div>
                      <div className="score-date">
                        {new Date(score.date).toLocaleString('fr-FR')}
                      </div>
                    </motion.div>
                  ))}
                {allScores.length === 0 && (
                  <div className="no-data">Aucun score enregistré</div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'top3' && (
            <div className="admin-section">
              <Top3Leaderboard gameName={null} />
            </div>
          )}
        </div>

        <div className="admin-footer">
          <button className="clear-scores-btn" onClick={handleClearScores}>
            Effacer tous les scores
          </button>
          <div className="admin-stats">
            <span>Total étudiants: {overallRanking.length}</span>
            <span>Total scores: {allScores.length}</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminPanel;

