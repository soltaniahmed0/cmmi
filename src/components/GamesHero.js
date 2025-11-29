import React from 'react';
import { motion } from 'framer-motion';
import { FaArrowDown } from 'react-icons/fa';
import './GamesHero.css';

const GamesHero = () => {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="games-hero">
      <div className="hero-container">
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            🎮 Jeux CMMI{' '}
            <span className="highlight">Interactifs</span>
          </motion.h1>
          <motion.p
            className="hero-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Découvrez les concepts CMMI à travers des jeux amusants et éducatifs.
            Testez vos connaissances et progressez dans votre apprentissage !
          </motion.p>
          <motion.div
            className="hero-buttons"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <button
              className="btn-primary"
              onClick={() => scrollToSection('progress')}
            >
              📈 Ma Progression
            </button>
            <button
              className="btn-secondary"
              onClick={() => scrollToSection('steps')}
            >
              🪜 Escalier CMMI
            </button>
            <button
              className="btn-secondary"
              onClick={() => scrollToSection('activities')}
            >
              🎯 Quiz
            </button>
            <button
              className="btn-secondary"
              onClick={() => scrollToSection('memory-game')}
            >
              🎴 Mémoire
            </button>
          </motion.div>
        </motion.div>
        <motion.div
          className="hero-visual"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <div className="floating-card card-1">
            <div className="card-icon">🎮</div>
            <div className="card-text">Jeux</div>
          </div>
          <div className="floating-card card-2">
            <div className="card-icon">🏆</div>
            <div className="card-text">Scores</div>
          </div>
          <div className="floating-card card-3">
            <div className="card-icon">🎯</div>
            <div className="card-text">Défis</div>
          </div>
          <div className="central-circle">
            <span>CMMI</span>
          </div>
        </motion.div>
        <motion.div
          className="scroll-indicator"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          onClick={() => scrollToSection('steps')}
        >
          <FaArrowDown />
        </motion.div>
      </div>
    </section>
  );
};

export default GamesHero;

