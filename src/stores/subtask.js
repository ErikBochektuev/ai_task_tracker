import { subTaskApi } from "@/api/subtask";
import { defineStore } from "pinia";

export const useSubtaskStore = defineStore('subtask', () => {
    const createSubtask = async (projectID, taskID, subtaskData) => {
        try {
            const response = await subTaskApi.createSubtask(projectID, taskID, subtaskData)
            return { success: true, data: response.data }
        } catch (error) {
            return { success: false, error: error }
        }
    }

    const updateSubtask = async (projectID, taskID, subtaskID, subtaskData) => {
        try {
            const response = await subTaskApi.updateSubtask(projectID, taskID, subtaskID, subtaskData)
            return { success: true, data: response.data }
        } catch (error) {
            return { success: false, error: error }
        }
    }

    const deleteSubtask = async (projectID, taskID, subtaskID) => {
        try {
            const response = await subTaskApi.deleteSubtask(projectID, taskID, subtaskID)
            console.log('response', response)
            return { success: true, data: response.data }
        } catch (error) {
            return { success: false, error: error }
        }
    }

    return {
        createSubtask,
        updateSubtask,
        deleteSubtask
    }
})