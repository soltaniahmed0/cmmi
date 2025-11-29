import React from 'react';
import { motion } from 'framer-motion';
import { FaBuilding, FaChartLine, FaAward, FaUsers } from 'react-icons/fa';
import './RealExamples.css';

const RealExamples = () => {
  const examples = [
    {
      company: 'Boeing',
      industry: 'Aérospatiale',
      icon: <FaBuilding />,
      achievement: 'Réduction de 80% des défauts critiques',
      story: 'Boeing a utilisé CMMI pour améliorer la qualité de ses systèmes logiciels embarqués. Résultat : une réduction spectaculaire des défauts et une amélioration de la sécurité aérienne.',
      impact: '+300% de confiance client',
      color: '#3b82f6'
    },
    {
      company: 'Lockheed Martin',
      industry: 'Défense',
      icon: <FaChartLine />,
      achievement: 'Livraison 35% plus rapide',
      story: 'Lockheed Martin a atteint le niveau CMMI 5, permettant des livraisons plus rapides et prévisibles de projets complexes de défense.',
      impact: 'Économie de $2M par projet',
      color: '#8b5cf6'
    },
    {
      company: 'IBM',
      industry: 'Technologie',
      icon: <FaAward />,
      achievement: 'Niveau CMMI 5 certifié',
      story: 'IBM utilise CMMI depuis plus de 20 ans, devenant un leader mondial en qualité logicielle et servant de modèle pour l\'industrie.',
      impact: 'Référence mondiale',
      color: '#10b981'
    },
    {
      company: 'Accenture',
      industry: 'Services IT',
      icon: <FaUsers />,
      achievement: '95% de satisfaction client',
      story: 'Accenture a standardisé ses processus avec CMMI, permettant une qualité constante sur tous ses projets clients à travers le monde.',
      impact: '150+ projets certifiés',
      color: '#f59e0b'
    }
  ];

  const caseStudies = [
    {
      title: 'Projet NASA - Système de Navigation',
      before: 'Défauts critiques en production, retards fréquents',
      after: 'Zéro défaut critique, livraison dans les délais',
      improvement: '98% de réduction des bugs',
      metrics: ['Temps de développement : -40%', 'Coûts : -30%', 'Satisfaction : +85%']
    },
    {
      title: 'Banque Européenne - Plateforme Transactionnelle',
      before: 'Pannes fréquentes, perte de données',
      after: 'Système stable 99.9% du temps, sécurité renforcée',
      improvement: '99.9% de disponibilité',
      metrics: ['Disponibilité : +50%', 'Sécurité : +90%', 'Performance : +60%']
    },
    {
      title: 'E-Commerce - Application Mobile',
      before: 'Crashes fréquents, mauvaise expérience utilisateur',
      after: 'Application stable, excellente note utilisateur',
      improvement: '4.8/5 étoiles',
      metrics: ['Crashes : -95%', 'Temps de réponse : -70%', 'Retention : +120%']
    }
  ];

  return (
    <section id="examples" className="real-examples">
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="section-title">Exemples Réels de Succès</h2>
          <p className="section-description">
            Découvrez comment des entreprises de renommée mondiale ont transformé 
            leur qualité logicielle grâce au CMMI.
          </p>
        </motion.div>

        <div className="examples-grid">
          {examples.map((example, index) => (
            <motion.div
              key={index}
              className="example-card"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ y: -10, scale: 1.02 }}
              style={{ borderTopColor: example.color }}
            >
              <div className="example-header">
                <div className="example-icon" style={{ color: example.color }}>
                  {example.icon}
                </div>
                <div className="example-meta">
                  <h3 className="example-company">{example.company}</h3>
                  <span className="example-industry">{example.industry}</span>
                </div>
              </div>
              <div className="example-achievement">
                <span className="achievement-badge" style={{ backgroundColor: example.color }}>
                  {example.achievement}
                </span>
              </div>
              <p className="example-story">{example.story}</p>
              <div className="example-impact" style={{ color: example.color }}>
                💡 {example.impact}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="case-studies"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h3 className="case-studies-title">Études de Cas Détaillées</h3>
          <div className="case-studies-grid">
            {caseStudies.map((study, index) => (
              <motion.div
                key={index}
                className="case-study-card"
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
              >
                <h4 className="case-study-title">{study.title}</h4>
                <div className="case-study-comparison">
                  <div className="before-section">
                    <div className="section-label before-label">❌ Avant CMMI</div>
                    <p>{study.before}</p>
                  </div>
                  <div className="arrow">→</div>
                  <div className="after-section">
                    <div className="section-label after-label">✅ Après CMMI</div>
                    <p>{study.after}</p>
                  </div>
                </div>
                <div className="improvement-badge">
                  <strong>{study.improvement}</strong>
                </div>
                <ul className="metrics-list">
                  {study.metrics.map((metric, idx) => (
                    <li key={idx}>📊 {metric}</li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default RealExamples;

