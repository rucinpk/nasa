import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import APOD from './pages/APOD';
import MarsExplorer from './pages/MarsExplorer';
import NEOTracker from './pages/NEOTracker';
import EarthView from './pages/EarthView';
import Search from './pages/Search';

const StarField: React.FC = () => {
  useEffect(() => {
    const createStars = (): void => {
      const starField = document.querySelector('.star-field');
      if (!starField) return;
      
      starField.innerHTML = '';
      
      for (let i = 0; i < 200; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.animationDelay = Math.random() * 2 + 's';
        star.style.animationDuration = (Math.random() * 3 + 2) + 's';
        starField.appendChild(star);
      }
    };

    createStars();
    
    const interval = setInterval(createStars, 10000);
    return () => clearInterval(interval);
  }, []);

  return <div className="star-field" />;
};

const App: React.FC = () => {
  return (
    <Router>
      <div className="App min-h-screen relative overflow-x-hidden">
        <StarField />
        
        <div className="relative z-10">
          <Navbar />
          
          <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="pt-16"
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/apod" element={<APOD />} />
              <Route path="/mars" element={<MarsExplorer />} />
              <Route path="/neo" element={<NEOTracker />} />
              <Route path="/earth" element={<EarthView />} />
              <Route path="/search" element={<Search />} />
            </Routes>
          </motion.main>
        </div>
      </div>
    </Router>
  );
};

export default App; 