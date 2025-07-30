import { Navigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import Spinner from "./Spinner"

export default function ProtectedRoute({ children }) {
  const { isLoggedIn, loading } = useAuth()

  if (loading) return <div>Loading...</div> //<Spinner />

  return isLoggedIn ? children : <Navigate to="/login" replace />
}