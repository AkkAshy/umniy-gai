"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { login as apiLogin, logout as apiLogout, getCurrentUser, initAuth, clearAuth } from "./api"

interface User {
  id: string
  email: string
  name: string
  role: string
  department: string
  phone: string
  avatar: string | null
  is_active: boolean
  created_at: string
  last_login: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    initAuth()
    checkAuth()
  }, [])

  async function checkAuth() {
    try {
      const result = await getCurrentUser()
      if (result.success && result.data) {
        setUser(result.data)
      }
    } catch (error) {
      console.error("Auth check failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  async function login(email: string, password: string) {
    const result = await apiLogin(email, password)
    if (result.success && result.data) {
      setUser(result.data.user)
      return { success: true }
    }
    return { success: false, error: result.error || "Ошибка входа" }
  }

  function logout() {
    apiLogout()
    clearAuth()
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
