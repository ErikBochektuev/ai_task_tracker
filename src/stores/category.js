import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { categoryApi } from "@/api/category";
import { saveToCache } from "@/cache/cache";
import { loadFromCache } from "@/cache/cache";

export const useCategoryStore = defineStore('category', () => {

    const getCategories = async () => {
        try {
            const response = await categoryApi.getCategories()
            saveToCache('categories', response.data)
            return { success: true, data: response.data}
        } catch (error) { 
            const cachedData = loadFromCache('categories')
            if (cachedData) {
                console.log('Используются кэшированные данные категорий')
                return { success: true, data: cachedData}
            } else {
                const errorMessage = error.response.data.details
                return { success: false, error: errorMessage }
            }
        }
    }

    const createCategory = async (categoryData) => {
        try {
            const response = await categoryApi.createCategory(categoryData)
            return { success: true, data: response.data }
        } catch (error) {
            const errorMessage = error.response.data.details
            return { success: false, data: errorMessage }
        }
    }

    const updateCategory = async (categoryID, categoryData) => {
        try {
            const response = await categoryApi.updateCategory(categoryID, categoryData)
            return { success: true, data: response.data }
        } catch (error) {
            const errorMessage = error.response
            return { success: false, error: errorMessage }
        }
    }

    const deleteCategory = async (categoryID) => {
        try {
            const response = await categoryApi.deleteCategory(categoryID)
            
            return { success: true, data: response.data }
        } catch (error) {
            console.log('error',error)
            const errorMessage = error.response
            
            return { success: false, error: errorMessage }
        }
    }

    const addProject = async (categoryID, projectID) => {
        try {
            const response = await categoryApi.addProject(categoryID, projectID)
            return { success: true, data: response.data }
        } catch (error) {
            const errorMessage = error.response.data.details
            return { success: false, error: errorMessage }
        }
    }

    return {
        getCategories,
        createCategory,
        updateCategory,
        deleteCategory,
        addProject,
    }
})