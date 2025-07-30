import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import { AuthProvider } from "./src/contexts/AuthContext"
import ErrorBoundary from './src/components/ErrorBoundary'
import App from "./App"
import "./src/index.css"

async function init() {
  try {
    const res = await fetch('/api/config')
    const data = await res.json()
    if (data.app_name) {
      document.title = data.app_name
    }
  } catch (err) {
    console.error('Gagal fetch config:', err)
  }

    ReactDOM.createRoot(document.getElementById("root")).render(
      <React.StrictMode>
        <BrowserRouter>
          <AuthProvider>
                <App />
          </AuthProvider>
        </BrowserRouter>
      </React.StrictMode>
    )
}

init()