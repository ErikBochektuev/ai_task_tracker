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

        <calendar_7 v-if="tasks.length > 0" :tasks="tasks" />
    </div>
</template>

<script>
import { useTaskStore } from '@/stores/tasks';
import Loader from '@/components/Loader.vue';
import buttonComponent from '@/components/button.vue';
import calendar_7 from '@/components/calendar_7.vue';
import createTask from '@/modalWindows/createTask.vue';
import { loadFromCache } from '@/cache/cache';

export default {
    name: 'calendar',
    components: { Loader, buttonComponent, calendar_7, createTask },
    data() {
        return {
            tasks: [],
            currentDate: '',
            currentWeekDay: null,
            getDays: 7,
            create: false,

            loading: true
        }
    },
    methods: {
        createModalFunc() {
            this.create = !this.create
        },
        async getTasks() {
            try {
                const response = await useTaskStore().byDate(this.currentDate, this.getDays)
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
            return isoString.replace('Z', '000000').slice(0, -3); 
        },
    },
     
    async mounted() {
        this.currentDate = this.getCurrentDate()
        this.projects = loadFromCache('projects')
        await this.getTasks()   
    }
}
</script>