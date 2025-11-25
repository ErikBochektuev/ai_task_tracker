<template>
    <div class="comment-wrapper">
        <div class="input__group">
            
            <input type="text" class="input__group--input" placeholder="Написать комментарий" v-model="comment_text">
            <div class="button">
                <img src="../assets/icons/arrow-right.svg" alt="post" class="icon" @click="postComment()">
            </div>            
        </div>
    </div>
</template>

<script>
import { useCommentStore } from '@/stores/comment';

export default {
    name: 'commentsComponent',
    props: {
        projectID: {
            type: Number,
            required: true
        },
        taskID: {
            type: Number,
            required: true
        }
    },
    data() {
        return {
            skip: 0,
            limit: 5,
            comments: [],
            comment_text: '',
            parent_id: 0
        }
    },
    methods: {
        async getComments() {
            try {
                const response = await useCommentStore().getComment(this.projectID, this.taskID, this.skip, this.limit)
                if (response.success){
                    this.comments = response.data.items
                    console.log(this.comments)
                    
                }else{
                    console.log('ошибка при получении задачи от ссервера (1)', response.error)
                }
            } catch (error) {
                console.log('ошибка при получении задачи от ссервера (2)', error)
            }
        },
        async postComment() {
            if (!this.comment_text){
                return
            }

            try {
                const response = await useCommentStore().createComment(this.projectID, this.taskID, this.parent_id, {
                    text: this.comment_text
                })
                if (response.success){
                    await this.getComments()
                } else {
                    console.log('Произошла ошибка при создании комментария (1)', response.error)
                }
            } catch (error) {
                console.log('Произошла ошибка при создании комментария (2)', error)
            }
        }
    },
    async mounted() {
        await this.getComments()
    }
}
</script>

<style scoped>
@import '../assets/components/comment.sass';
</style>