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
                    console.warn('Ошибка получения иконки', response.error)
                }
            } catch (error) {
                console.error('getIcon error', error)
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
        if (this.project.icon_id === null) {
            console.log('Иконка не установлена для проекта', this.project.id)
            return
        }

        try {
            const cachedId = loadFromCache(`project_icon_id_${this.project.id}`)
            const cachedData = loadFromCache(`project_icon_${this.project.id}`)

            if (cachedData && String(cachedId) === String(this.project.icon_id)) {
                if (typeof cachedData === 'string' && cachedData.startsWith('data:')) {
                    this.iconFile = cachedData
                    console.log('Иконка взята из кэша (data URL)')
                    return
                } else {
                    localStorage.removeItem(`project_icon_${this.project.id}`)
                    localStorage.removeItem(`project_icon_id_${this.project.id}`)
                    await this.getIcon()
                    return
                }
            }
            await this.getIcon()
            console.log('Иконка обновлена с сервера')
        } catch (err) {
            console.error('projectCard mounted error', err)
            await this.getIcon()
        }
    }
}
</script>