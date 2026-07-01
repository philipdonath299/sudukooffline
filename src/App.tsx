import { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Game } from './pages/Game';
import { MainMenu } from './pages/MainMenu';
import { NewGameSetup } from './pages/NewGameSetup';
import { SettingsScreen } from './pages/SettingsScreen';
import { StatsScreen } from './pages/StatsScreen';
import { AchievementsScreen } from './pages/AchievementsScreen';
import { useSettingsStore } from './store/settingsStore';
import { useUiStore } from './store/uiStore';

function App() {
  const darkMode = useSettingsStore(state => state.darkMode);
  const currentScreen = useUiStore(state => state.currentScreen);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('dark', 'amoled');
    
    if (darkMode === true) {
      root.classList.add('dark');
    } else if (darkMode === 'amoled') {
      root.classList.add('amoled');
    } else if (darkMode === 'system') {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        root.classList.add('dark');
      }
    }
  }, [darkMode]);

  return (
    <div className="app-container font-sans antialiased min-h-screen w-full bg-[var(--bg-primary)] overflow-x-hidden">
      <AnimatePresence mode="wait">
        {currentScreen === 'menu' && <MainMenu key="menu" />}
        {currentScreen === 'new-game' && <NewGameSetup key="new-game" />}
        {currentScreen === 'settings' && <SettingsScreen key="settings" />}
        {currentScreen === 'stats' && <StatsScreen key="stats" />}
        {currentScreen === 'achievements' && <AchievementsScreen key="achievements" />}
        {currentScreen === 'game' && <Game key="game" />}
      </AnimatePresence>
    </div>
  );
}

export default App;
