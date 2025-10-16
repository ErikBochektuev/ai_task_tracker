import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8001/api'

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    }
})

export const resetApi = {
    sendCode: (email) => api.post(`/restore/forgot-password?email=${encodeURIComponent(email)}`),
    resetPasswordAccess: (user_id, code) => api.post(`/restore/reset-code?user_id=${encodeURIComponent(user_id)}&code=${encodeURIComponent(code)}`),
    resetPassword: (token, reset_data) => api.put(`/auth/reset-password?token=${encodeURIComponent(token)}`, reset_data)
}