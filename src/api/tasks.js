import axios from "axios";

const API_BASE_URL = 'http://127.0.0.1:8001/api'

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true,
})

export const taskApi = {
    getTasks: (projectID) => api.get(`/projects/${projectID}/tasks`),
    createTask: (projectID, taskData) => api.post(`/projects/${projectID}/tasks`, taskData),
    updateTask: (projectID, taskID, taskData) => api.patch(`/projects/${projectID}/tasks/${taskID}`, taskData),
    deleteTask: (projectID, taskID) => api.delete(`/projects/${projectID}/tasks/${taskID}`),

    byDate: (date, days) => api.get(`/projects/tasks?date=${encodeURIComponent(date)}&days_after=${days}`)
}