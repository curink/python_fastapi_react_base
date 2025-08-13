// /src/components/GuestRoute.tsx

import { Navigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import Spinner from "./Spinner"
import { ReactNode } from "react"

type GuestRouteProps = {
  children: ReactNode
}

export default function GuestRoute({ children }: GuestRouteProps) {
  const { isLoggedIn, loading } = useAuth()

  if (loading) return <Spinner full={false} />

  return isLoggedIn ? <Navigate to="/" replace /> : children
}