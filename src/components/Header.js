import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './Header.css';

const Header = ({ onAdminClick, showAdminLink = true }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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
      setMenuOpen(false);
    }
  };

  const handleAdminClick = () => {
    if (onAdminClick) {
      onAdminClick();
      setMenuOpen(false);
    }
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuOpen && !e.target.closest('.header-container')) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener('click', handleClickOutside);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

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
        <button 
          className={`menu-toggle ${menuOpen ? 'active' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        <nav className={`nav ${menuOpen ? 'active' : ''}`}>
          <button onClick={() => scrollToSection('progress')}>📊 Progression</button>
          <button onClick={() => scrollToSection('level1-initial')}>🔴 Niveau 1: Initial</button>
          <button onClick={() => scrollToSection('level2-managed')}>🟠 Niveau 2: Managed</button>
          <button onClick={() => scrollToSection('level3-defined')}>🔵 Niveau 3: Defined</button>
          <button onClick={() => scrollToSection('level4-quantitatively-managed')}>🟣 Niveau 4: Quantitatively Managed</button>
          <button onClick={() => scrollToSection('level5-optimizing')}>🟢 Niveau 5: Optimizing</button>
          {showAdminLink && onAdminClick && (
            <button 
              className="admin-btn" 
              onClick={handleAdminClick}
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

