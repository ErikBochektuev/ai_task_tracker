import axios from "axios";

const API_BASE_URL = 'http://127.0.0.1:8001/api'

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'multipart/form-data'
    },
    withCredentials: true
})


export const iconApi = {
    upload: (icon) => api.post('/icons', icon),
    getProjectIcon: (project_id) => api.get(`/projects/${project_id}/icon`, { responseType: 'arraybuffer' }) 
}