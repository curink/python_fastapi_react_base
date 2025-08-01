import { Menu, Moon, Sun } from "lucide-react"
import { useEffect, useState } from "react"

export default function Header({ setSidebarOpen }) {
  const [isDark, setIsDark] = useState(() => {
    // Cek localStorage saat komponen pertama kali render
    const storedTheme = localStorage.getItem("theme")
    return storedTheme === "dark"
  })

  useEffect(() => {
    const root = window.document.documentElement
    if (isDark) {
      root.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      root.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
  }, [isDark])

  return (
    <header className="flex items-center justify-between bg-white dark:bg-gray-800 px-4 py-2 shadow-md">
      <div className="flex items-center gap-2">
        {/* Hamburger hanya muncul di mobile */}
        <button onClick={() => setSidebarOpen(true)} className="md:hidden">
          <Menu />
        </button>
        <h1 className="text-lg font-bold">Dashboard</h1>
      </div>

      <button
        onClick={() => setIsDark(!isDark)}
        className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        aria-label="Toggle Dark Mode"
      >
        {isDark ? <Sun /> : <Moon />}
      </button>
    </header>
  )
}