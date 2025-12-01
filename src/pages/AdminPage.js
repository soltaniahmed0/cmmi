import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdminPanel from '../components/AdminPanel';
import { QRCodeSVG } from 'qrcode.react';
import { motion } from 'framer-motion';
import { FaQrcode, FaDownload, FaCopy, FaHome } from 'react-icons/fa';
import './AdminPage.css';

const AdminPage = () => {
  const navigate = useNavigate();
  const appUrl = 'https://cmmi-seven.vercel.app/';

  const handleDownloadQR = () => {
    const qrElement = document.getElementById('qr-code');
    if (qrElement) {
      // qrcode.react génère un SVG, on doit le convertir en canvas puis en image
      const svg = qrElement.querySelector('svg');
      if (svg) {
        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        img.onload = () => {
          // Ajouter un padding blanc autour du QR code
          const padding = 20;
          canvas.width = img.width + (padding * 2);
          canvas.height = img.height + (padding * 2);
          
          // Fond blanc
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          // Dessiner l'image
          ctx.drawImage(img, padding, padding);
          
          canvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.download = 'cmmi-qr-code.png';
              link.href = url;
              link.click();
              URL.revokeObjectURL(url);
            }
          }, 'image/png');
        };
        
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);
        img.src = url;
      }
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(appUrl).then(() => {
      alert('Lien copié dans le presse-papiers !');
    }).catch(() => {
      alert('Erreur lors de la copie du lien');
    });
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <motion.div
          className="admin-title-section"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="admin-header-top">
            <button 
              className="back-to-home-btn"
              onClick={() => navigate('/')}
              title="Retour à l'accueil"
            >
              <FaHome /> Accueil
            </button>
          </div>
          <h1>Panneau d'Administration CMMI</h1>
          <p>Gérez les scores et suivez la progression des étudiants</p>
        </motion.div>
      </div>

      <div className="admin-page-content">
        {/* QR Code Section */}
        <motion.div
          className="qr-code-section"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="qr-code-card">
            <div className="qr-code-header">
              <FaQrcode className="qr-icon" />
              <h2>QR Code pour les Utilisateurs</h2>
            </div>
            <p className="qr-description">
              Scannez ce QR code pour accéder à l'application CMMI
            </p>
            
            <div className="qr-code-container" id="qr-code">
              <QRCodeSVG
                value={appUrl}
                size={256}
                level="H"
                includeMargin={true}
                bgColor="#ffffff"
                fgColor="#000000"
              />
            </div>

            <div className="qr-link-section">
              <div className="qr-link-display">
                <span className="qr-link-label">Lien de l'application :</span>
                <code className="qr-link-text">{appUrl}</code>
              </div>
              <div className="qr-actions">
                <button className="qr-action-btn copy-btn" onClick={handleCopyLink}>
                  <FaCopy /> Copier le lien
                </button>
                <button className="qr-action-btn download-btn" onClick={handleDownloadQR}>
                  <FaDownload /> Télécharger QR Code
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Admin Panel Section */}
        <motion.div
          className="admin-panel-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <AdminPanel onClose={null} />
        </motion.div>
      </div>
    </div>
  );
};

export default AdminPage;

