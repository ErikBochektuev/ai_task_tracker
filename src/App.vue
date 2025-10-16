<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <Header />

  <RouterView />
</template>

<script>
import { useAuthStore } from './stores/auth';
import Header from './components/header.vue';

export default {
  name: 'App',
  components: {
    Header
  },
  data() {
    return {
    }
  },
  methods: {
    logout() {
      useAuthStore().logout()
    }
  },
  computed: {
    is_Authenticated() {
      return useAuthStore().isAuthenticated
    }
  }
}
</script>

