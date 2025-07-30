import { createContext, useContext, useEffect, useState } from "react"

const AppConfigContext = createContext()

export function AppConfigProvider({ children }) {
  const [config, setConfig] = useState({ app_name: "..." })

  useEffect(() => {
    fetch("/api/config")
      .then((res) => res.json())
      .then((data) => {
        setConfig(data)
        if (data.app_name) document.title = data.app_name
      })
      .catch((err) => {
        console.error("Gagal fetch config:", err)
      })
  }, [])

  return (
    <AppConfigContext.Provider value={config}>
      {children}
    </AppConfigContext.Provider>
  )
}

export const useAppConfig = () => useContext(AppConfigContext)