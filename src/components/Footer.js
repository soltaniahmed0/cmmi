import React from 'react';
import { FaGithub, FaLinkedin, FaEnvelope, FaRocket } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              <FaRocket className="logo-icon" />
              <span>CMMI Quality</span>
            </div>
            <p className="footer-description">
              Jeux interactifs et éducatifs pour apprendre CMMI 
              tout en s'amusant !
            </p>
          </div>

          <div className="footer-section">
            <h4 className="footer-title">Jeux</h4>
            <ul className="footer-links">
              <li><a href="#steps">Escalier CMMI</a></li>
              <li><a href="#activities">Quiz Interactif</a></li>
              <li><a href="#memory-game">Jeu de Mémoire</a></li>
              <li><a href="#drag-drop">Drag & Drop</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-title">Contact</h4>
            <div className="social-links">
              <a href="#" aria-label="GitHub">
                <FaGithub />
              </a>
              <a href="#" aria-label="LinkedIn">
                <FaLinkedin />
              </a>
              <a href="#" aria-label="Email">
                <FaEnvelope />
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2024 CMMI Quality. Tous droits réservés.</p>
          <p className="footer-note">
            Jeux interactifs CMMI - Apprenez en vous amusant !
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

