import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './Header.css';

const Header = ({ onAdminClick }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.header
      className={`header ${scrolled ? 'scrolled' : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="header-container">
        <div className="logo">
          <span className="logo-icon">🎯</span>
          <span className="logo-text">CMMI Games</span>
        </div>
        <nav className="nav">
          <button onClick={() => scrollToSection('progress')}>📈 Progression</button>
          <button onClick={() => scrollToSection('steps')}>🪜 Escalier</button>
          <button onClick={() => scrollToSection('activities')}>🎯 Quiz</button>
          <button onClick={() => scrollToSection('memory-game')}>🎴 Mémoire</button>
          <button onClick={() => scrollToSection('drag-drop')}>🎲 Processus</button>
          {onAdminClick && (
            <button 
              className="admin-btn" 
              onClick={onAdminClick}
              title="Accès Admin"
            >
              🔐 Admin
            </button>
          )}
        </nav>
      </div>
    </motion.header>
  );
};

export default Header;

