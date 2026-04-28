import axios from 'axios'
import { getAuth } from 'firebase/auth'

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 30000,
})

client.interceptors.request.use(async (config) => {
  const auth = getAuth()
  const user = auth.currentUser
  if (user) {
    const token = await user.getIdToken(true) // Force refresh if near expiry
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      getAuth().signOut()
      window.location.href = '/'
    }
    return Promise.reject(error)
  }
)

export default client
