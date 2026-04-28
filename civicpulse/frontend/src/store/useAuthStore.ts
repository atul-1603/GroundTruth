import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { User } from 'firebase/auth'

interface AuthState {
  user: User | null
  role: 'ngo' | 'volunteer' | null
  isLoading: boolean
  setUser: (user: User | null) => void
  setRole: (role: 'ngo' | 'volunteer' | null) => void
  setLoading: (loading: boolean) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      role: null,
      isLoading: true,
      setUser: (user) => set((state) => ({ 
        user, 
        isLoading: user ? (state.role ? false : true) : false 
      })),
      setRole: (role) => set({ role, isLoading: false }),
      setLoading: (isLoading) => set({ isLoading }),

      logout: () => {
        set({ user: null, role: null })
        localStorage.removeItem('auth-storage')
      }
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ role: state.role }), // Only persist role, Firebase handles user
    }
  )
)

