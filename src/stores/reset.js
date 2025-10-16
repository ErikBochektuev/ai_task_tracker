import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { resetApi } from "@/api/reset";

export const useResetStore = defineStore('reset', () => {

    const sendCode = async (email) => {
        try {
            const response = await resetApi.sendCode(email)
            return { success: true, data: response.data }
        } catch (error) {
            const errorMessage = error.response.data.detail
            return { success: false, error: errorMessage }
        } 
    }

    const resetPasswordAccess = async (user_id, code) => {
        try {
            const response = await resetApi.resetPasswordAccess(user_id, code)
            console.log(response)
            return { success: true, data: response.data}
        } catch (error) {
            console.log("error", error)
            const errorMessage = error.response.data.detail
            console.log("errorM", errorMessage)
            return { success: false, error: errorMessage}
        }
    }

    const resetPassword = async (token, reset_data) => {
        try {
            const response = await resetApi.resetPassword(token, reset_data)
            return { success: true, data: response.data}
        } catch (error) {
            const errorMessage = error.response.data.detail
            return { success: false, error: errorMessage }
        }
    }

    return {
        sendCode,
        resetPasswordAccess,
        resetPassword
    }
})