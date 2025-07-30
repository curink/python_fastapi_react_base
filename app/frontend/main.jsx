import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import { AuthProvider } from "./src/contexts/AuthContext"
import ErrorBoundary from './src/components/ErrorBoundary'
import App from "./App"
import "./src/index.css"

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
            <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)