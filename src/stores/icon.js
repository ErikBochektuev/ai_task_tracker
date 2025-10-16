import { ref, computed } from "vue";
import { iconApi } from "@/api/icon";
import { defineStore } from 'pinia'
import { saveToCache } from "@/cache/cache";

export const useIconStore = defineStore('icon', () => {
    

    const upload = async (icon) => {
        try{
            const response = await iconApi.upload(icon)
            return { success: true, data: response.data }
        } catch (error) {
            const errorMessage = error.response.data.details
            return { success: false, error: errorMessage }
        }
    }

    const getIcon = async (project_id, icon_id) => {
        try {
            const iconResponse = await iconApi.getProjectIcon(project_id)
            const blob = new Blob([iconResponse.data], { type: 'image/jpeg' })
            const iconFile = URL.createObjectURL(blob)
            saveToCache(`project_icon_${project_id}`, iconFile)
            saveToCache(`project_icon_id_${project_id}`, icon_id)
            return { success: true, data: iconFile }
        } catch (error) {
            const errorMessage = error
            return { success: false, error: errorMessage}
        }
    }

    return {
        upload,
        getIcon
    }
})