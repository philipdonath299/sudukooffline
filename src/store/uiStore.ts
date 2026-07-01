import { create } from 'zustand';

export type Screen = 'menu' | 'new-game' | 'settings' | 'stats' | 'achievements' | 'game' | 'how-to-play' | 'about';

interface UiState {
  currentScreen: Screen;
  setScreen: (screen: Screen) => void;
}

export const useUiStore = create<UiState>((set) => ({
  currentScreen: 'menu',
  setScreen: (screen) => set({ currentScreen: screen }),
}));
