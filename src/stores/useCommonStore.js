import { create } from "zustand"

export const useCommonStore = create((set, get) => ({
  images: [],
  setImages: (arr) => set({images : arr}),

  currentImageId: null,
  setCurrentImageId: (id) => set({currentImageId : id}),

  getCurrentIndex: () => {
    const { images, currentImageId } = get()
    const currentIndex = images.findIndex(img => img.id === currentImageId)
    return currentIndex
  },
  getMaxLength: () => {
    return get().images.length
  },

  onPrev: () => {
    const { images, getCurrentIndex } = get()
    const currentIndex = getCurrentIndex()
    if(currentIndex > 0) {
      set({ currentImageId: images[currentIndex - 1].id })
    }
  },

  onNext: () => {
    const { images, getCurrentIndex } = get()
    const currentIndex = getCurrentIndex()
    if(currentIndex < images.length - 1) {
      set({ currentImageId: images[currentIndex + 1].id })
    }
  },

}))