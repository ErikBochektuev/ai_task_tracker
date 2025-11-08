<template>
    <div class="container wrapper calendar">
        <img src="../assets/icons/arrow-left.svg" alt="предыдущая неделя" class="icon arrow left" @click="changeWeek('prev')"/>
        <div class="container__time">
            <div class="container__time--block" v-for="item in 24" :key="item">
                {{ item-1 < 10 ? 0+(item-1).toString() : (item-1) }}:00
                <div class="container__time--block--line" :style="{top: (51+100*item).toString()+'px'}"></div>
            </div>
        </div>
        <div class="container__days" v-for="(day, index) in days" :key="index" :style="{'border-left': index === 0 ? '1px solid #d2d2d2' : ''}">
            <div class="container__days--day" :style="{background: index === currentWeekDay && currentWeek === true ? 'green' : ''} ">
                {{ day }}
                <br>
                {{ dates[index] }}
            </div>
            <div class="container__days--task">
                <div class="container__days--task--item" v-for="(task, task_index) in render_tasks[index]" :key="task.id" 
                :style="getStyles(task_index, task)">
                    <div class="container__days--task--item--line" :style="{background: task.color}"></div>
                    <div class="container__days--task--item--descr">
                        {{ task.title }}
                    </div>
                </div>
            </div>
        </div>
        <div class="borders">
        </div>
        <img src="../assets/icons/arrow-right.svg" alt="следующая неделя" class="icon arrow right" @click="changeWeek('next')">
    </div>
</template>

<script>
import { useTaskStore } from '@/stores/tasks';
export default {
    name: 'calendar_7',
    data() {
        return {

            tasks: [],
            currentDate: '',
            currentWeekDay: null,
            currentWeek: true,
            start_week: '',
            newDate: null,
            getDays: 7,
            days: ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота','Воскресенье'],
            dates: [],
            render_tasks: [[]*7],
            duration: null,
            start: null,
        }
    },
    methods: {
        getStyles(index, task){
            if (task.date_start === task.date_end) {
                return {
                    height: `${task.duration * 100}px`, 
                    left: `${10*index}px`,
                    width: `calc(100% - ${10*index}px)`,
                    // overflow: 'hidden',
                    top: `${51 + task.day_start * 100}px`
                }
            } else {
                return {
                    // height: `${((24 - task.date_start) * 100)}px`, 
                    left: `${10*index}px`,
                    width: `calc(100% - ${10*index}px)`,
                    // // overflow: 'hidden',
                    // top: `${51 + task.date_start * 100}px`
                }
            } 
            
        },
        updateRenderTasks() {
            this.render_tasks = Array(7).fill().map(() => []);
            console.log('dates', this.dates)
            for (let i = 0; i < this.tasks.length; i++) {
                for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
                    console.log(this.tasks[i].title, this.tasks[i].date_start, this.tasks[i].date_end, this.dates[dayIndex])
                    if (this.tasks[i].date_start !== this.tasks[i].date_end && this.dates[dayIndex] === this.tasks[i].date_end) {
                        this.render_tasks[dayIndex].push(this.tasks[i]);
                    }
                    if (this.tasks[i].date_start === this.tasks[i].date_end && this.dates[dayIndex] === this.tasks[i].date_start) {
                        this.render_tasks[dayIndex].push(this.tasks[i]);
                    }
                }
            }
            
            for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
                this.render_tasks[dayIndex].sort((a, b) => b.duration - a.duration);
            }
            console.log('render_tasks', this.render_tasks);
        },
        validationData() {
            for (let i = 0; i < this.tasks.length; i++) {
                this.tasks[i].duration = (new Date(this.tasks[i].end) - new Date(this.tasks[i].start)) / (1000 * 60 * 60);
                this.tasks[i].date_start = new Date(this.tasks[i].start).getDate();
                this.tasks[i].date_end = new Date(this.tasks[i].end).getDate();
                const startHours = new Date(this.tasks[i].start)
                startHours.setHours(0,0,0,0)
                
                this.tasks[i].day_start = (new Date(this.tasks[i].start) - startHours) / (1000 * 60 * 60);
                
            }
            this.updateRenderTasks()
        },
        getCurrentDate() {
            const date = new Date();
            const isoString = date.toISOString();

            const currentDay = date.getDay();
            
            const monday = new Date(date);
            monday.setDate(date.getDate() - (currentDay + 6) % 7);
            this.start_week = `${monday.getFullYear()}-${monday.getMonth()+1}-${monday.getDate() > 9 ? monday.getDate() : '0'+monday.getDate()}`
            this.dates = [];
            for (let i = 0; i < 7; i++) {
                const weekDay = new Date(monday);
                weekDay.setDate(monday.getDate() + i);
                this.dates.push(weekDay.getDate());
            }
            
            this.currentWeekDay = currentDay === 0 ? 6 : currentDay - 1;
            
            return isoString.replace('Z', '000000').slice(0, -3); 
        }, 
        async changeWeek(value) {
            let date;
            this.newDate === null ? date = new Date() : date = new Date(this.newDate);
            this.currentWeek = false;
            
            switch (value) {
                case 'next':
                    date.setDate(date.getDate() + 7);
                    this.newDate = date.getTime();
                    break;
                case 'prev':
                    date.setDate(date.getDate() - 7);
                    this.newDate = date.getTime();
                    
                    break;
            }

            const monday = new Date(this.newDate);
            monday.setDate(monday.getDate() - (monday.getDay() + 6) % 7);
            this.start_week = `${monday.getFullYear()}-${monday.getMonth()+1 > 9 ? monday.getMonth()+1 : '0' + (monday.getMonth()+1)}-${monday.getDate() > 9 ? monday.getDate() : '0' + monday.getDate()}`
            const currentMonday = new Date();
            currentMonday.setDate(currentMonday.getDate() - (currentMonday.getDay() + 6) % 7);
            
            if (monday.toDateString() === currentMonday.toDateString()) {
                this.currentWeek = true;
            }

            this.dates = [];
            for (let i = 0; i < 7; i++) {
                const weekDay = new Date(monday);
                weekDay.setDate(monday.getDate() + i);
                this.dates.push(weekDay.getDate());
            }
            
            await this.getTasks()
            this.updateRenderTasks()
        },
        async getTasks() {
            this.$emit('load')
            try {
                const response = await useTaskStore().byDate(this.start_week, 7)
                if (response.success) {
                    console.log('response.data', response.data)
                    this.tasks = response.data.items
                    this.validationData()
                } else {
                    console.log(response.error)
                }
            } catch (error) {
                console.log(error)
            } finally {
                this.$emit('load')
            }
        },
    },
    async mounted() {
        this.currentDate = this.getCurrentDate()
        await this.getTasks()
        
        
    }
}
</script>