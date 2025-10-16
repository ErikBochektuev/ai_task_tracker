<template>
  <div class="categories-layout">
    <Loader v-if="loading" />
    <div v-else class="categories-container">
      <div class="categories-header">
        <h1>Категории проектов</h1>
        <buttonComponent @click="addCategoryModal" :text="'+ Создать категорию'" class="positive"/>
      </div>
      <div class="categories-list">
        <div
          v-for="category in categories"
          :key="category.id"
          class="category-block"
        >
          <div class="category-color" :style="{ background: category.color }"></div>
          <div class="category-header" @click="toggleCategory(category.id)">
            <span class="category-title">{{ category.name }}</span>
            <button class="category-settings-btn" @click.stop="openCategoryModal(category)" title="Настройки категории">
              <img src="../assets/settings.svg" width="22" height="22" alt="">
            </button>
            <span class="category-arrow">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path :d="openCategoryId === category.id ? 'M6 15l6-6 6 6' : 'M6 9l6 6 6-6'" stroke="#764ba2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </span>
          </div>
          <transition name="fade">
            <div :class="{'active': openCategoryId === category.id}" class="category-projects">
              <projectCard 
              v-for="project in category.projects"
              :key="project.id"
              :project="project"
              :typeCard="'settings'"
              @openProject="openProjectModal(project)"
              @toProject="toProject(project)"
              />

              <div class="project__card" @click="openAddProjectModal(category)" v-if="projects.length">
                <span>Добавить проект</span>
                <div class="project__card--settings">+</div>
              </div>
            </div>
          </transition>
        </div>
        
      </div>
      <div class="projects-list">
        <h1 class="projects-title">Проекты без категории</h1>
        <projectCard 
        v-for="project in projects"
        :key="project.id"
        :project="project"
        :typeCard="'settings'"
        @openProject="openProjectModal(project)"
        @toProject="toProject(project)"
        />

        <div class="project__card" @click="createProjectModal">
          <span>Создать проект</span>
          <div class="project__card--settings">+</div>
        </div>
      </div>
    </div>

    <addProjectsToCategory
      v-if="addToCategory"
      @close="addToCategory = false"
      :data="projects"
      :category="selectedCategory"
      @add="handleAddProject"
      @update="getCategories"
    />

    <projectSettings
      v-if="showProjectModal"
      :data="currentProject"
      @close="closeProjectModal"
      @update="getCategories"
    />

    <categorySettings
      v-if="showCategoryModal"
      :data="currentCategory"
      @close="closeCategoryModal"
      @save="saveCategory"
      @update="getCategories"
    />

    <addCategory 
      v-if="addCategory"
      @close="addCategoryModal"
      @create="getCategories"
    />

    <createProject 
      v-if="createProject"
      @close="createProjectModal"
      @update="getCategories"
    />
  </div>
</template>

<script>
import projectSettings from '../modalWindows/projectSettings.vue'
import categorySettings from '../modalWindows/categorySettings.vue'
import Loader from '@/components/Loader.vue'
import addProjectsToCategory from '@/modalWindows/addProjectsToCategory.vue'
import addCategory from '@/modalWindows/addCategory.vue'
import createProject from '../modalWindows/createProject.vue'
import projectCard from '@/components/projectCard.vue'
import buttonComponent from '@/components/button.vue'
import { saveToCache } from '@/cache/cache'
import { useCategoryStore } from '@/stores/category'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'CategoriesPage',
  components: { projectSettings, categorySettings, addProjectsToCategory, createProject, addCategory, projectCard, buttonComponent, Loader },
  data() {
    return {
      categories: [],
      projects: [],
      openCategoryId: null,
      showProjectModal: false,
      showCategoryModal: false,
      addCategory: false,
      addToCategory: false,
      createProject: false,
      currentProject: null,
      currentCategory: null,
      selectedCategory: null,
      loading: true
    }
  },
  methods: {
    createProjectModal(){
      this.createProject = !this.createProject
    },
    addCategoryModal(){
      this.addCategory = !this.addCategory
    },
    saveCategory(data) {
      this.currentCategory.name = data.name
      this.currentCategory.color = data.color
      this.showCategoryModal = false
      this.currentCategory = null
    },
    toggleCategory(id) {
      this.openCategoryId = this.openCategoryId === id ? null : id
    },
    openProjectModal(project) {
      this.currentProject = project
      this.showProjectModal = true
    },
    closeProjectModal() {
      this.showProjectModal = false
      this.currentProject = null
    },
    openCategoryModal(category) {
      this.currentCategory = category
      this.showCategoryModal = true
    },
    closeCategoryModal() {
      this.showCategoryModal = false
      this.currentCategory = null
    },
    openAddProjectModal(category) {
      if (!category) return
      this.selectedCategory = category
      this.addToCategory = true
    },

    toProject(project){
      saveToCache(`project_${project.id}_info`, project)
      this.$router.push({
        name: 'projectsPage',
        params: {id: project.id}
      })
    },

    async handleAddProject(projectId) {
      if (!this.selectedCategory || !this.selectedCategory.id) return 
      try {
        const response = await useCategoryStore().addProject(this.selectedCategory.id, projectId, {
          headers: {
            Authorization: `${useAuthStore().token}`
          }
        })
        if (response.success) {
          await this.getCategories()
        }
      } catch (error) {
        console.log(error)
      } finally {
        this.addToCategory = false
        this.selectedCategory = null
      }
    },
    async getCategories() {
      try {
        const response = await useCategoryStore().getCategories({
          headers: {
            Authorization: `${useAuthStore().token}`
          }
        })
        if (response.success) {
          this.categories = response.data.categories
          this.projects = response.data.projects
          
        }
      } catch (error) {
        console.log(error)
      } finally {
        this.loading = false
        this.showProjectModal = false
        this.addCategory = false
        this.createProject = false
        this.showCategoryModal = false
      }
    }
  },
  async mounted() {
    await this.getCategories()
  }
}
</script>
