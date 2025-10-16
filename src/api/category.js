import axios from "axios";

const API_BASE_URL = 'http://127.0.0.1:8001/api'

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true,
})

export const categoryApi = {
    getCategories: () => api.get('/categories'),
    createCategory: (categoryData) => api.post('/categories', categoryData),
    updateCategory: (categoryID, categoryData) => api.patch(`/categories/${categoryID}`, categoryData),
    deleteCategory: (categoryId) => api.delete(`/categories/${categoryId}`),
    addProject: (categoryID, projectID) => api.post(`/categories/${categoryID}/projects/${projectID}`)
}