import { defineStore } from "pinia";
import { commentApi } from "@/api/comment";

export const useCommentStore = defineStore('comment', () => {
    const getComment = async (projectID, taskID, skip, limit) => {
        try {
            const response = await commentApi.getComment(projectID, taskID, skip, limit)
            return { success: true, data: response.data }
        } catch (error) {
            return { success: false, error: error}
        }
    }

    const createComment = async (projectID, taskID, parentID, commentData) => {
        try {
            const response = await commentApi.createComment(projectID, taskID, parentID, commentData)
            return { success: true, data: response.data }
        } catch (error) {
            return { success: false, error: error}
        }
    }

    const updateComment = async (projectID, taskID, commentID, commentData) => {
        try {
            const response = await commentApi.updateComment(projectID, taskID, commentID, commentData)
            return { success: true, data: response.data }
        } catch (error) {
            return { success: false, error: error}
        }
    }

    const deleteComment = async (projectID, taskID, commentID) => {
        try {
            const response = await commentApi.deleteComment(projectID, taskID, commentID)
            return { success: true, data: response.data }
        } catch (error) {
            return { success: false, error: error}
        }
    }

    return {
        getComment,
        createComment,
        updateComment,
        deleteComment
    }
})