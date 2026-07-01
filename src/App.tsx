import { useEffect } from 'react';
import { Game } from './pages/Game';
import { useSettingsStore } from './store/settingsStore';

function App() {
  const darkMode = useSettingsStore(state => state.darkMode);

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
    <div className="app-container font-sans antialiased min-h-screen w-full">
      <Game />
    </div>
  );
}

export default App;
