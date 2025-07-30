// contexts/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "../api/axios"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null)
  const [user, setUser] = useState(null)
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

  const fetchUser = async (tok, redirectAfter = false) => {
    try {
      const res = await axios.get("/me", {
        headers: {
          Authorization: `Bearer ${tok}`,
        },
      })
      
      setUser(res.data)
      if (redirectAfter) navigate("/") // redirect hanya setelah login
    } catch (err) {
      console.error("Token expired or invalid", err)
      logout()
    } finally {
      setLoading(false)
    }
  }

  const login = (newToken) => {
    localStorage.setItem("token", newToken)
    setToken(newToken)
    fetchUser(newToken, true) // fetch + redirect setelah login
  }

  const logout = () => {
    localStorage.removeItem("token")
    setToken(null)
    setUser(null)
    navigate("/login")
  }

  const isLoggedIn = !!token && !!user

  return (
    <AuthContext.Provider value={{ token, user, isLoggedIn, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)