import React from 'react';
import { motion } from 'framer-motion';
import { 
  FaRocket, 
  FaHandshake, 
  FaChartBar, 
  FaGlobe,
  FaBrain,
  FaShieldAlt
} from 'react-icons/fa';
import './CareerAdvantages.css';

const CareerAdvantages = () => {
  const advantages = [
    {
      icon: <FaRocket />,
      title: 'Accélération de Carrière',
      description: 'Les professionnels certifiés CMMI progressent 2x plus vite dans leur carrière',
      stats: '3-5 ans d\'avance'
    },
    {
      icon: <FaHandshake />,
      title: 'Meilleures Opportunités',
      description: 'Accès aux meilleures entreprises tech et projets prestigieux',
      stats: '85% des grandes entreprises'
    },
    {
      icon: <FaChartBar />,
      title: 'Salaire Supérieur',
      description: 'Compensation financière nettement plus élevée',
      stats: '+30-50% en moyenne'
    },
    {
      icon: <FaGlobe />,
      title: 'Reconnaissance Internationale',
      description: 'Certification reconnue dans le monde entier',
      stats: '150+ pays'
    },
    {
      icon: <FaBrain />,
      title: 'Expertise Valorisée',
      description: 'Considéré comme expert en qualité et processus',
      stats: 'Statut d\'expert'
    },
    {
      icon: <FaShieldAlt />,
      title: 'Sécurité d\'Emploi',
      description: 'Demandé même en période économique difficile',
      stats: 'Demande constante'
    }
  ];

  const careerPath = [
    {
      role: 'Développeur Junior',
      withCMMI: '€35k - €45k',
      withoutCMMI: '€30k - €38k',
      diff: '+20%'
    },
    {
      role: 'Développeur Senior',
      withCMMI: '€55k - €75k',
      withoutCMMI: '€45k - €60k',
      diff: '+25%'
    },
    {
      role: 'Lead Developer',
      withCMMI: '€80k - €110k',
      withoutCMMI: '€65k - €85k',
      diff: '+30%'
    },
    {
      role: 'Architecte Logiciel',
      withCMMI: '€100k - €140k',
      withoutCMMI: '€85k - €110k',
      diff: '+25%'
    },
    {
      role: 'CTO / Directeur Technique',
      withCMMI: '€150k+',
      withoutCMMI: '€120k+',
      diff: '+25%'
    }
  ];

  return (
    <section className="career-advantages">
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="section-title">
            Avantages Concrets pour Votre Carrière
          </h2>
          <p className="section-description">
            CMMI ne transforme pas seulement les organisations, il transforme 
            également les carrières individuelles. Voici les avantages mesurables.
          </p>
        </motion.div>

        <div className="advantages-grid">
          {advantages.map((advantage, index) => (
            <motion.div
              key={index}
              className="advantage-card"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ y: -10, rotate: 2 }}
            >
              <div className="advantage-icon">{advantage.icon}</div>
              <h3 className="advantage-title">{advantage.title}</h3>
              <p className="advantage-description">{advantage.description}</p>
              <div className="advantage-stat">{advantage.stats}</div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="salary-comparison"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h3 className="comparison-title">
            Comparaison Salariale : Avec vs Sans CMMI
          </h3>
          <div className="comparison-table">
            {careerPath.map((path, index) => (
              <motion.div
                key={index}
                className="salary-row"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <div className="role-name">{path.role}</div>
                <div className="salary-values">
                  <div className="salary-without">
                    <span className="salary-label">Sans CMMI</span>
                    <span className="salary-amount">{path.withoutCMMI}</span>
                  </div>
                  <div className="salary-arrow">→</div>
                  <div className="salary-with">
                    <span className="salary-label">Avec CMMI</span>
                    <span className="salary-amount highlight">{path.withCMMI}</span>
                  </div>
                  <div className="salary-diff">
                    <span className="diff-badge">{path.diff}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="testimonial-box"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="testimonial-content">
            <div className="quote-icon">"</div>
            <p className="testimonial-text">
              Ma compréhension du CMMI a été un facteur déterminant dans ma promotion 
              au poste d'Architecte Logiciel. Les entreprises reconnaissent et valorisent 
              cette expertise.
            </p>
            <div className="testimonial-author">
              <strong>Sarah M.</strong> - Architecte Logiciel, Google
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CareerAdvantages;

