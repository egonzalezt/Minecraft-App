// store/index.js
import create from 'zustand';

const useNumberStore = create((set) => ({
  animation: 0, // Initial animation value
  speed: 0, // Initial speed value

  // Function to update the animation value
  setAnimation: (newValue) => set({ animation: newValue }),

  // Function to update the speed value
  setSpeed: (newValue) => set({ speed: newValue }),

  // Function to reset both animation and speed values to zero
  resetValues: () => set({ animation: 0, speed: 0 }),
}));

export const storeSkin = useNumberStore;
