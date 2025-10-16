<template>
  <div class="modal-wrapper">
    <transition name="fade-modal">
      <div class="modal__container modal-content">
        <h1 class="modal__container--title">Добавить проект</h1>
        <div class="category-projects-add">
          <projectCard 
          v-for="project in data"
          :key="project.id"
          :project="project"
          :typeCard="'add'"
          @click="addProject(project.id)"
          />
        </div>
        <buttonComponent @click="$emit('close')" class="close" :text="'Закрыть'"/>
      </div>
    </transition>
  </div>
</template>

<script>
import projectCard from '../components/projectCard.vue';
import buttonComponent from '../components/button.vue';

export default {
  components: { projectCard, buttonComponent },
  props: {
    data: Array,
    category: Object
  },
  methods: {
    addProject(projectId) {
      this.$emit('add', projectId)
    }
  }
}
</script>