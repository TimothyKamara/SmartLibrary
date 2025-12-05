"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type UserRole = "student" | "librarian" | "admin"

interface User {
  id: string
  name: string
  email: string
  role: UserRole
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string, role: UserRole) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock login - in production, this would call your backend API
    // For now, check against demo accounts or localStorage
    const users = JSON.parse(localStorage.getItem("users") || "[]")
    const foundUser = users.find((u: any) => u.email === email && u.password === password)

    if (foundUser) {
      const userData = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role,
      }
      setUser(userData)
      localStorage.setItem("user", JSON.stringify(userData))
      return true
    }

    // Demo accounts for testing
    if (email === "student@library.com" && password === "student123") {
      const userData = { id: "1", name: "Student User", email, role: "student" as UserRole }
      setUser(userData)
      localStorage.setItem("user", JSON.stringify(userData))
      return true
    }
    if (email === "librarian@library.com" && password === "librarian123") {
      const userData = { id: "2", name: "Librarian User", email, role: "librarian" as UserRole }
      setUser(userData)
      localStorage.setItem("user", JSON.stringify(userData))
      return true
    }
    if (email === "admin@library.com" && password === "admin123") {
      const userData = { id: "3", name: "Admin User", email, role: "admin" as UserRole }
      setUser(userData)
      localStorage.setItem("user", JSON.stringify(userData))
      return true
    }

    return false
  }

  const register = async (name: string, email: string, password: string, role: UserRole): Promise<boolean> => {
    // Mock registration - in production, this would call your backend API
    const users = JSON.parse(localStorage.getItem("users") || "[]")

    // Check if user already exists
    if (users.find((u: any) => u.email === email)) {
      return false
    }

    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password,
      role,
    }

    users.push(newUser)
    localStorage.setItem("users", JSON.stringify(users))

    const userData = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    }
    setUser(userData)
    localStorage.setItem("user", JSON.stringify(userData))
    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  return <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
