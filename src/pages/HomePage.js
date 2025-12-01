import React, { useState } from 'react';
import Header from '../components/Header';
import UserLogin from '../components/UserLogin';
import GamesHero from '../components/GamesHero';
import ProgressTracker from '../components/ProgressTracker';
import CMMISteps from '../components/CMMISteps';
import Level1Initial from '../components/Level1Initial';
import Level2Managed from '../components/Level2Managed';
import Level3Defined from '../components/Level3Defined';
import Level4QuantitativelyManaged from '../components/Level4QuantitativelyManaged';
import Level5Optimizing from '../components/Level5Optimizing';
import Footer from '../components/Footer';
import { getPlayerName, checkPlayerNameExists } from '../utils/scoreManager';

const HomePage = () => {
  const [playerName, setPlayerName] = useState('');
  const [showLogin, setShowLogin] = useState(true);

  React.useEffect(() => {
    const checkAndLoadUser = async () => {
      const savedName = getPlayerName();
      if (savedName) {
        // Vérifier si l'utilisateur existe toujours dans la base de données
        const exists = await checkPlayerNameExists(savedName);
        if (exists) {
          setPlayerName(savedName);
          setShowLogin(false);
        } else {
          // L'utilisateur a été supprimé, effacer le nom local et demander de retaper
          localStorage.removeItem('cmmi_player_name');
        }
      }
    };
    checkAndLoadUser();
  }, []);

  const handleLogin = (name) => {
    setPlayerName(name);
    setShowLogin(false);
  };

  return (
    <div className="App">
      <Header showAdminLink={false} />
      {showLogin && <UserLogin onLogin={handleLogin} />}
      {!showLogin && (
        <>
          <GamesHero />
          <ProgressTracker />
          <CMMISteps />
          <Level1Initial />
          <Level2Managed />
          <Level3Defined />
          <Level4QuantitativelyManaged />
          <Level5Optimizing />
        </>
      )}
      <Footer />
    </div>
  );
};

export default HomePage;

