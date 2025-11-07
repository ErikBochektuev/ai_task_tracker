<template>
    <div class="layout">
        <Loader v-if="loading"></Loader>
        <div class="container wrapper" >
            <aside class="wrapper__aside">
            
            </aside>
            <div class="wrapper__info" >
                <h1 class="wrapper___info--title"> У вас нет никаких задач</h1>
                <div class="wrapper__info--btn">
                    <buttonComponent 
                    @click="createModalFunc"
                    :text="'Создать задачу'"
                    class="positive"/>
                </div>
            </div>
            <createTask 
            v-if="create"
            :projects="projects"
            @close="createModalFunc"/>
        </div>

        <div class="create_module">
            <img src="../assets/icons/plus.svg" alt="add" class="create_module__icon">
            <div class="create_module__create create_project" title="Создать проект" @click="createModalFunc('project')">
                <img src="../assets/icons/create_project.svg" alt="create project">
            </div>
            <div class="create_module__create create_task" title="Создать задачу" @click="createModalFunc('task')">
                <img src="../assets/icons/create_task.svg" alt="create task" >
            </div>
        </div>

        <calendar_7 v-if="tasks.length > 0" :tasks="tasks" />
        <createTask 
        v-if="create"
        :projects="projects"
        @close="closeModal"/>
        <createProject 
        v-if="createProject"
        @close="closeModal"/>
    </div>
</template>

<script>
import { useTaskStore } from '@/stores/tasks';
import Loader from '@/components/Loader.vue';
import buttonComponent from '@/components/button.vue';
import calendar_7 from '@/components/calendar_7.vue';
import createTask from '@/modalWindows/createTask.vue';
import createProject from '@/modalWindows/createProject.vue';
import { loadFromCache } from '@/cache/cache';

export default {
    name: 'calendar',
    components: { Loader, buttonComponent, calendar_7, createTask, createProject },
    data() {
        return {
            tasks: [],
            currentDate: '',
            currentWeekDay: null,
            getDays: 7,

            create: false,
            createProject: false,

            monday: '',
            loading: true
        }
    },
    methods: {
        closeModal() {
            this.create = false
            this.createProject = false
        },
        createModalFunc(value) {
            switch (value) {
                case 'project':
                    this.createProject = true
                    break
                case 'task':
                    this.create = true
            }
            // this.create = !this.create
        },
        async getTasks() {
            try {
                const response = await useTaskStore().byDate(this.monday, this.getDays)
                if (response.success) {
                    this.tasks = response.data.items
                } else {
                    console.log(response.error)
                }
            } catch (error) {
                console.log(error)
            } finally {
                this.loading = false
            }
        },
        getCurrentDate() {
            const now = new Date();
            const isoString = now.toISOString();
            this.currentWeekDay = now.getDay() === 0 ? 6 : now.getDay() - 1
            const monday_day = new Date();
            monday_day.setDate(monday_day.getDate() - (monday_day.getDay() + 6) % 7);
            this.monday = `${monday_day.getFullYear()}-${monday_day.getMonth()+1}-${monday_day.getDate() > 9 ? monday_day.getDate() : '0'+monday_day.getDate()}`
            console.log(this.monday)
            return isoString.replace('Z', '000000').slice(0, -3); 
        },
    },
     
    async mounted() {
        this.currentDate = this.getCurrentDate()
        console.log(this.currentDate)
        this.projects = loadFromCache('projects')
        await this.getTasks()   
    }
}
</script>