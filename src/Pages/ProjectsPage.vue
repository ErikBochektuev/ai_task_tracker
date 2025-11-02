<template>
  <div class="calendar-layout">
    <Loader v-if="loading" text="Загрузка проектов..." />
    <template v-else>
      <aside class="sidebar">
        <div class="sidebar-section">
          <h1 class="project-title">{{ project.name }}</h1>
          <h2 class="project-description"> {{ project.description }} </h2>
          <div class="project-tasks" v-if="tasks.length > 0">
            <taskCard :task="task" :time="parseDate(task.end)" v-for="task in tasks" :key="task.id"></taskCard>
          </div>
          <div class="project-tasks active" v-else>
            В проекте нет ни одной задачи
          </div>
        </div>
      </aside>
      <main class="main-content">
        <div class="main-header">
          <h1>Добро пожаловать</h1>
          <button class="create-button" @click="modalWindow('create')">+ Создать проект</button>
        </div>
        <div class="calendar-section">
          <div class="calendar-grid">
            <div class="calendar-grid-header">
              <div class="calendar-grid-hour-label"></div>
              <div v-for="day in days" :key="day.date" class="calendar-grid-day-label">
                {{ day.label }}
              </div>
            </div>
            <div class="calendar-grid-body">
              <div v-for="hour in 24" :key="hour" class="calendar-grid-row">
                <div class="calendar-grid-hour-label">{{ hour < 10 ? '0' + hour : hour }}:00</div>
                <div v-for="day in days" :key="day.date" class="calendar-grid-cell">
                  <div
                    v-for="task in getTasksForHour(day.tasks, hour)"
                    :key="task.id"
                    class="calendar-task"
                    :style="getTaskStyle(task)"
                    :title="task.title"
                  >
                    <span class="calendar-task-title">{{ task.title }}</span>
                    <span class="calendar-task-time">{{ task.start }} - {{ getEndTime(task) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="create">
          <create-task @close="modalWindow('clear')"/>
        </div>
        <div v-if="settings">
          <projectSettings :data="currentProject" @close="modalWindow('clear')"></projectSettings>
        </div>
      </main>
    </template>
  </div>
</template>

<script>
import createTask from '../modalWindows/createProject.vue'
import projectSettings from '../modalWindows/projectSettings.vue'
import Loader from '@/components/Loader.vue'
import taskCard from '@/components/taskCard.vue'
import { useAuthStore } from '@/stores/auth'
import { useTaskStore } from '@/stores/tasks'
import { loadFromCache } from '@/cache/cache'

export default {
  name: 'projectsPage',
  components: { createTask, projectSettings, Loader, taskCard },
  data() {
    return {
      apiProjects: [],
      tasks: [],
      projects: [
        {
          id: 1,
          name: 'CRM система',
          categories: [
            { id: 1, name: 'Бэклог' },
            { id: 2, name: 'В работе' },
            { id: 3, name: 'Готово' }
          ]
        },
        {
          id: 2,
          name: 'Личный сайт',
          categories: [
            { id: 4, name: 'Дизайн' },
            { id: 5, name: 'Разработка' }
          ]
        }
      ],
      days: [
        {
          date: '2025-09-21',
          label: '21',
          tasks: [
            { id: 1, title: 'Встреча с клиентом', start: '09:00', duration: 60, color: '#4285F4' },
            { id: 2, title: 'Проверить баги', start: '15:30', duration: 30, color: '#EA4335' }
          ]
        },
        {
          date: '2025-09-22',
          label: '22',
          tasks: []
        },
        {
          date: '2025-09-23',
          label: '23',
          tasks: [
            { id: 3, title: 'Сделать прототип', start: '11:00', duration: 120, color: '#FBBC05' }
          ]
        },
        {
          date: '2025-09-24',
          label: '24',
          tasks: []
        },
        {
          date: '2025-09-25',
          label: '25',
          tasks: [
            { id: 4, title: 'Проверить баги', start: '14:00', duration: 45, color: '#34A853' }
          ]
        },
        {
          date: '2025-09-26',
          label: '26',
          tasks: []
        },
        {
          date: '2025-09-27',
          label: '27',
          tasks: []
        }
      ],
      openProject: null,
      create: false,
      settings: false,
      currentProject: {},
      loading: true,
    }
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  methods: {
    toggleProject(id) {
      this.openProject = this.openProject === id ? null : id
    },
    async modalWindow(value, id) {
      switch (value) {
        case 'create':
          this.create = !this.create
          document.body.style.overflow = 'hidden'
          break
        case 'settings':
          console.log(id)
          this.settings = !this.settings
          this.currentProject = this.apiProjects.find(project => project.id === id)
          document.body.style.overflow = 'hidden'
          break
        case 'clear':
          this.create = false
          this.settings = false
          this.currentProject = {}
          document.body.style.overflow = ''
      }
      await this.getProjects()
    },
    getTasksForHour(tasks, hour) {
      return tasks.filter(task => {
        const [h] = task.start.split(':').map(Number)
        return h === hour
      })
    },
    getTaskStyle(task) {
      const minuteHeight = 80 / 60
      return {
        background: task.color,
        height: (task.duration * minuteHeight) + 'px',
        borderRadius: '6px',
        color: '#fff',
        margin: '2px 0',
        padding: '2px 6px',
        fontSize: '0.95rem',
        boxShadow: '0 2px 8px rgba(60,60,60,0.10)'
      }
    },
    getEndTime(task) {
      const [h, m] = task.start.split(':').map(Number)
      let endM = m + task.duration
      let endH = h
      while (endM >= 60) {
        endM -= 60
        endH += 1
      }
      return `${endH.toString().padStart(2, '0')}:${endM.toString().padStart(2, '0')}`
    },
    parseDate(dateString) {
      const deadline = new Date(dateString);
      
      
      
      return {
        date: deadline.toLocaleDateString('ru-RU', { 
          day: 'numeric', 
          month: 'long', 
          year: 'numeric' 
        }),
        time: deadline.toLocaleTimeString('ru-RU', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        weekday: deadline.toLocaleDateString('ru-RU', { 
          weekday: 'long' 
        })
      };
    },
    
    async getTasks(){
      try {
        const response = await useTaskStore().getTasks(this.id, {
          headers: {
            Authorization: useAuthStore().token
          }
        })
        if (response.success){
          
          this.loading = false
          this.tasks = response.data.items
          console.log('tasks', this.tasks, typeof(this.tasks))
          console.log('Время задачи', this.tasks[0].end)
          console.log('Время задачи', this.parseDate(this.tasks[0].end))
        } else {
          console.log(response.error)
          this.$router.push('/categories')
        }
      } catch (error) {
        this.$router.push('/categories')
      }
    },
  },
  async mounted() {
    this.project = loadFromCache(`project_${this.id}_info`)
    console.log(this.project)
    await this.getTasks()
    
  }
}
</script>

<style scoped>
.calendar-layout {
  display: flex;
  min-height: 100vh;
  background: #f6f8fc;
  font-family: 'Segoe UI', Arial, sans-serif;
}

/* Левая панель */
.sidebar {
  width: 320px;
  background: #fff;
  border-right: 1px solid #e1e5e9;
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.project-accordion {
  margin-bottom: 1rem;
  border-bottom: 1px solid #eee;
}



.project-title {
  font-size: 48px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  font-weight: 600;
  padding: 0.5rem 0;
  color: #3f51b5;
}

.project-description {
  
  border-bottom: 1px solid;
  padding-bottom: 1rem;
  font-size: 24px;
}

.project-tasks {
  font-size: 16px;
  margin-bottom: 0.5rem;
  box-sizing: border-box;
}

.category-item {
  padding: 0.3rem 0;
  color: #666;
  font-size: 0.98rem;
}

/* Правая панель */
.main-content {
  flex: 1;
  padding: 2rem 3rem;
  background: #f6f8fc;
}

.main-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.create-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  cursor: pointer;
}

.create-button:hover {
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.2);
  transform: translateY(-2px);
}

/* Ежедневник */
.calendar-section {
  margin-top: 2rem;
}

.calendar-grid {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(60,60,60,0.08);
  overflow-x: auto;
}

.calendar-grid-header {
  display: flex;
  border-bottom: 1px solid #e1e5e9;
  background: #f6f8fc;
}

.calendar-grid-hour-label {
  width: 70px;
  min-width: 70px;
  text-align: right;
  padding-right: 8px;
  font-size: 0.95rem;
  color: #888;
  font-weight: 500;
  background: #f6f8fc;
}

.calendar-grid-day-label {
  flex: 1;
  text-align: center;
  padding: 8px 0;
  font-weight: 600;
  color: #444;
  border-right: 1px solid #e1e5e9;
}

.calendar-grid-body {
  display: flex;
  flex-direction: column;
}

.calendar-grid-row {
  display: flex;
  min-height: 80px;
  border-bottom: 1px solid #f0f0f0;
}

.calendar-grid-cell {
  flex: 1;
  position: relative;
  border-right: 1px solid #f0f0f0;
  min-width: 120px;
  padding: 2px 4px;
}

/* Задачи в сетке */
.calendar-task {
  position: absolute;
  left: 4px;
  right: 4px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  transition: box-shadow 0.3s, transform 0.3s;
  cursor: pointer;
}

.calendar-task:hover {
  box-shadow: 0 6px 20px rgba(60,60,60,0.18);
  transform: scale(1.04);
  z-index: 2;
}

.calendar-task-title {
  font-weight: 600;
  font-size: 0.97rem;
  margin-bottom: 2px;
}

.calendar-task-time {
  font-size: 0.85rem;
  opacity: 0.8;
}

/* Модальное окно */
.modal-open {
  overflow: hidden !important;
}

</style>