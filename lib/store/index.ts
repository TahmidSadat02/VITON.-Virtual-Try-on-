import { create } from 'zustand'
import { User } from '@supabase/supabase-js'

interface UserState {
  user: User | null
  setUser: (user: User | null) => void
}

export const useUser = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}))

interface DressFilter {
  category: string
  color: string
  size: string
  search: string
}

interface DressState {
  filters: DressFilter
  setFilters: (filters: Partial<DressFilter>) => void
  resetFilters: () => void
}

const initialFilters: DressFilter = {
  category: '',
  color: '',
  size: '',
  search: '',
}

export const useDressFilters = create<DressState>((set) => ({
  filters: initialFilters,
  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),
  resetFilters: () => set({ filters: initialFilters }),
}))
