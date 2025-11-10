import { defineStore } from "pinia";
import { tagsApi } from "@/api/tags";
import { saveToCache } from "@/cache/cache";
import { loadFromCache } from "@/cache/cache";

export const useTagStore = defineStore('tag', () => {
    const getProjectTags = async (projectID) => {
        try {
            const response = await tagsApi.getProjectTags(projectID)
            saveToCache(`tags_project_${projectID}`, response.data)
            return { success: true, data: response.data }
        } catch (error) {
            const cachedData = loadFromCache(`tags_project_${projectID}`)
            if (cachedData) {
                return { success: true, data: cachedData }
            }
            return { success: false, error }
        }
    }

    const createTag = async (projectID, tagData) => {
        try {
            const response = await tagsApi.createTag(projectID, tagData)
            return { success: true, data: response.data }
        } catch (error) {
            const errorMessage = error.response.data.detail 
            return { success: false, error: errorMessage }
        }
    }

    const updateTag = async (projectID, tagID, tagData) => {
        try {
            const response = await tagsApi.updateTag(projectID, tagID, tagData)
            return { success: true, data: response.data }
        } catch (error) {
            const errorMessage = error.response.data.details
            return { success: false, error: errorMessage }
        }
    }

    const deleteTag = async (projectID, tagID) => {
        try {
            const response = await tagsApi.deleteTag(projectID, tagID)
            return { success: true, data: response.data }
        } catch (error) {
            const errorMessage = error.response.data.details
            return { success: false, error: errorMessage }
        }
    }

    return { 
        getProjectTags,
        createTag,
        updateTag,
        deleteTag
    }
})