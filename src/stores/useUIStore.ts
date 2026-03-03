import { create } from 'zustand'
import type { Pet } from '../mockData'

interface UIStore {
  isMenuOpen: boolean
  isAuthModalOpen: boolean
  adoptionPet: Pet | null
  currentView: 'home' | 'community'
  
  toggleMenu: () => void
  setMenuOpen: (isOpen: boolean) => void
  setAuthModalOpen: (isOpen: boolean) => void
  setAdoptionPet: (pet: Pet | null) => void
  setCurrentView: (view: 'home' | 'community') => void
}

export const useUIStore = create<UIStore>((set) => ({
  isMenuOpen: false,
  isAuthModalOpen: false,
  adoptionPet: null,
  currentView: 'home',

  toggleMenu: () => set((state) => ({ isMenuOpen: !state.isMenuOpen })),
  setMenuOpen: (isOpen) => set({ isMenuOpen: isOpen }),
  setAuthModalOpen: (isOpen) => set({ isAuthModalOpen: isOpen }),
  setAdoptionPet: (pet) => set({ adoptionPet: pet }),
  setCurrentView: (view) => set({ currentView: view }),
}))
