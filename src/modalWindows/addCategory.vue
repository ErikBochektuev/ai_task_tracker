<template>
  <div class="modal-wrapper">
    <transition name="fade-modal">
      <div class="modal__container modal-content">
        <div class="modal__container--title">
          <h1>Создание категории</h1>
        </div>
        
        <div v-if="showNotification" class="notification" :class="notificationType">
          {{ notificationMessage }}
          <button @click="hideNotification" class="close-btn">×</button>
        </div>
        
        <div class="input__group">
          <label for="name" class="input__group--label">Название категории</label>
          <input
            id="name"
            v-model.trim="form.name"
            type="text"
            autocomplete="off"
            required
            class="input__group--input"
            :class="{ 'input-error': errors.name }"
            placeholder="Введите название категории"
            @blur="validateField('name')"
            @input="clearError('name')"
            maxlength="30"
          >
          <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
        </div>
        
        <div class="input__group">
          <label for="color" class="input__group--label">Цвет категории</label>
          <input
            id="color"
            v-model.trim="form.color"
            class="input__group--input"
            :class="{ 'input-error': errors.color }"
            placeholder="Введите цвет категории (необязательно)"
            rows="4"
            @blur="validateField('color')"
            @input="clearError('color')"
            maxlength="10"
          >
          <span v-if="errors.color" class="error-message">{{ errors.color }}</span>
        </div>
        
        <div class="button__group">
          <buttonComponent 
          @click="handleSubmit"
          class="positive"
          :text="loading ? 'Создание...': 'Создать категорию'"
          />
          <buttonComponent 
          class="close"
          @click="$emit('close')"
          :text="'Назад'"
          />
        </div>
        
      </div>
    </transition>
    
  </div>
</template>

<script>
import buttonComponent from '../components/button.vue';
import { useCategoryStore } from '@/stores/category';
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'CreateProject',
  components: { buttonComponent },
  data() {
    return {
      form: {
        name: '',
        color: ''
      },
      errors: {
        name: '',
        color: ''
      },
      loading: false,
      showNotification: false,
      notificationMessage: '',
      notificationType: 'error'
    }
  },
  
  methods: {
    validateField(field) {
      switch (field) {
        case 'name':
          this.errors.name = this.form.name ? 
            (this.form.name.length < 3 ? 'Название должно содержать минимум 3 символа' : 
             this.form.name.length > 30 ? 'Название не должно превышать 30 символов' : '') : 
            'Название проекта обязательно'
          break
        
        case 'color':
          this.errors.color = this.form.color ? 
            (this.form.color.length > 10 ? 'Название цвета не должно превышать 10 символов' : '') : 
            'Описание проекта обязательно'
          break
      }
    },
    
    clearError(field) {
      this.errors[field] = ''
    },
    
    validateForm() {
      this.validateField('name')
      this.validateField('color')
      
      return !this.errors.name && !this.errors.color
    },
    
    showNotificationMessage(message, type = 'error') {
      this.notificationMessage = message
      this.notificationType = type
      this.showNotification = true
      
      if (type === 'success') {
        setTimeout(() => {
          this.hideNotification()
        }, 3000)
      }
    },
    
    hideNotification() {
      this.showNotification = false
      this.notificationMessage = ''
    },
    
    async handleSubmit() {
      if (!this.validateForm()) {
        this.showNotificationMessage('Пожалуйста, исправьте ошибки в форме', 'error')
        return
      }
      
      this.loading = true
      
      try {
        const authStore = useAuthStore()
        const result = await useCategoryStore().createCategory({
            name: this.form.name,
            color: this.form.color
        },{ headers: {
            Authorization: `${authStore.token}`
        }})
        
        if (result.success) {
          this.showNotificationMessage('Категория успешно создана!', 'success')
          setTimeout(() => {
           this.$emit('create')
          }, 1000)
        } else {
          this.showNotificationMessage(result, 'error')
        }
      } catch (error) {
        this.showNotificationMessage('Произошла ошибка при создании проекта', 'error')
        console.error('Create project error:', error)
      } finally {
        this.loading = false
      }
    },
    
    
  },
  
  watch: {
    '$store.state.auth.isAuthenticated': {
      handler(newValue) {
        if (!newValue) {
          this.$router.push('/login')
        }
      },
      immediate: true
    }
  }
}
</script>

