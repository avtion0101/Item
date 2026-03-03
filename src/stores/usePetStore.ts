import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import { pets as mockPets } from '../mockData'
import type { Pet } from '../mockData'
import type { User } from '@supabase/supabase-js'

interface PetStore {
  pets: Pet[]
  favorites: Set<number>
  isLoading: boolean
  activeCategory: '全部' | '狗狗' | '猫咪' | '小兔'
  searchQuery: string
  ageFilter: 'all' | 'baby' | 'young' | 'adult' | 'senior'
  user: User | null
  
  // Actions
  setCategory: (category: '全部' | '狗狗' | '猫咪' | '小兔') => void
  setSearchQuery: (query: string) => void
  setAgeFilter: (filter: 'all' | 'baby' | 'young' | 'adult' | 'senior') => void
  fetchPets: () => Promise<void>
  addPet: (pet: Omit<Pet, 'id'>) => Promise<void>
  fetchFavorites: (userId: string) => Promise<void>
  toggleFavorite: (petId: number) => Promise<void>
  setUser: (user: User | null) => void
  initializeAuth: () => void
  signOut: () => Promise<void>
}

export const usePetStore = create<PetStore>((set, get) => ({
  pets: mockPets,
  favorites: new Set(),
  isLoading: false,
  activeCategory: '全部',
  searchQuery: '',
  ageFilter: 'all',
  user: null,

  setCategory: (category) => set({ activeCategory: category }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setAgeFilter: (filter) => set({ ageFilter: filter }),

  fetchPets: async () => {
    if (!supabase) return
    
    set({ isLoading: true })
    try {
      const { data, error } = await supabase
        .from('pets')
        .select('*')
        .order('id', { ascending: true })
      
      if (error) throw error
      if (data) set({ pets: data as Pet[] })
    } catch (error) {
      console.error('Error fetching pets:', error)
      // Fallback to mock data if fetch fails or no supabase connection
      set({ pets: mockPets }) 
    } finally {
      set({ isLoading: false })
    }
  },

  addPet: async (pet) => {
    if (!supabase) return
    
    try {
      const { error } = await supabase
        .from('pets')
        .insert(pet)
      
      if (error) throw error
      
      // Refresh list
      await get().fetchPets()
    } catch (error) {
      console.error('Error adding pet:', error)
      throw error
    }
  },

  fetchFavorites: async (userId: string) => {
    if (!supabase) return
    const { data } = await supabase
      .from('favorites')
      .select('pet_id')
      .eq('user_id', userId)
    
    if (data) {
      set({ favorites: new Set(data.map(f => f.pet_id)) })
    }
  },

  toggleFavorite: async (petId: number) => {
    const { user, favorites } = get()
    if (!user) {
      // Logic for opening auth modal should be handled in UI component
      // Or we can add a global UI store for modals
      return
    }
    if (!supabase) return

    const isFav = favorites.has(petId)
    // Optimistic update
    const newFavs = new Set(favorites)
    if (isFav) {
      newFavs.delete(petId)
      set({ favorites: newFavs })
      await supabase.from('favorites').delete().match({ user_id: user.id, pet_id: petId })
    } else {
      newFavs.add(petId)
      set({ favorites: newFavs })
      await supabase.from('favorites').insert({ user_id: user.id, pet_id: petId })
    }
  },

  setUser: (user) => set({ user }),

  initializeAuth: () => {
    if (!supabase) return

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      set({ user: session?.user ?? null })
      if (session?.user) {
        get().fetchFavorites(session.user.id)
      }
    })

    // Listen for auth changes
    supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null
      set({ user: currentUser })
      
      if (currentUser) {
        get().fetchFavorites(currentUser.id)
      } else {
        set({ favorites: new Set() })
      }
    })
  },

  signOut: async () => {
    if (!supabase) return
    await supabase.auth.signOut()
    // State update handled by onAuthStateChange
  }
}))
