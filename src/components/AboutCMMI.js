import React from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaUsers, FaChartLine, FaCog } from 'react-icons/fa';
import './AboutCMMI.css';

const AboutCMMI = () => {
  const features = [
    {
      icon: <FaUsers />,
      title: 'Gestion d\'Équipe',
      description: 'Améliore la collaboration et la communication entre les membres de l\'équipe'
    },
    {
      icon: <FaChartLine />,
      title: 'Mesure Continue',
      description: 'Suivi des performances et amélioration continue des processus'
    },
    {
      icon: <FaCog />,
      title: 'Processus Optimisés',
      description: 'Standardisation et optimisation des processus de développement'
    },
    {
      icon: <FaCheckCircle />,
      title: 'Qualité Garantie',
      description: 'Réduction des défauts et amélioration de la qualité du produit final'
    }
  ];

  return (
    <section id="about" className="about-cmmi">
      <motion.div
        className="container"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="section-header">
          <h2 className="section-title">Qu'est-ce que le CMMI ?</h2>
          <p className="section-description">
            Le Capability Maturity Model Integration (CMMI) est un modèle de maturité 
            qui aide les organisations à améliorer leurs processus de développement logiciel. 
            Il fournit un cadre structuré pour évaluer et améliorer la capacité d'une 
            organisation à produire des logiciels de qualité.
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="feature-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ y: -10, scale: 1.05 }}
            >
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="info-box"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="info-content">
            <h3>🎓 Conçu pour les Professionnels</h3>
            <p>
              CMMI est utilisé par des milliers d'organisations dans le monde entier, 
              des startups aux grandes entreprises technologiques. C'est un standard 
              reconnu qui valorise votre profil professionnel.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default AboutCMMI;

