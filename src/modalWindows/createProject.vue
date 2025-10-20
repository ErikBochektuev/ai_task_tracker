<template>
  <transition name="fade-modal" appear>
    <div class="modal-wrapper" @click.self="$emit('close')">
      <div class="modal__container">
        <h3 class="modal-title">Создать проект</h3>

        <div class="input__group">
          <label class="input__group--label">Название проекта</label>
          <input
            v-model="form.name"
            type="text"
            class="input__group--input"
            placeholder="Введите название проекта"
          />
        </div>

        <div class="input__group">
          <label class="input__group--label">Описание (необязательно)</label>
          <input
            v-model="form.description"
            class="input__group--input"
            rows="4"
            placeholder="Краткое описание проекта"
          >
        </div>

        <div class="modal-actions">
          <buttonComponent
            :text="'Отмена'"
            class="close"
            @click="$emit('close')" />
          <buttonComponent
            :text="'Создать'"
            class="positive"
            @click="handleSubmit" />
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { useProjectsStore } from '@/stores/projects'
import { useAuthStore } from '@/stores/auth'
import buttonComponent from '@/components/button.vue';

export default {
  name: 'CreateProject',
  components: { buttonComponent },
  data() {
    return {
      form: {
        name: '',
        description: ''
      },
      errors: {
        name: '',
        description: ''
      }
    }
  },
  
  methods: {
    validateField(field) {
      switch (field) {
        case 'name':
          this.errors.name = this.form.name ? 
            (this.form.name.length < 3 ? 'Название должно содержать минимум 3 символа' : 
             this.form.name.length > 100 ? 'Название не должно превышать 100 символов' : '') : 
            'Название проекта обязательно'
          break
        
        case 'description':
          this.errors.description = this.form.description ? 
            (this.form.description.length > 500 ? 'Описание не должно превышать 500 символов' : '') : 
            ''
          break
      }
    },
    
    clearError(field) {
      this.errors[field] = ''
    },
    
    validateForm() {
      this.validateField('name')
      this.validateField('description')
      
      return !this.errors.name && !this.errors.description
    },
    async handleSubmit() {
      if (!this.validateForm()) {
        this.$emit('error', 'Пожалуйста, исправьте ошибки в форме')
        return
      }
      
      try {
        const authStore = useAuthStore()
        const projectsStore = useProjectsStore()
        console.log(authStore.token)
        const result = await projectsStore.createProject({
            name: this.form.name,
            description: this.form.description
        },{ headers: {
            Authorization: `${authStore.token}`
        }})
        
        if (result.success) {
          
          setTimeout(() => {
           this.$emit('update', 'created')
          }, 1000)
        } else {
          this.$emit('error', result.error.data.detail[0].msg)
        }
      } catch (error) {
        this.$emit('error', 'Произошла ошибка при создании проекта')
        console.error('Create project error:', error)
      } finally {
        this.loading = false
      }
    },
    
    
  }
}
</script>

<style scoped>
.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background: rgba(0, 0, 0, 0.5);
  padding: 20px;
  z-index: 100;
}

.auth-form {
  background: white;
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
}

.logo-container {
  text-align: center;
  margin-bottom: 2rem;
}

.logo-container h1 {
  color: #333;
  font-size: 2rem;
  font-weight: 700;
}

.form-title {
  text-align: center;
  color: #333;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  font-weight: 600;
}

.notification {
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  animation: slideIn 0.3s ease;
}

.notification.success {
  background: #d1fae5;
  color: #065f46;
  border: 1px solid #a7f3d0;
}

.notification.error {
  background: #fee2e2;
  color: #b91c1c;
  border: 1px solid #fecaca;
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  padding: 0;
}

.input-group {
  margin-bottom: 1.5rem;
  position: relative;
}

.input-label {
  display: block;
  margin-bottom: 0.5rem;
  color: #555;
  font-weight: 500;
  font-size: 0.9rem;
}

.form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-sizing: border-box;
  font-family: inherit;
}

.form-textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-sizing: border-box;
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-input.input-error,
.form-textarea.input-error {
  border-color: #e74c3c;
}

.error-message {
  display: block;
  color: #e74c3c;
  font-size: 0.8rem;
  margin-top: 0.25rem;
}

.char-counter {
  display: block;
  text-align: right;
  color: #666;
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

.submit-button {
  width: 100%;
  padding: 0.75rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 1.5rem;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.submit-button:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.submit-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.back-link {
  text-align: center;
  color: #666;
  font-size: 0.9rem;
}

.back-link-text {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.back-link-text:hover {
  text-decoration: underline;
}

@keyframes slideIn {
  from {
    transform: translateY(-10px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

</style>