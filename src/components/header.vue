<template>
  <header class="header">
    <nav class="header__nav">
      <router-link to="/" class="header__nav--logo">
        <span>AI TODO</span>
      </router-link>
      <div class="header__nav--links">

        <router-link v-if="!isAuthenticated" to="/login" class="header__nav--links--btn">
          <buttonComponent 
          class="close"
          :text="'Войти'"/>
        </router-link>
        <router-link v-if="isAuthenticated" to="/profile" class="header__nav--links--btn">
          <buttonComponent 
          class="positive"
          :text="'Профиль'"/>
        </router-link>
        <buttonComponent
        v-if="isAuthenticated"
        @click="logout"
        class="close" 
        :text="'Выйти'"/>
      </div>
    </nav>
  </header>
</template>

<script>
import buttonComponent from './button.vue';
import { useAuthStore } from '@/stores/auth';

export default {
  name: 'header',
  components: { buttonComponent },
  computed: {
    isAuthenticated() {
      return useAuthStore().isAuthenticated
    }
  },
  methods: {
    logout() {
      useAuthStore().logout()
    }
  }
}
</script>

