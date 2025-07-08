import { create } from 'zustand'

export const useMergeCanvasStore = create((set, get) => ({
  backgroundImageUrl: null,
  setBackgroundImageUrl: (url) => set({ backgroundImageUrl: url }),

  backgroundImageInfo: {
    rotation: 0, skewX: 0, skewY: 0,
    width: 0, height: 0,
    left: 0, top: 0,
  },
  setBackgroundImageInfo: (info) => set({ backgroundImageInfo: info }),

  isFixBackground: false,
  // setIsFixBackground: (bool) => set({ isFixBackground: bool }),
  toggleIsFixBackground: () => set({isFixBackground: !get().isFixBackground }),

  resetMergeCanvasStates: () => set({
    backgroundImageUrl: null,
    backgroundImageInfo: {
      rotation: 0, skewX: 0, skewY: 0,
      width: 0, height: 0,
      left: 0, top: 0,
    },
    isFixBackground: false,
  }),
}))
