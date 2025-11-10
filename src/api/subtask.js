import axios from "axios";

const API_BASE_URL = 'http://127.0.0.1:8001/api'

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true
})

export const subTaskApi = {
    createSubtask: (projectID, taskID, subtaskData) => api.post(`/projects/${projectID}/tasks/${taskID}/subtasks`, subtaskData),
    updateSubtask: (projectID, taskID, subtaskID, subtaskData) => api.patch(`/projects/${projectID}/tasks/${taskID}/subtasks/${subtaskID}`, subtaskData),
    deleteSubtask: (projectID, taskID, subtaskID) => api.delete(`/projects/${projectID}/tasks/${taskID}/subtasks/${subtaskID}`)
}

