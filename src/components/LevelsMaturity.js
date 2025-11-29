import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import './LevelsMaturity.css';

const LevelsMaturity = () => {
  const [expandedLevel, setExpandedLevel] = useState(null);

  const levels = [
    {
      level: 1,
      name: 'Initial',
      color: '#ef4444',
      description: 'Processus imprévisibles et réactifs',
      characteristics: [
        'Absence de processus définis',
        'Succès dépendant des individus',
        'Performance imprévisible',
        'Risques élevés de dépassements'
      ]
    },
    {
      level: 2,
      name: 'Managed',
      color: '#f59e0b',
      description: 'Processus gérés au niveau du projet',
      characteristics: [
        'Processus documentés',
        'Planification et suivi de projets',
        'Gestion de configuration',
        'Mesures de base'
      ]
    },
    {
      level: 3,
      name: 'Defined',
      color: '#3b82f6',
      description: 'Processus standardisés et intégrés',
      characteristics: [
        'Processus standardisés à l\'organisation',
        'Formation et support',
        'Intégration entre processus',
        'Amélioration continue initiée'
      ]
    },
    {
      level: 4,
      name: 'Quantitatively Managed',
      color: '#8b5cf6',
      description: 'Gestion quantitative et prédictive',
      characteristics: [
        'Mesures quantitatives avancées',
        'Prédiction statistique',
        'Performance stable et prévisible',
        'Objectifs mesurables'
      ]
    },
    {
      level: 5,
      name: 'Optimizing',
      color: '#10b981',
      description: 'Amélioration continue et innovation',
      characteristics: [
        'Innovation continue',
        'Optimisation des processus',
        'Prévention des défauts',
        'Culture d\'excellence'
      ]
    }
  ];

  const toggleLevel = (level) => {
    setExpandedLevel(expandedLevel === level ? null : level);
  };

  return (
    <section className="levels-maturity">
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="section-title">Les 5 Niveaux de Maturité CMMI</h2>
          <p className="section-description">
            CMMI définit 5 niveaux de maturité qui mesurent la capacité 
            d'une organisation à développer des logiciels de qualité.
          </p>
        </motion.div>

        <div className="levels-container">
          {levels.map((item, index) => (
            <motion.div
              key={item.level}
              className={`level-card ${expandedLevel === item.level ? 'expanded' : ''}`}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              style={{ borderLeftColor: item.color }}
              onClick={() => toggleLevel(item.level)}
            >
              <div className="level-header">
                <div className="level-number" style={{ backgroundColor: item.color }}>
                  Niveau {item.level}
                </div>
                <div className="level-info">
                  <h3 className="level-name">{item.name}</h3>
                  <p className="level-description">{item.description}</p>
                </div>
                <div className="expand-icon">
                  {expandedLevel === item.level ? <FaChevronUp /> : <FaChevronDown />}
                </div>
              </div>
              
              {expandedLevel === item.level && (
                <motion.div
                  className="level-details"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h4>Caractéristiques principales :</h4>
                  <ul className="characteristics-list">
                    {item.characteristics.map((char, idx) => (
                      <li key={idx}>{char}</li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          className="progress-visualization"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3>Progression vers l'Excellence</h3>
          <div className="progress-bar-container">
            {levels.map((item, index) => (
              <div
                key={item.level}
                className="progress-segment"
                style={{
                  backgroundColor: item.color,
                  width: `${100 / levels.length}%`
                }}
              >
                <span className="progress-label">N{item.level}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default LevelsMaturity;

