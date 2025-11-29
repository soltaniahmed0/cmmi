import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaGraduationCap, 
  FaBriefcase, 
  FaMoneyBillWave, 
  FaTrophy,
  FaCheckCircle,
  FaArrowRight
} from 'react-icons/fa';
import './StudentBenefits.css';

const StudentBenefits = () => {
  const [activeTab, setActiveTab] = useState('career');

  const benefits = {
    career: {
      title: 'Avantages Professionnels',
      icon: <FaBriefcase />,
      items: [
        'Emplois plus attractifs et mieux rémunérés',
        'Reconnaissance internationale de vos compétences',
        'Accès à des entreprises prestigieuses (Google, Microsoft, IBM)',
        'Opportunités de carrière accélérées',
        'Prise de décisions techniques plus éclairées',
        'Meilleure compréhension des processus industriels'
      ]
    },
    skills: {
      title: 'Compétences Développées',
      icon: <FaGraduationCap />,
      items: [
        'Maîtrise des meilleures pratiques du secteur',
        'Compétences en gestion de projet et qualité',
        'Compréhension approfondie du cycle de vie logiciel',
        'Capacité à travailler dans des environnements structurés',
        'Pensée analytique et résolution de problèmes',
        'Communication et collaboration améliorées'
      ]
    },
    salary: {
      title: 'Impact sur le Salaire',
      icon: <FaMoneyBillWave />,
      items: [
        '+25% à +40% de salaire en moyenne',
        'Meilleures opportunités de négociation',
        'Accès à des postes de niveau supérieur',
        'Bonus et avantages sociaux améliorés',
        'Reconnaissance financière de l\'expertise',
        'Croissance salariale accélérée'
      ]
    },
    recognition: {
      title: 'Reconnaissance & Prestige',
      icon: <FaTrophy />,
      items: [
        'Certification CMMI reconnue mondialement',
        'Crédibilité accrue auprès des employeurs',
        'Professionnel de niveau expert',
        'Différenciation sur le marché du travail',
        'Réseau professionnel élargi',
        'Réputation de qualité et d\'excellence'
      ]
    }
  };

  return (
    <section id="benefits" className="student-benefits">
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="section-title">
            Pourquoi CMMI est Essentiel pour Votre Carrière
          </h2>
          <p className="section-description">
            En tant qu'étudiant ou jeune professionnel, maîtriser CMMI ouvre 
            des portes exceptionnelles et accélère votre progression.
          </p>
        </motion.div>

        <div className="tabs-container">
          <div className="tabs">
            {Object.keys(benefits).map((key) => (
              <button
                key={key}
                className={`tab ${activeTab === key ? 'active' : ''}`}
                onClick={() => setActiveTab(key)}
              >
                <span className="tab-icon">{benefits[key].icon}</span>
                <span className="tab-text">{benefits[key].title}</span>
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              className="tab-content"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <div className="benefits-grid">
                {benefits[activeTab].items.map((item, index) => (
                  <motion.div
                    key={index}
                    className="benefit-item"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <FaCheckCircle className="check-icon" />
                    <span>{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <motion.div
          className="highlight-box"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="highlight-content">
            <h3>💼 Votre Ticket pour le Succès Professionnel</h3>
            <p>
              Les entreprises recherchent activement des candidats ayant une compréhension 
              du CMMI. C'est votre avantage concurrentiel sur le marché du travail !
            </p>
            <div className="stat-highlights">
              <div className="stat-highlight">
                <div className="stat-highlight-number">85%</div>
                <div className="stat-highlight-label">des entreprises Fortune 500 utilisent CMMI</div>
              </div>
              <div className="stat-highlight">
                <div className="stat-highlight-number">3x</div>
                <div className="stat-highlight-label">plus de chances d'être embauché</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default StudentBenefits;

