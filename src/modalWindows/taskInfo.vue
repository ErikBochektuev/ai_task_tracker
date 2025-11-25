<template>
    <div class="modal-wrapper">
        <transition name="fade-modal">
            <div class="modal__container modal-content" v-if="task">
                <div class="modal__container--title">
                    <h1>Информация о задаче</h1>
                </div>
                <div class="modal__container--tags">
                    <span class="modal__container--tags--tag" v-for="(tag, index) in task.tags" :key="index">{{ tag }}</span>
                    <span class="modal__container--tags--tag" @click="createTag = true">Создать</span>                    
                </div>
                <div class="input__group" v-if="createTag">
                    <label for="name" class="input__group--label">Введите название тега</label>
                    <input type="text" id="name" class="input__group--input" v-model="tag.name" />
                    <label for="description" class="input__group--label">Введите описание</label>
                    <input type="text" id="description" class="input__group--input" v-model="tag.description" />
                    <label for="color" class="input__group--label">Введите цвет</label>
                    <input type="text" id="color" class="input__group--input" v-model="tag.color" />
                    <buttonComponent class="close" :text="'Сохранить'" @click="saveTag"/>
                </div>
                <div class="modal__container--info">
                    <p><strong>Название:</strong> {{ task.title }}</p>
                    <p><strong>Описание:</strong> {{ task.description ? task.description : 'Нет описания' }}</p>
                    <p><strong>Цвет:</strong> <span :style="{ backgroundColor: task.color, padding: '0 10px' }">{{ task.color ? task.color : 'Нет цвета' }}</span></p>
                    <p><strong>Дата начала:</strong> {{ task.start }}</p>
                    <p><strong>Дата окончания:</strong> {{ task.end }}</p>
                </div>
                <ul class="subtasks-list">
                    <subtaskCard 
                    v-for="subtask in task.subtasks" :key="subtask.id" 
                    :subtask="subtask" 
                    :projectId="task.project_id" 
                    :taskId="task.id"
                    @update="getTask"/>
                    <li class="subtask-item">
                        <div class="subtask-content  new-subtask">
                            <input type="text" v-model="form.name" class="input__group--input" placeholder="Новая подзадача"/>
                        </div>
                        <div class="subtask-actions">
                            <img src="../assets/icons/plus.svg" class="icon" alt="Создать" @click="createSubtask">
                        </div>
                    </li>
                </ul>

                <comment :projectID="projectID" :taskID="taskID" />

                <div class="button__group">
                    <buttonComponent 
                    class="close"
                    @click="$emit('close')"
                    :text="'Закрыть'"
                    />
                </div>


            </div>
        </transition>
    </div>
</template>

<script>
import buttonComponent from '@/components/button.vue';
import subtaskCard from '@/components/subtaskCard.vue';
import comment from '@/components/comment.vue';
import { useSubtaskStore } from '@/stores/subtask';
import { useTagStore } from '@/stores/tags';
import { useTaskStore } from '@/stores/tasks';

export default {
    name: 'taskInfo',
    components: { buttonComponent, subtaskCard, comment },
    props: {
        taskID: {
            type: Number,
            required: true
        },
        projectID: {
            type: Number,
            required: true
        }
    },
    data() {
        return {
            task: {},
            tag: {
                name: '',
                description: '',
                color: ''
            },
            createTag: false,
            form: {
                name: '',
                completed: false
            }
        }
    },
    methods: {
        async getTask() {
            try {
                const response = await useTaskStore().getTask(this.projectID, this.taskID)
                if (response.success) {
                    this.task = response.data
                    this.task.start = new Date(this.task.start).toLocaleString()
                    this.task.end = new Date(this.task.end).toLocaleString()
                } else {
                    console.log('Ошибка при получении задачи: (1)', response.error);
                }
            } catch (error) {
                console.log('Ошибка при получении задачи: (2)', error);
            }
        },
        async saveTag() {
            try {
                const response = await useTagStore().createTag(this.projectID, this.tag)
                if (response.success) {
                    const new_response = await useTaskStore().updateTask(
                        {
                            tags: [task]
                        }
                    )
                    this.task.tags.push(this.tag)
                    this.createTag = false

                } else {
                    console.log('Ошибка при создании тега: (1)', response.error);
                }
            } catch (error) {
                console.log('Ошибка при создании тега: (2)', error);
            }
        },
        async createSubtask() {
            try {
                const response = await useSubtaskStore().createSubtask(this.projectID, this.taskID, this.form)
                if (response.success) {
                    this.form.name = ''
                    await this.getTask()
                } else {
                    console.error('Ошибка при создании подзадачи:', response);
                }
            } catch (error) {
                console.error('Ошибка при создании подзадачи (2):', error);
            }
        }
    },
    async mounted() {
        await this.getTask()
        console.log(this.task);
    }
}
</script>