// /src/pages/Users.tsx

import { useEffect, useState } from "react"
import api from "../api/axios"
import UserForm from "../components/UserForm"
import Spinner from "../components/Spinner"
import { UserPen, UserRoundX } from "lucide-react"

type User = {
  id: number
  username: string
  email: string
  role: string
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([])
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await api.get<User[]>("/users")
      setUsers(response.data)
    } catch (err) {
      console.error("Gagal ambil data users:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this user?")) return
    try {
      setLoading(true)
      await api.delete(`/users/${id}`)
      await fetchUsers()
    } catch (err) {
      alert("Gagal menghapus user.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setLoading(true) // mulai loading table
    try {
      await fetchUsers()
    } catch (err) {
      console.error("Gagal refresh data:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">User Management</h1>

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
        onClick={() => {
          setEditingUser(null)
          setShowForm(true)
        }}
      >
        + Add User
      </button>

      <table className="w-full table-auto border border-collapse border-gray-300">
        <thead className="bg-gray-100 dark:bg-gray-700">
          <tr>
            <th className="p-2 border">Username</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Role</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={4} className="text-center py-6">
                <Spinner full={false} />
              </td>
            </tr>
          ) : users.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center py-6 text-gray-500">
                Tidak ada data pengguna.
              </td>
            </tr>
          ) : (
            users.map((u) => (
              <tr key={u.id} className="border-t dark:border-gray-600">
                <td className="p-2 border">{u.username}</td>
                <td className="p-2 border">{u.email}</td>
                <td className="p-2 border">
                  {u.role.charAt(0).toUpperCase() + u.role.slice(1)}
                </td>
                <td className="p-2 border space-x-2">
                  <button
                    className="bg-yellow-400 px-3 py-1 rounded"
                    onClick={() => {
                      setEditingUser(u)
                      setShowForm(true)
                    }}
                  >
                    <UserPen />
                  </button>
                  <button
                    className="bg-red-600 text-white px-3 py-1 rounded"
                    onClick={() => handleDelete(u.id)}
                  >
                    <UserRoundX />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {showForm && (
        <UserForm
          user={editingUser || undefined}
          onClose={() => {
            setShowForm(false)
            setEditingUser(null)
          }}
          onSave={handleSave}
        />
      )}
    </div>
  )
}