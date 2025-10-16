import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8001/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

export const authApi = {
  login: (credentials) => api.post('/auth/sign-in', credentials),
  
  register: (userData) => api.post('/auth/sing-up', userData),

  createProject: (projectData) => api.post('/projects', projectData),
  
} 