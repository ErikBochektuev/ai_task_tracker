import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { projectApi } from '@/api/projects'
import { saveToCache } from '@/cache/cache'
import { loadFromCache } from '@/cache/cache'

export const useProjectsStore = defineStore('project', () => {
  const isLoading = ref(false)

  const getIsLoading = computed(() => isLoading.value)

  // Actions
  const getProjects = async () => {
    isLoading.value = true
    try {
      const response = await projectApi.getProjects()
      saveToCache('projects', response.data)
      return { success: true, data: response.data }
    } catch (error) {
      const cachedData = loadFromCache('projects')
      if (cachedData) {
        console.log('Используются кэшированные данные проектов')
        return { success: true, data: cachedData}
      } else {
        const errorMessage = error.response || 'Ошибка получения проектов'
        return { success: false, error: errorMessage }
      }
    } finally {
      isLoading.value = false
    }
  }

  const createProject = async (projectData) => {
    isLoading.value = true
    try {
      const response = await projectApi.createProject(projectData)
      return { success: true, data: response.data }
    } catch (error) {
      const errorMessage = error.response || 'Ошибка создания проекта'
      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }
  
  const deleteProject = async (projectID) => {
    isLoading.value = true
    try {
      const response = await projectApi.deleteProject(projectID)
      console.log(response)
      return { success: true, data: response.data }
    } catch (error) {
      const errorMessage = error.response.data.detail || 'Ошибка удаления проекта'
      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  const updateProject = async (projectID, projectData) => {
    isLoading.value = true 
    try {
      const response = await projectApi.updateProject(projectID, projectData)
      return { success: true, data: response.data }
    } catch (error) {
      const errorMessage = error.response || 'Ошибка при обновлении проекта'
      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  const getProjectUsers = async (projectID) => {
    isLoading.value = true
    try {
      const response = await projectApi.getProjectMembers(projectID)
      return { success: true, data: response.data }
    } catch (error) {
      const errorMessage = error.response || 'Ошибка при получении пользователей'
      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  const addProjectMember = async  (projectID, userData) => {
    isLoading.value = true
    try {
      const response = await projectApi.addProjectMember(projectID, userData)
      return { success: true, data: response.data }
    } catch (error) {
      
      const errorMessage = error.response
      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  const deleteMember = async (api_data) => {
    isLoading.value = true
    try {
      const response = await projectApi.deleteMember(api_data)
      return { success: true, data: response.data }
    } catch ( error ) {
      const errorMessage = error.response.data.detail
      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  const acceptInvite = async (token) => {
    isLoading.value = true
    try {
      const response = await projectApi.acceptInvite(token)
      return { success: true, data: response.data }
    } catch (error) {
      const errorMessage = error.response.data.detail
      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  const leaveProject = async (projectID) => {
    isLoading.value = true
    try {
      const response = await projectApi.leaveProject(projectID)
      return { success: true, data: response.data }
    } catch (error) {
      const errorMessage = error.response.data.detail
      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  const changeRole = async (projectID, memberID, projectData) => {
    isLoading.value = true 
    try {
      const response = await projectApi.changeRole(projectID, memberID, projectData)
      return { success: true, data: response.data }
    } catch (error) {
      const errorMessage = error.response.data
      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }



  return {

    isLoading,
    
    getIsLoading,
    
    getProjects,
    createProject,
    deleteProject,
    updateProject,

    getProjectUsers,
    addProjectMember,
    acceptInvite,
    deleteMember,
    leaveProject,
    changeRole,
  }
})