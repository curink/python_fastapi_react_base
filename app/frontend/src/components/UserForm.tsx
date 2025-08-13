// /src/components/UserForm.tsx

import { useState, FormEvent, useEffect } from "react"
import api from "@/api/axios"
import LoadingButton from "@/components/LoadingButton"

type UserType = {
  id?: number
  username: string
  email: string
  role: string
}

type UserFormProps = {
  user?: UserType
  onClose: () => void
  onSave: (data: any) => void
}

export default function UserForm({ user, onClose, onSave }: UserFormProps) {
  const [loading, setLoading] = useState(false)
  const [show, setShow] = useState(false) // animasi masuk/keluar
  const [form, setForm] = useState({
    username: user?.username || "",
    email: user?.email || "",
    role: user?.role || "user",
    password: "",
  })

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 10) // animasi masuk
    return () => clearTimeout(t)
  }, [])

  const closeWithAnimation = () => {
    setShow(false)
    setTimeout(onClose, 500) // delay sesuai animasi
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = user ? `/users/${user.id}` : "/users"
      const payload: Record<string, string> = {
        username: form.username,
        email: form.email,
        role: form.role,
      }

      if (!user) {
        payload.password = form.password || "default123"
      } else if (form.password) {
        payload.password = form.password
      }

      const response = user
        ? await api.put(url, payload)
        : await api.post(url, payload)

      onSave(response.data) // kirim ke parent
      closeWithAnimation()
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.detail?.[0]?.msg ||
        err.response?.data?.detail ||
        err.message
      alert("Gagal menyimpan user: " + errorMsg)
      console.error("UserForm error:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 transition-opacity duration-500 ${
        show ? "opacity-100" : "opacity-0"
      }`}
    >
      <form
        onSubmit={handleSubmit}
        className={`bg-white dark:bg-gray-800 p-6 rounded shadow-md space-y-4 w-[90%] max-w-md transform transition-all duration-500 ${
          show ? "scale-100 opacity-100" : "scale-90 opacity-0"
        }`}
      >
        <h2 className="text-xl font-bold">{user ? "Edit User" : "Add User"}</h2>

        <input
          type="text"
          placeholder="Username"
          className="w-full p-2 rounded border dark:bg-gray-700"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          required
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 rounded border dark:bg-gray-700"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />

        <input
          type="password"
          placeholder={user ? "Change Password (optional)" : "Password"}
          className="w-full p-2 rounded border dark:bg-gray-700"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required={!user}
        />

        <select
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          className="w-full p-2 rounded border dark:bg-gray-700"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <div className="flex justify-between">
          <button
            type="button"
            className="bg-gray-400 px-4 py-2 rounded"
            onClick={closeWithAnimation}
          >
            Cancel
          </button>
          <LoadingButton type="submit" loading={loading} variant="primary" size="md">
            {user ? "Update" : "Create"}
          </LoadingButton>
        </div>
      </form>
    </div>
  )
}