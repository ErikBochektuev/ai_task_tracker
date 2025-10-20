import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { userApi } from "@/api/user";

export const useUserStore = defineStore('user', () => {
    const getMe = async () => {
        try {
            const response = await userApi.getMe()
            return { success: true, data: response.data }
        } catch (error) {
            const errorMessage = error.response.data.details
            return { success: false, error: errorMessage }
        }
    }

    const updateProfile = async (profileData) => {
        try {
            const response = await userApi.updateProfile(profileData)
            return { success: true, data: response.data }
        } catch (error) {
            const errorMessage = error.response.data.detail
            console.log('errorMessage', errorMessage)
            return { success: false, error: errorMessage }
        }
    }

    const getUserIcon = async (userID) => {
        try {
            const response = await userApi.getUserIcon(userID)
            return { success: true, data: response.data }
        } catch (error) {
            const errorMessage = error.response.data.details
            return { success: false, error: errorMessage }
        }
    }

    return {
        getMe,
        updateProfile,
        getUserIcon
    }
})