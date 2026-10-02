import { create } from 'zustand';

export const useScrollStore = create((set, get) => ({
  scrollDirection: 'up',
  lastScrollY: 0,
  setScrollDirection: (y) => set({
    scrollDirection: y > get().lastScrollY && y > 50 ? 'down' : y < get().lastScrollY ? 'up' : get().scrollDirection,
    lastScrollY: y
  })
}));