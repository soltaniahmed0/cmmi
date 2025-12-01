import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaPlay } from 'react-icons/fa';
import { savePlayerName, getPlayerName } from '../utils/scoreManager';
import './UserLogin.css';

const UserLogin = ({ onLogin }) => {
  const [playerName, setPlayerName] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const savedName = getPlayerName();
    if (savedName) {
      setPlayerName(savedName);
      setIsLoggedIn(true);
      if (onLogin) onLogin(savedName);
    }
  }, [onLogin]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (playerName.trim()) {
      savePlayerName(playerName.trim());
      setIsLoggedIn(true);
      if (onLogin) onLogin(playerName.trim());
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
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Votre nom..."
            className="name-input"
            maxLength={20}
            required
            autoFocus
          />
          <button type="submit" className="login-btn">
            <FaPlay /> Commencer à jouer
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default UserLogin;

