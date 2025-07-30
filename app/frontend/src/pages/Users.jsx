import { useEffect, useState } from "react"
import axios from "../api/axios"
import UserForm from "../components/UserForm"
import { UserPen, UserRoundX } from "lucide-react"

export default function Users() {
  const [users, setUsers] = useState([])
  const [editingUser, setEditingUser] = useState(null)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/users")
        // console.log("Users data:", response.data)
        setUsers(response.data)
      } catch (err) {
        console.error("Gagal ambil data users:", err)
      }
    }

    fetchUsers()
  }, [])

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this user?")) return
    try {
      await axios.delete(`/users/${id}`)
      setUsers(users.filter(u => u.id !== id))
    } catch (err) {
      alert("Gagal menghapus user.")
      console.error(err)
    }
  }

  const handleSave = (user) => {
    if (editingUser) {
      setUsers(users.map(u => (u.id === user.id ? user : u)))
    } else {
      setUsers([...users, user])
    }
    setShowForm(false)
    setEditingUser(null)
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
          {users.map(u => (
            <tr key={u.id} className="border-t dark:border-gray-600">
              <td className="p-2 border">{u.username}</td>
              <td className="p-2 border">{u.email}</td>
              <td className="p-2 border">{u.role.charAt(0).toUpperCase() + u.role.slice(1)}</td>
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
          ))}
        </tbody>
      </table>

      {showForm && (
        <UserForm
          user={editingUser}
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