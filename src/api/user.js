import axios from "axios";

const API_BASE_URL = 'http://127.0.0.1:8001/api'

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true
})

export const userApi = {
    getMe: () => api.get('/users/me'),
    updateProfile: (profileData) => api.patch('/users/me', profileData),
    getUserIcon: (userID) => api.get(`/users/${userID}/icon`, { responseType: 'arraybuffer' }),
}