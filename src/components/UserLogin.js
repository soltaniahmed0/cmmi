import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaPlay, FaExclamationTriangle } from 'react-icons/fa';
import { savePlayerName, getPlayerName, checkPlayerNameExists } from '../utils/scoreManager';
import './UserLogin.css';

const UserLogin = ({ onLogin }) => {
  const [playerName, setPlayerName] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState('');
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    const checkAndLoadUser = async () => {
      const savedName = getPlayerName();
      if (savedName) {
        // Vérifier si l'utilisateur existe toujours dans la base de données
        const exists = await checkPlayerNameExists(savedName);
        if (exists) {
          setPlayerName(savedName);
          setIsLoggedIn(true);
          if (onLogin) onLogin(savedName);
        } else {
          // L'utilisateur a été supprimé, effacer le nom local
          localStorage.removeItem('cmmi_player_name');
        }
      }
    };
    checkAndLoadUser();
  }, [onLogin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedName = playerName.trim();
    
    if (!trimmedName) {
      setError('Veuillez entrer un nom');
      return;
    }

    setIsChecking(true);
    setError('');

    try {
      await savePlayerName(trimmedName);
      setIsLoggedIn(true);
      if (onLogin) onLogin(trimmedName);
    } catch (error) {
      setError(error.message || 'Ce nom est déjà utilisé. Veuillez choisir un autre nom.');
    } finally {
      setIsChecking(false);
    }
  };

  const handleLogout = () => {
    savePlayerName('');
    setIsLoggedIn(false);
    setPlayerName('');
  };

  if (isLoggedIn) {
    return (
      <motion.div
        className="user-logged-in"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="user-info">
          <FaUser className="user-icon" />
          <span className="user-name">{playerName}</span>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          Changer de nom
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="user-login"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="login-container">
        <div className="login-icon">
          <FaUser />
        </div>
        <h2>Entrez votre nom pour jouer</h2>
        <p className="login-subtitle">Vos scores seront enregistrés avec ce nom</p>
        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="text"
            value={playerName}
            onChange={(e) => {
              setPlayerName(e.target.value);
              setError(''); // Effacer l'erreur quand l'utilisateur tape
            }}
            placeholder="Votre nom..."
            className={`name-input ${error ? 'error' : ''}`}
            maxLength={20}
            required
            autoFocus
            disabled={isChecking}
          />
          {error && (
            <motion.div
              className="error-message"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <FaExclamationTriangle /> {error}
            </motion.div>
          )}
          <button type="submit" className="login-btn" disabled={isChecking}>
            {isChecking ? (
              <>⏳ Vérification...</>
            ) : (
              <>
                <FaPlay /> Commencer à jouer
              </>
            )}
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default UserLogin;

