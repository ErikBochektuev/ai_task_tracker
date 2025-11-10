import axios from "axios";

const API_BASE_URL = 'http://127.0.0.1:8001/api'

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true,
})

export const tagsApi = {
    getProjectTags: (projectID) => api.get(`/projects/${projectID}/tags`),
    createTag: (projectID, tagData) => api.post(`/projects/${projectID}/tags`, tagData),
    updateTag: (projectID, tagID, tagData) => api.patch(`/projects/${projectID}/tags/${tagID}`, tagData),
    deleteTag: (projectID, tagID) => api.delete(`/projects/${projectID}/tags/${tagID}`)
}