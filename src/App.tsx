import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import LandingScreen from './components/LandingScreen';
import ChatInterface from './components/ChatInterface';
import ProgressScreen from './components/ProgressScreen';
import { progressService } from './services/progressService';

type Screen = 'landing' | 'chat' | 'progress';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('landing');

  const handleStart = () => {
    setCurrentScreen('chat');
  };

  const handleShowProgress = () => {
    setCurrentScreen('progress');
  };

  const handleBackToChat = () => {
    setCurrentScreen('chat');
  };

  return (
    <div className="h-screen overflow-hidden">
      <AnimatePresence mode="wait">
        {currentScreen === 'landing' && (
          <LandingScreen key="landing" onStart={handleStart} />
        )}
        
        {currentScreen === 'chat' && (
          <ChatInterface key="chat" onShowProgress={handleShowProgress} />
        )}
        
        {currentScreen === 'progress' && (
          <ProgressScreen 
            key="progress" 
            progress={progressService.getProgress()} 
            onBack={handleBackToChat} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;