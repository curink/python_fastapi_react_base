import { useState } from "react"
import api from "../api/axios"

export default function UserForm({ user, onClose, onSave }) {
  const [form, setForm] = useState({
    username: user?.username || "",
    email: user?.email || "",
    role: user?.role || "user",
    password: "", // hanya untuk user baru
  })

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const url = user ? `/users/${user.id}` : "/users"

      // Siapkan payload dengan filter password hanya jika dibutuhkan
      const payload = {
        username: form.username,
        email: form.email,
        role: form.role,
      }

      if (!user) {
        // untuk user baru, wajib password (atau default)
        payload.password = form.password || "default123"
      } else if (form.password) {
        // untuk update, hanya kirim password jika diisi
        payload.password = form.password
      }

      const response = user
        ? await api.put(url, payload)
        : await api.post(url, payload)

      onSave(response.data)
    } catch (err) {
      const errorMsg =
        err.response?.data?.detail?.[0]?.msg ||
        err.response?.data?.detail ||
        err.message

      alert("Gagal menyimpan user: " + errorMsg)
      console.error("UserForm error:", err)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-6 rounded shadow-md space-y-4 w-[90%] max-w-md"
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
          required={!user} // wajib hanya saat create
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
            onClick={onClose}
          >
            Cancel
          </button>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            {user ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </div>
  )
}