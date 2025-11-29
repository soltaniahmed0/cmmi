import React, { useState } from 'react';
import Header from './components/Header';
import UserLogin from './components/UserLogin';
import AdminPanel from './components/AdminPanel';
import GamesHero from './components/GamesHero';
import ProgressTracker from './components/ProgressTracker';
import CMMISteps from './components/CMMISteps';
import InteractiveActivities from './components/InteractiveActivities';
import MemoryGame from './components/MemoryGame';
import ProcessDragDrop from './components/ProcessDragDrop';
import TrueFalseGame from './components/TrueFalseGame';
import OrderLevelsGame from './components/OrderLevelsGame';
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
          <InteractiveActivities />
          <MemoryGame />
          <ProcessDragDrop />
          <TrueFalseGame />
          <OrderLevelsGame />
        </>
      )}
      <Footer />
    </div>
  );
}

export default App;

