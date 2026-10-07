import confetti from 'canvas-confetti';

export const triggerConfettiCelebration = () => {
  try {
    // Left burst
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors: ['#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#ffffff'],
    });
    // Right burst
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors: ['#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#ffffff'],
    });
  } catch (e) {
    console.debug('Confetti not available', e);
  }
};

export const triggerGoldBurst = () => {
  try {
    confetti({
      particleCount: 80,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#fbbf24', '#f59e0b', '#d97706', '#fef08a'],
    });
  } catch (e) {
    console.debug('Confetti error', e);
  }
};
