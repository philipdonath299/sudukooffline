import { useSettingsStore } from '../store/settingsStore';

export const triggerHaptic = (type: 'success' | 'error' | 'victory' | 'selection') => {
  const { haptics } = useSettingsStore.getState();
  if (!haptics || typeof navigator === 'undefined' || !navigator.vibrate) return;
  
  try {
    switch (type) {
      case 'selection':
        navigator.vibrate(5);
        break;
      case 'success':
        navigator.vibrate(10);
        break;
      case 'error':
        navigator.vibrate([30, 50, 30]);
        break;
      case 'victory':
        navigator.vibrate([100, 50, 100, 50, 100, 50, 200]);
        break;
    }
  } catch (e) {
    // Ignore if not supported or permission denied
  }
};
