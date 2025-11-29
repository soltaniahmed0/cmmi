import React, { useState } from 'react';
import Header from './components/Header';
import UserLogin from './components/UserLogin';
import AdminPanel from './components/AdminPanel';
import GamesHero from './components/GamesHero';
import ProgressTracker from './components/ProgressTracker';
import CMMISteps from './components/CMMISteps';
import Level1Initial from './components/Level1Initial';
import Level2Managed from './components/Level2Managed';
import Level3Defined from './components/Level3Defined';
import Level4QuantitativelyManaged from './components/Level4QuantitativelyManaged';
import Level5Optimizing from './components/Level5Optimizing';
import Footer from './components/Footer';
import { getPlayerName } from './utils/scoreManager';
import './App.css';

function App() {
  const [playerName, setPlayerName] = useState('');
  const [showAdmin, setShowAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(true);

  React.useEffect(() => {
    const savedName = getPlayerName();
    if (savedName) {
      setPlayerName(savedName);
      setShowLogin(false);
    }
  }, []);

  const handleLogin = (name) => {
    setPlayerName(name);
    setShowLogin(false);
  };

  return (
    <div className="App">
      <Header onAdminClick={() => setShowAdmin(true)} />
      {showLogin && <UserLogin onLogin={handleLogin} />}
      {showAdmin && <AdminPanel onClose={() => setShowAdmin(false)} />}
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
}

export default App;

