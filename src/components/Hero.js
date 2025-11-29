import React from 'react';
import { motion } from 'framer-motion';
import { FaArrowDown } from 'react-icons/fa';
import './Hero.css';

const Hero = () => {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="hero">
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
            CMMI : La Clé de la{' '}
            <span className="highlight">Qualité Logicielle</span>
          </motion.h1>
          <motion.p
            className="hero-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Découvrez comment le Capability Maturity Model Integration transforme
            le développement logiciel et booste votre carrière professionnelle
          </motion.p>
          <motion.div
            className="hero-buttons"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <button
              className="btn-primary"
              onClick={() => scrollToSection('about')}
            >
              Commencer l'Exploration
            </button>
            <button
              className="btn-secondary"
              onClick={() => scrollToSection('steps')}
            >
              Monter l'Escalier CMMI 🪜
            </button>
            <button
              className="btn-secondary"
              onClick={() => scrollToSection('activities')}
            >
              Voir les Activités
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
            <div className="card-icon">🚀</div>
            <div className="card-text">Maturité</div>
          </div>
          <div className="floating-card card-2">
            <div className="card-icon">⚡</div>
            <div className="card-text">Performance</div>
          </div>
          <div className="floating-card card-3">
            <div className="card-icon">🎯</div>
            <div className="card-text">Qualité</div>
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
          onClick={() => scrollToSection('about')}
        >
          <FaArrowDown />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;

