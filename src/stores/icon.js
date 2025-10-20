import { ref, computed } from "vue";
import { iconApi } from "@/api/icon";
import { defineStore } from 'pinia'
import { saveToCache } from "@/cache/cache";

export const useIconStore = defineStore('icon', () => {

    const arrayBufferToDataUrl = (buffer, mime = 'image/png') => {
        return new Promise((resolve, reject) => {
            try {
                const blob = new Blob([buffer], { type: mime })
                const reader = new FileReader()
                reader.onload = () => resolve(reader.result) 
                reader.onerror = reject
                reader.readAsDataURL(blob)
            } catch (e) {
                reject(e)
            }
        })
    }

    const upload = async (icon) => {
        try{
            const response = await iconApi.upload(icon)
            return { success: true, data: response.data }
        } catch (error) {
            const errorMessage = error?.response?.data?.details || error?.message || error
            return { success: false, error: errorMessage }
        }
    }

    const getIcon = async (project_id, icon_id) => {
        try {
            const iconResponse = await iconApi.getProjectIcon(project_id)

            const mime = iconResponse?.headers?.['content-type'] || 'image/png'

            const dataUrl = await arrayBufferToDataUrl(iconResponse.data, mime)

            try {
                saveToCache(`project_icon_${project_id}`, dataUrl)
                saveToCache(`project_icon_id_${project_id}`, icon_id == null ? '' : String(icon_id))
            } catch (e) {
                console.warn('icon cache save failed', e)
            }

            return { success: true, data: dataUrl }
        } catch (error) {
            const errorMessage = error?.response || error
            return { success: false, error: errorMessage}
        }
    }

    const blobIcon = async (payload) => {
        try{
            if (typeof payload === 'string' && payload.startsWith('data:')) {
                const res = await fetch(payload)
                const blob = await res.blob()
                return { success: true, data: URL.createObjectURL(blob) }
            }
            const blob = new Blob([payload], { type: 'image/png' })
            const iconFile = URL.createObjectURL(blob)
            return { success: true, data: iconFile }
        } catch (error) {
            return { success: false, error: error}
        }
    }

    return {
        upload,
        getIcon,
        blobIcon
    }
})