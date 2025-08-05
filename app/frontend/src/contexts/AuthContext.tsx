// /src/contexts/AuthContext.tsx

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react"
import { useNavigate } from "react-router-dom"
import api from "../api/axios"

interface User {
  id: number
  username: string
  email: string
  role: string
  [key: string]: any // jika ada field lain
}

interface AuthContextType {
  token: string | null
  user: User | null
  isLoggedIn: boolean
  loading: boolean
  login: (newToken: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const stored = localStorage.getItem("token")
    if (stored) {
      setToken(stored)
      fetchUser(stored)
    } else {
      setLoading(false)
    }
  }, [])

  const fetchUser = async (tok: string, redirectAfter: boolean=false): Promise<void> => {
    try {
      const res = await api.get<User>("/me", {
        headers: {
          Authorization: `Bearer ${tok}`,
        },
      })
      setUser(res.data)
      if(redirectAfter) {
          navigate("/")
      }
    } catch (err) {
      console.error("Token expired or invalid", err)
      logout()
    } finally {
      setLoading(false)
    }
  }

  const login = async (newToken: string): Promise<void> => {
    localStorage.setItem("token", newToken)
    setToken(newToken)
    await fetchUser(newToken, true)
  }

  const logout = () => {
    localStorage.removeItem("token")
    setToken(null)
    setUser(null)
    navigate("/login")
  }

  const isLoggedIn = !!token && !!user

  return (
    <AuthContext.Provider
      value={{ token, user, isLoggedIn, loading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}