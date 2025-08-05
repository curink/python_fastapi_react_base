// /src/pages/Login.tssx

import { useEffect, useState, ChangeEvent, FormEvent } from "react"
import api from "../api/axios"
import { useAuth } from "../contexts/AuthContext"
import LoadingButton from "../components/LoadingButton"

type FormData = {
  username: string
  password: string
}

export default function Login() {
  const [formData, setFormData] = useState<FormData>({ username: "", password: "" })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()

  useEffect(() => {
    const root = window.document.documentElement
    const theme = localStorage.getItem("theme")
    if (theme === "dark") {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }
  }, [])

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const response = await api.post(
        "/login",
        new URLSearchParams(formData),
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      )
      await login(response.data.access_token)
    } catch (err: any) {
      if (err.response?.status === 403) {
        setError("Akses ditolak: hanya admin yang boleh login.")
      } else {
        setError(err.response?.data?.detail || "Login gagal")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">
          Login
        </h2>
        {error && (
          <p className="text-red-500 mb-4 text-sm text-center">{error}</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Username / Email
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded border dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded border dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          <LoadingButton
  type="submit"
  loading={loading}
  variant="primary"
  size="md"
>
  Login
</LoadingButton>
        </form>
      </div>
    </div>
  )
}