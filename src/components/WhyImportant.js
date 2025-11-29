import React from 'react';
import { motion } from 'framer-motion';
import { FaBug, FaClock, FaDollarSign, FaHeart } from 'react-icons/fa';
import './WhyImportant.css';

const WhyImportant = () => {
  const stats = [
    {
      icon: <FaBug />,
      number: '50%',
      label: 'Réduction des défauts',
      description: 'Moins de bugs grâce aux processus optimisés'
    },
    {
      icon: <FaClock />,
      number: '30%',
      label: 'Gain de temps',
      description: 'Livraisons plus rapides et prévisibles'
    },
    {
      icon: <FaDollarSign />,
      number: '40%',
      label: 'Réduction des coûts',
      description: 'Moins de réwork et de corrections'
    },
    {
      icon: <FaHeart />,
      number: '60%',
      label: 'Satisfaction client',
      description: 'Clients plus satisfaits avec des produits de qualité'
    }
  ];

  const reasons = [
    {
      title: 'Qualité Améliorée',
      description: 'Les processus CMMI garantissent que chaque étape du développement est contrôlée et vérifiée, résultant en des logiciels de meilleure qualité.',
      color: '#3b82f6'
    },
    {
      title: 'Prévisibilité',
      description: 'Avec CMMI, les projets sont mieux planifiés et les délais sont respectés. Plus de surprises désagréables !',
      color: '#8b5cf6'
    },
    {
      title: 'Réduction des Risques',
      description: 'Les risques sont identifiés tôt et gérés de manière proactive, évitant les problèmes majeurs en production.',
      color: '#10b981'
    },
    {
      title: 'Amélioration Continue',
      description: 'CMMI encourage la mesure et l\'amélioration continue, permettant à l\'organisation de grandir et de s\'améliorer constamment.',
      color: '#f59e0b'
    }
  ];

  return (
    <section className="why-important">
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="section-title">Pourquoi CMMI est Crucial ?</h2>
          <p className="section-description">
            Le CMMI transforme la façon dont les logiciels sont développés, 
            apportant des avantages mesurables et significatifs.
          </p>
        </motion.div>

        <div className="stats-grid">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="stat-card"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-number">{stat.number}</div>
              <div className="stat-label">{stat.label}</div>
              <div className="stat-description">{stat.description}</div>
            </motion.div>
          ))}
        </div>

        <div className="reasons-grid">
          {reasons.map((reason, index) => (
            <motion.div
              key={index}
              className="reason-card"
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.8 }}
              whileHover={{ y: -10 }}
            >
              <div 
                className="reason-indicator"
                style={{ backgroundColor: reason.color }}
              ></div>
              <h3 className="reason-title">{reason.title}</h3>
              <p className="reason-description">{reason.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyImportant;

