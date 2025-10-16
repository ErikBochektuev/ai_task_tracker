import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8001/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },

})

export const projectApi = {
  createProject: (projectData) => api.post('/projects', projectData, { withCredentials: true }),
  getProjects: () => api.get('/projects', { withCredentials: true }), 
  deleteProject: (projectID) => api.delete(`/projects/${projectID}`, { withCredentials: true }),
  updateProject: (projectID, projectData) => api.patch(`/projects/${projectID}`, projectData, { withCredentials: true }),
  
  getProjectMembers: (projectID) => api.get(`/projects${projectID}/members`, { withCredentials: true }),
  addProjectMember: (projectID, userData) => 
    api.post(
      `/projects${projectID}/members/invite?email=${encodeURIComponent(userData.inv_email)}&role=${encodeURIComponent(userData.inv_role)}`,
      null,
      { withCredentials: true }
    ),
  acceptInvite: (token) => api.post(`/projects/members/confirm?invite_token=${encodeURIComponent(token)}`),
  deleteMember: (data) => api.delete(`/projects${data.project_id}/members/${data.user_id}`, { withCredentials: true }),
  leaveProject: (projectID) => api.delete(`/projects${projectID}/leave`, { withCredentials: true }),
  changeRole: (projectID, memberID, projectData) => api.put(`/projects/${projectID}/members/${memberID}`, projectData, { withCredentials: true })
}