import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '@/api/auth'
import router from '@/router'

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(false)
  const isLoading = ref(false)
  const token = ref('')
  const user_id = ref(null)

  const isAuth = computed(() => isAuthenticated.value)
  const getIsLoading = computed(() => isLoading.value)

  const setAuthData = () => {

    isAuthenticated.value = true

  }

  const clearAuthData = () => {

    isAuthenticated.value = false
    token.value = ''
    user_id.value = null
    localStorage.clear()
  }

  const login = async (credentials, remember) => {
    isLoading.value = true
    try {
      const response = await authApi.login(credentials)
      
      setAuthData()
      token.value = response.data.access_token
      user_id.value = response.data.user_id
      if (remember) {
        localStorage.setItem('token', response.data.access_token)
        localStorage.setItem('user_id', response.data.user_id)
      }
      

      return { success: true, data: response.data }
    } catch (error) {
      clearAuthData()
      const errorMessage = error.response?.data?.detail[0].msg || 'Ошибка авторизации'
      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  const register = async (userData) => {
    isLoading.value = true
    
    try {
      const response = await authApi.register(userData)
      
      return { success: true, data: response.data }
    } catch (error) {
      const errorMessage = error.response?.data?.detail[0].msg || 'Ошибка регистрации'
      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  const logout = () => {
    clearAuthData()
    router.push('/login')
  }

  const checkAuth = () => {
    const savedToken = localStorage.getItem('token')
    const savedUserId = localStorage.getItem('user_id')
    if (savedToken) {
      token.value = savedToken
      user_id.value = savedUserId ? Number(savedUserId) : null
      isAuthenticated.value = true
    } else {
      clearAuthData()
    }
  }


  const initialize = async () => {
    await checkAuth()
  }

  return {
 
    isAuthenticated,
    isLoading,
    token,
    user_id,
    
 
    isAuth,
    getIsLoading,
    

    login,
    register,
    logout,
    checkAuth,
    initialize
  }
})