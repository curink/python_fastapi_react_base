// App.tsx

import { Routes, Route } from "react-router-dom"
import Dashboard from "./src/pages/Dashboard"
import Users from "./src/pages/Users"
import Login from "./src/pages/Login"
import NotFound from "./src/pages/NotFound"
import MainLayout from "./src/layouts/MainLayout"
import AuthLayout from "./src/layouts/AuthLayout"
import ProtectedRoute from "./src/components/ProtectedRoute"
import GuestRoute from "./src/components/GuestRoute"

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