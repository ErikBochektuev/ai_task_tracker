<template>
    <div class="taskCard">
        <div class="taskCard__color" :style="{ background: task.color }"></div>
        <h1 class="taskCard__title" @click="openDescripiton">{{ task.title }}</h1>
        <div class="taskCard__description" :class="{'active': active}">
            {{ task.description }}
            <br>
            Выполнить до:
            <br>
            {{ task.end }}
        </div>
    </div>
</template>

<script>
export default {
    name: 'taskCard',
    data() {
        return {
            active: false
        }
    },
    props: {
        task: {
            type: Object,
            required: true
        }
    },
    methods: {
        openDescripiton(){
            this.active = !this.active
        }
    }
}
</script>
