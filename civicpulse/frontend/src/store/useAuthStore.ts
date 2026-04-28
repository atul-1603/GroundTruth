import { create } from 'zustand'
import { User } from 'firebase/auth'

interface AuthState {
  user: User | null
  role: 'ngo' | 'volunteer' | null
  setUser: (user: User | null) => void
  setRole: (role: 'ngo' | 'volunteer' | null) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  role: null,
  setUser: (user) => set({ user }),
  setRole: (role) => set({ role }),
  logout: () => set({ user: null, role: null })
}))
