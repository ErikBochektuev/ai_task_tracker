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
        </div>
        <div class="borders">
        </div>
        <img src="../assets/icons/arrow-right.svg" alt="следующая неделя" class="icon arrow right" @click="changeWeek('next')">
    </div>
</template>

<script>
export default {
    name: 'calendar_7',
    data() {
        return {
            currentDate: '',
            currentWeekDay: null,
            currentWeek: true,
            newDate: null,
            getDays: 7,
            days: ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота','Воскресенье'],
            dates: [],
            duration: null,
            start: null,
        }
    },
    props: {
        tasks: {
            type: Object,
            required: true
        }
    },
    methods: {
        getCurrentDate() {
            const date = new Date();
            const isoString = date.toISOString();

            const currentDay = date.getDay();
            
            const monday = new Date(date);
            monday.setDate(date.getDate() - (currentDay + 6) % 7);
            
            this.dates = [];
            for (let i = 0; i < 7; i++) {
                const weekDay = new Date(monday);
                weekDay.setDate(monday.getDate() + i);
                this.dates.push(weekDay.getDate());
            }
            
            this.currentWeekDay = currentDay === 0 ? 6 : currentDay - 1;
            
            return isoString.replace('Z', '000000').slice(0, -3); 
        }, 
        changeWeek(value) {
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
        }
    },
     
    async mounted() {
        this.currentDate = this.getCurrentDate()
    }
}
</script>