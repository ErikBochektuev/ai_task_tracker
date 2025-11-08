<template>
    <div class="modal-wrapper" @click.self="$emit('close')">
        <transition name="fade-modal" appear>
            <div class="modal__container modal-content">
                <div v-if="showNotification" class="notification" :class="notificationType">
                    {{ notificationMessage }}
                    <button @click="hideNotification" class="close-btn">×</button>
                </div>
                <div class="modal__container--title">
                    <h1>Создание задачи</h1>
                </div>
                <div class="modal__container--project">
                    <div class="project__card" @click="selectOpen" v-if="selected_project === null">
                        <span>Выбрать проект</span>
                        <div class="project__card--settings">+</div>
                    </div>
                    <projectCard 
                    v-else
                    
                    :project="selected_project"
                    :typeCard="'createTask'"
                    @click="selectOpen"/>
                    <div class="project__list accordeon" :class="{active: select}">
                        <projectCard 
                        v-for="project in projects"
                        :key="project.id"
                        :project="project"
                        :style="{ border : selected_project !== null && selected_project.id === project.id ? '1px solid #764ba2' : '',
                        cursor: selected_project !== null && selected_project.id === project.id ? 'default' : ''}"
                        @click="selectProject(project)"
                        :typeCard="'createTask'"
                        />
                    </div>
                </div>
                <div class="input__group">
                    <label for="title" class="input__group--label">Название задачи</label>
                    <input 
                    id="title"
                    v-model.trim="form.title"
                    type="text"
                    autocomplete="off"
                    placeholder="Название"
                    class="input__group--input">
                </div>
                <div class="input__group">
                    <label for="description" class="input__group--label">Описание задачи</label>
                    <input 
                    id="description"
                    v-model.trim="form.description"
                    type="text"
                    autocomplete="off"
                    placeholder="Описание"
                    class="input__group--input">
                </div>
                <div class="input__group">
                    <label for="color" class="input__group--label">Цвет обозначения задачи</label>
                    <input 
                    id="color"
                    v-model.trim="form.color"
                    type="text"
                    autocomplete="off"
                    placeholder="Цвет"
                    class="input__group--input">
                </div>
                <div class="input__group">
                    <label for="priority">Выберите приоритет задачи</label>
                    <div id="priority" class="input__group--priority">
                        <div class="input__group--priority--btn low" @click="form.priority = 'Низкий'">
                            Низкий
                        </div>
                        <div class="input__group--priority--btn medium" @click="form.priority = 'Средний'">
                            Средний
                        </div>
                        <div class="input__group--priority--btn high" @click="form.priority = 'Высокий'">
                            Высокий
                        </div>
                    </div>
                    
                </div>
                <div class="input__group">
                    <label for="start" class="input__group--label">Старт задачи</label>
                    <input 
                    id="start"
                    v-model.trim="start.date"
                    type="date"
                    autocomplete="off"
                    class="input__group--input end_date">
                    <input 
                    id="start"
                    v-model.trim="start.time"
                    type="time"
                    autocomplete="off"
                    class="input__group--input">
                </div>
                <div class="input__group">
                    <label for="end" class="input__group--label">Дедлайн задачи</label>
                    <input 
                    id="end"
                    v-model.trim="deadline.date"
                    type="date"
                    autocomplete="off"
                    class="input__group--input end_date">
                    <input 
                    id="end"
                    v-model.trim="deadline.time"
                    type="time"
                    autocomplete="off"
                    class="input__group--input">
                </div>
                
                <div class="input__group">
                    <label for="performer" class="input__group--label">Выполнитель задачи</label>
                    <input 
                    id="performer"
                    v-model.trim="form.performer_id"
                    type="number"
                    autocomplete="off"
                    class="input__group--input">
                </div>
                <div class="button__group">
                    <buttonComponent 
                    class="positive"
                    @click="createTask"
                    :text="'Создать'"/>
                    <buttonComponent 
                    class="close"
                    @click="$emit('close')"
                    :text="'Отмена'"/>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
import projectCard from '@/components/projectCard.vue';
import buttonComponent from '@/components/button.vue';
import { useTaskStore } from '@/stores/tasks';

export default {
    components: {projectCard, buttonComponent},
    data() {
        return {
            select: false,
            selected_project: null,
            form: {
                title: '',
                description: '',
                color: '',
                priority: '',
                status: 'Назначена',
                start: '',
                end: '',
                performer_id: null 
            },
            deadline: {
                time: '',
                date: ''
            },
            start: {
                time: '',
                date: ''
            },
            
            showNotification: false,
            notificationMessage: '',
            notificationType: 'error',
        }
    },
    methods: {
        selectOpen() {
            this.select = !this.select
        },
        selectProject(project) {
            this.selected_project = project
            console.log(this.selected_project)
            this.select = false
        },
        convertDate() {
            try {
                const dateTimeString = `${this.deadline.date}T${this.deadline.time}:00`
                this.form.end = dateTimeString
                const startTimeString = `${this.start.date}T${this.start.time}:00`
                this.form.start = startTimeString
            } catch (error) {
                console.log(error)
            }
        },
        async createTask(){
            this.convertDate()
            console.log(this.form)
            
            try {
                const response = await useTaskStore().createTask(this.selected_project.id, this.form)
                if (response.success) {
                    this.showNotificationMessage('Вы успешно создали задачу', 'success')
                    setTimeout(() => {
                        this.$emit('close')
                    }, 1500);

                } else {
                    console.log(response.error)
                }
            } catch (error) {
                this.showNotificationMessage(error, 'error')
            }
        },
        getCurrentDate() {
            const now = new Date();
            
            return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}T${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`; 
        }, 
        showNotificationMessage(message, type = 'error') {
            this.notificationMessage = message
            this.notificationType = type
            this.showNotification = true
            
            if (type === 'success') {
                setTimeout(() => {
                this.hideNotification()
                }, 3000)
            }
        },
            
        hideNotification() {
            this.showNotification = false
            this.notificationMessage = ''
        },
    },
    props: {
        projects: {
            type: Array,
            requires: true
        }
    }
}
</script>

<style lang="sass">
.project__list
    height: 0
    overflow: hidden
    interpolate-size: allow-keywords
    transition: height 0.3s ease-in-out
.active 
    height: auto

</style>