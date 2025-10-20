<template>
    <div class="project__card" @click="$emit('toProject')">
        <div class="project__card--info">
            <div class="project__card--info--avatar" v-if="!iconFile">{{ project.name[0] }}</div>
            <img class="project__card--info--avatar" :src="iconFile" v-if="iconFile" alt="">
            <span class="project__card--info--title">{{ project.name }}</span>
        </div>
        <button class="project__card--settings" @click.stop="$emit('openProject')" title="Настройки проекта" v-if="typeCard === 'settings'">
            <img class="project__card--settings--img" src="../assets/settings.svg" width="22" height="22" alt="">
        </button>
        <button class="project__card--settings" title="Настройки проекта" v-if="typeCard === 'add'">
            +
        </button>
    </div>
</template>

<script>
import { useIconStore } from '@/stores/icon';
import { loadFromCache } from '@/cache/cache';

export default {
    data() {
        return {
            iconFile: null
        }
    },
    methods: {
        async getIcon() { 
            try {
                const response = await useIconStore().getIcon(this.project.id, this.project.icon_id)

                if (response.success) {
                    this.iconFile = response.data
                    console.log('Иконка получена', this.iconFile)
                } else {
                    console.log('Ошибка', response.error, response)
                }
            } catch (error) {
                console.log(error)
            }
        }
    },
    props: {
        project: {
            type: Object,
            required: true
        },
        typeCard: {
            type: String,
            required: true
        }
    },
    async mounted(){
        const icon = loadFromCache(`project_icon_id_${this.project.id}`)
        console.log(this.project)
        console.log(icon, this.project.icon_id)
        if (icon === this.project.icon_id){
            try {
                const iconNotFile = loadFromCache(`project_icon_${this.project.id}`)
                this.iconFile = useIconStore().blobIcon(iconNotFile)
                console.log('Иконка взята из кэша')
            } catch (error) {
                localStorage.removeItem(`project_icon_id_${this.project.id}`)
                localStorage.removeItem(`project_icon_${this.project.id}`)
                await this.getIcon()
            }
            
        } else {
            localStorage.removeItem(`project_icon_id_${this.project.id}`)
            localStorage.removeItem(`project_icon_${this.project.id}`)
            await this.getIcon()
            console.log('Иконка обновлена')
        }
        
    }
}
</script>