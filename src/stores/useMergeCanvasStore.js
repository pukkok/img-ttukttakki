import { create } from 'zustand'

export const useMergeCanvasStore = create((set, get) => ({
  backgroundImageUrl: null,
  setBackgroundImageUrl: (url) => set({ backgroundImageUrl: url }),

  backgroundImageInfo: {
    rotation: 0, skewX: 0, skewY: 0,
    width: 0, height: 0
  },
  setBackgroundImageInfo: (info) => set({ backgroundImageInfo: info }),

  isBackgroundLocked: false,
  toggleIsBackgroundLocked: () => set({isBackgroundLocked: !get().isBackgroundLocked }),

  selectCrop: true,
  toggleSelectCrop: () => set({selectCrop: !get().selectCrop}),
  
  cropBoxInfo: {
    width: 0, hegiht: 0
  },
  setCropBoxInfo: (info) => set({ cropBoxInfo: info }),

  resetMergeCanvasStates: () => set({
    backgroundImageUrl: null,
    backgroundImageInfo: {
      rotation: 0, skewX: 0, skewY: 0,
      width: 0, height: 0
    },
    isBackgroundLocked: false,
  }),
}))
