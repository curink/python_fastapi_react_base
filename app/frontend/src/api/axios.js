import axios from "axios"

const baseURL =
  import.meta.env.MODE === "development"
    ? "http://localhost:8000/api"
    : "/api"

const api = axios.create({
  baseURL,
  withCredentials: true, // penting untuk kirim cookie refresh_token
})

// Tambahkan Authorization token dari localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Intercept response untuk handle 401 dan refresh
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true

      try {
        const res = await axios.post(`${baseURL}/refresh-token`, {}, {
          withCredentials: true,
        })
        const newToken = res.data.access_token
        localStorage.setItem("token", newToken)
        original.headers.Authorization = `Bearer ${newToken}`
        return api(original)
      } catch (e) {
        localStorage.removeItem("token")
        window.location.href = "/login"
      }
    }

    return Promise.reject(err)
  }
)

export default api