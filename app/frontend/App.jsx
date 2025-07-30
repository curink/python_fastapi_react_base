import { Routes, Route, Navigate } from "react-router-dom"
import Dashboard from "./src/pages/Dashboard"
import Users from "./src/pages/Users"
import Login from "./src/pages/Login"
import NotFound from "./src/pages/NotFound"
import MainLayout from "./src/layouts/MainLayout"
import AuthLayout from "./src/layouts/AuthLayout"
import ProtectedRoute from "./src/components/ProtectedRoute"

export default function App() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
      </Route>

      <Route element={<MainLayout />}>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <Users />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}