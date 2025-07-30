import {
  LayoutDashboard,
  FileText,
  Settings,
  Users,
  LogOut,
  X
} from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import Spinner from "./Sidebar"

// Komponen menu item untuk modularitas
function SidebarMenuItem({ to, icon, label, active, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-2 p-2 rounded transition-colors ${
        active
          ? "bg-gray-200 dark:bg-gray-700 font-semibold"
          : "hover:bg-gray-100 dark:hover:bg-gray-700"
      }`}
    >
      {icon} {label}
    </Link>
  )
}

export default function Sidebar({ open, setOpen }) {
  const { logout, user, loading } = useAuth()
  const { pathname } = useLocation()
  
  if (loading) return <div>Loading...</div> //<Spinner />
  if (!user) return null
  const handleLogout = () => {
    logout()
  }

  // Daftar menu berdasarkan role
  const menu = [
    { to: "/", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { to: "/tasks", label: "My Task", icon: <FileText size={18} /> },
    ...(user.role === "admin"
      ? [
          { to: "/users", label: "Users", icon: <Users size={18} /> },
          { to: "/settings", label: "Settings", icon: <Settings size={18} /> },
        ]
      : [])
  ]

  return (
    <>
      {/* Overlay mobile */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed z-40 top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 border-r shadow-md
          transform transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static md:block
        `}
      >
        {/* Header (mobile only) */}
        <div className="flex items-center justify-between p-4 md:hidden">
          <h2 className="text-lg font-bold">ShapexRx</h2>
          <button onClick={() => setOpen(false)}>
            <X />
          </button>
        </div>

        {/* Logo (desktop) */}
        <div className="p-6 font-bold text-xl hidden md:block">ShapexRx</div>

        {/* Menu navigasi */}
        <nav className="p-2 space-y-2">
          {menu.map(({ to, label, icon }) => (
            <SidebarMenuItem
              key={to}
              to={to}
              label={label}
              icon={icon}
              active={pathname === to}
              onClick={() => setOpen(false)}
            />
          ))}

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 p-2 w-full text-left text-red-500 hover:bg-red-100 dark:hover:bg-red-900 rounded"
          >
            <LogOut size={18} /> Logout
          </button>
        </nav>
      </aside>
    </>
  )
}