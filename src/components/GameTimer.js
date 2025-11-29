import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaClock } from 'react-icons/fa';
import './GameTimer.css';

const GameTimer = ({ initialTime = 300, onTimeUp, gameActive = true }) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  // Réinitialiser le timer quand le jeu commence ou que initialTime change
  useEffect(() => {
    if (gameActive) {
      setTimeLeft(initialTime);
    }
  }, [gameActive, initialTime]);

  useEffect(() => {
    if (!gameActive || timeLeft <= 0) {
      if (timeLeft === 0 && gameActive && onTimeUp) {
        onTimeUp();
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (onTimeUp) {
            setTimeout(() => onTimeUp(), 100);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameActive, timeLeft, onTimeUp]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const percentage = (timeLeft / initialTime) * 100;
  const isWarning = timeLeft <= 60;
  const isCritical = timeLeft <= 30;

  return (
    <motion.div 
      className={`game-timer ${isWarning ? 'warning' : ''} ${isCritical ? 'critical' : ''}`}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="timer-icon">
        <FaClock />
      </div>
      <div className="timer-content">
        <div className="timer-text">{formatTime(timeLeft)}</div>
        <div className="timer-bar-container">
          <motion.div
            className="timer-bar-fill"
            initial={{ width: '100%' }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, ease: 'linear' }}
            style={{
              backgroundColor: isCritical 
                ? '#ef4444' 
                : isWarning 
                ? '#f59e0b' 
                : '#10b981'
            }}
          />
        </div>
      </div>
      {isCritical && (
        <motion.div
          className="timer-pulse"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1 }}
        >
          ⚠️
        </motion.div>
      )}
    </motion.div>
  );
};

export default GameTimer;

