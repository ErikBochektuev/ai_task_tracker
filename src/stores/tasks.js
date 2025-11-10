import { defineStore } from "pinia";
import { taskApi } from "@/api/tasks";
import { saveToCache } from "@/cache/cache";
import { loadFromCache } from "@/cache/cache";

export const useTaskStore = defineStore('task', () => {
    const getTasks = async (projectID) => {
        try {
            const response = await taskApi.getTasks(projectID)
            saveToCache(`tasks_project_${projectID}`, response.data)
            return { success: true, data: response.data }
        } catch (error) {
            const cachedData = loadFromCache(`tasks_project_${projectID}`)
            if (cachedData) {
                console.log('Используются кэшированные данные задач')
                return { success: true, data: cachedData }
            } else {
                const errorMessage = error.response.data.details
                return { success: false, error: errorMessage }
            }
        }
    }

    const getTask = async (projectID, taskID) => {
        try {
            const response = await taskApi.getTask(projectID, taskID)
            saveToCache(`task_${taskID}`, response.data)
            return { success: true, data: response.data }
        } catch (error) {
            const cachedData = loadFromCache(`task_${taskID}`)
            if (cachedData) {
                console.log('Используются кэшированные данные задачи')
                return { success: true, data: cachedData }
            } else {
                const errorMessage = error.response.data.details
                return { success: false, error: errorMessage }
            }
        }
    }

    const createTask = async (projectID, taskData) => {
        try {
            const response = await taskApi.createTask(projectID, taskData)
            return { success: true, data: response.data }
        } catch (error) {
            const errorMessage = error.response.data.detail 
            return { success: false, error: errorMessage }
        }
    }

    const updateTask = async (projectID, taskID, taskData) => {
        try {
            const response = await taskApi.updateTask(projectID, taskID, taskData)
            return { success: true, data: response.data }
        } catch (error) {
            const errorMessage = error.response.data.details
            return { success: false, error: errorMessage }
        }
    }

    const deleteTask = async (projectID, taskID) => {
        try {
            const response = await taskApi.deleteTask(projectID, taskID)
            return { success: true, data: response.data }
        } catch (error) {
            const errorMessage = error.response.data.details
            return { success: false, error: errorMessage }
        }
    }

    const byDate = async (date, days) => {
        try {
            const response = await taskApi.byDate(date,days)
            return { success: true, data: response.data }
        } catch (error) {
            const errorMessage = error.response.data.details 
            return { success: false, error: errorMessage }
        }
    }

    return {
        getTasks,
        getTask,
        createTask,
        updateTask,
        deleteTask,
        byDate
    }
})