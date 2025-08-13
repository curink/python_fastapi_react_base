// /App.tsx

import { Routes, Route } from "react-router-dom"
import Dashboard from "@/pages/Dashboard"
import Users from "@/pages/Users"
import Login from "@/pages/Login"
import NotFound from "@/pages/NotFound"
import MainLayout from "@/layouts/MainLayout"
import AuthLayout from "@/layouts/AuthLayout"
import ProtectedRoute from "@/components/ProtectedRoute"
import GuestRoute from "@/components/GuestRoute"

export default function App(): JSX.Element {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={
          <GuestRoute>
            <Login />
          </GuestRoute>
        } />
      </Route>
      
      <Route element={<MainLayout />}>
        <Route path="/" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/users" element={
          <ProtectedRoute>
            <Users />
          </ProtectedRoute>
        } />
      </Route>
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}