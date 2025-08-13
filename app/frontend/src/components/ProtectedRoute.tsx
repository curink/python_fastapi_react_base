// /src/components/ProtectedRoute.tsx

import { Navigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import Spinner from "./Spinner"
import { ReactNode } from "react"

type ProtectedRouteProps = {
  children: ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isLoggedIn, loading } = useAuth()

  if (loading) return <Spinner full={false}/>

  return isLoggedIn ? children : <Navigate to="/login" replace />
}