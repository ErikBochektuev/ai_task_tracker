import axios from "axios";

const API_BASE_URL = 'http://127.0.0.1:8001/api/'

const api = axios.create({
    baseURL: API_BASE_URL,
    header: {
        'Content-Type': 'application/json'
    },
    withCredentials: true
})

export const commentApi = {
    getComment: (projectID, taskID, skip, limit) => api.get(`projects${projectID}/tasks/${taskID}/comments?skip=${encodeURIComponent(skip)}&limit=${encodeURIComponent(limit)}`),
    createComment: (projectID, taskID, parentID, commentData) => api.post(`projects${projectID}/tasks/${taskID}/comments?comment_id=${encodeURIComponent(parentID)}`, commentData),
    updateComment: (projectID, taskID, commentID, commentData) => api.patch(`projects${projectID}/tasks/${taskID}/comments/${commentID}`, commentData),
    deleteComment: (projectID, taskID, commentID) => api.delete(`projects${projectID}/tasks/${taskID}/comments/${commentID}`)
}