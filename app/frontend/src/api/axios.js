import axios from "axios"

const baseURL =
  import.meta.env.MODE === "development"
    ? "http://localhost:8000/api"
    : "/api"

const api = axios.create({ baseURL })

// Tambahkan Authorization token dari localStorage (jika ada)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Intercept response untuk handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token")
      window.location.href = "/login"
    }

    return Promise.reject(error)
  }
)

export default api