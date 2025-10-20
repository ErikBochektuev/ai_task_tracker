<template>
  <div class="auth-container">
    <form class="auth-form" @submit.prevent="handleSubmit">
      <div class="logo-container">
        <h1>Мое Приложение</h1>
      </div>
      
      <h2 class="form-title">Вход в систему</h2>
      
      <div v-if="showNotification" class="notification" :class="notificationType">
        {{ notificationMessage }}
        <button @click="hideNotification" class="close-btn">×</button>
      </div>
      
      <div class="input-group">
        <label for="email" class="input-label">Электронная почта</label>
        <input
          id="email"
          v-model.trim="form.email"
          type="email"
          autocomplete="email"
          required
          class="form-input"                                                                      
          placeholder="your.email@example.com"
          @blur="validateField('email')"
          @input="clearError('email')"
        >
        <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
      </div>
      
      <div class="input-group">
        <label for="password" class="input-label">Пароль</label>
        <div class="password-input-container">
          <input
            id="password"
            v-model.trim="form.password"
            :type="showPassword ? 'text' : 'password'"
            autocomplete="current-password"
            required
            class="form-input"
            :class="{ 'input-error': errors.password }"
            placeholder="Введите ваш пароль"
            @blur="validateField('password')"
            @input="clearError('password')"
          >
          <button
            type="button"
            class="password-toggle"
            @click="togglePasswordVisibility"
            :aria-label="showPassword ? 'Скрыть пароль' : 'Показать пароль'"
          >
            {{ showPassword ? 'Скрыть' : 'Показать' }}
          </button>
        </div>
        <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
      </div>
      
      <div class="remember-forgot">
        <label class="checkbox-container">
          <input
            v-model="form.rememberMe"
            type="checkbox"
            class="checkbox-input"
          >
          <span class="checkbox-label">Запомнить меня</span>
        </label>
        <router-link to="/reset-password" class="forgot-link">
          Забыли пароль?
        </router-link>
      </div>
      
      <button
        type="submit"
        class="submit-button"
        :disabled="loading"
        :class="{ 'button-loading': loading }"
      >
        <span v-if="!loading">Войти</span>
        <span v-else>Вход...</span>
      </button>
      
      <div class="divider">
        <span>или</span>
      </div>
      
      <!-- <div class="social-auth">
        <button 
          type="button" 
          class="social-button google-auth" 
          @click="handleSocialAuth('google')"
          :disabled="loading"
        >
          Войти через Google
        </button>
        <button 
          type="button" 
          class="social-button github-auth" 
          @click="handleSocialAuth('github')"
          :disabled="loading"
        >
          Войти через GitHub
        </button>
      </div> -->
      
      <p class="signup-link">
        Нет аккаунта? 
        <router-link to="/register" class="signup-link-text">
          Зарегистрироваться
        </router-link>
      </p>
    </form>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'LoginPage',
  
  data() {
    return {
      form: {
        email: '',
        password: '',
        rememberMe: false
      },
      errors: {
        email: '',
        password: ''
      },
      showPassword: false,
      loading: false,
      showNotification: false,
      notificationMessage: '',
      notificationType: 'error'
    }
  },
  
  mounted() {
    this.checkExistingAuth()
    this.checkQueryMessages()
  },
  
  methods: {
    checkExistingAuth() {
      if (this.$store && this.$store.state.auth && this.$store.state.auth.isAuthenticated) { ///проверка на авторизацию пользователя
        this.$router.push('/tasks')
      }
    },
    
    // проверка query параметров
    checkQueryMessages() {
      const message = this.$route.query.message
      const messageType = this.$route.query.messageType || 'success'
      
      if (message) {
        this.showNotificationMessage(message, messageType)
        
        this.$router.replace({ query: {} })
      }
    },
    
    validateField(field) {
      switch (field) {
        case 'email':
          this.errors.email = this.form.email ? 
            (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.email) ? 'Некорректный формат email' : '') : 
            'Email обязателен'
          break
        case 'password':
          this.errors.password = this.form.password ? 
            (this.form.password.length < 6 ? 'Пароль должен содержать минимум 6 символов' : '') : 
            'Пароль обязателен'
          break
      }
    },
    
    // Очистка ошибки плей
    clearError(field) {
      this.errors[field] = ''
    },
    
    // Валидация формы
    validateForm() {
      this.validateField('email')
      this.validateField('password')
      return !this.errors.email && !this.errors.password
    },
    
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword
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
    
    // Обработка отправки формы
    async handleSubmit() {
      if (!this.validateForm()) {
        return
      }

      this.loading = true

      try {
        const authStore = useAuthStore()
        const result = await authStore.login({
          login: this.form.email,
          password: this.form.password
        }, this.form.rememberMe)

        if (result.success) {
          this.showNotificationMessage('Успешный вход!', 'success')
          setTimeout(() => {
            this.$router.push('/categories')
          }, 1000)
        } else {
          this.showNotificationMessage(result.error, 'error')
        }
      } catch (error) {
        this.showNotificationMessage('Произошла ошибка при входе', 'error')
        console.error('Login error:', error)
      } finally {
        this.loading = false
      }
    },
    goToRegister() {
      this.$router.push('/register')
    }
  }
}
</script>

<style scoped>
.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.auth-form {
  background: white;
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
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
}

.input-label {
  display: block;
  margin-bottom: 0.5rem;
  color: #555;
  font-weight: 500;
  font-size: 0.9rem;
}

.password-input-container {
  position: relative;
}

.form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-input.input-error {
  border-color: #e74c3c;
}

.password-toggle {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  color: #666;
  font-size: 0.8rem;
  font-weight: 500;
}

.password-toggle:hover {
  color: #667eea;
}

.error-message {
  display: block;
  color: #e74c3c;
  font-size: 0.8rem;
  margin-top: 0.25rem;
}

.remember-forgot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.checkbox-container {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.checkbox-input {
  margin-right: 0.5rem;
  width: 1rem;
  height: 1rem;
}

.checkbox-label {
  color: #555;
  font-size: 0.9rem;
}

.forgot-link {
  color: #667eea;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.3s ease;
}

.forgot-link:hover {
  color: #5a67d8;
  text-decoration: underline;
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

.divider {
  position: relative;
  text-align: center;
  margin: 1.5rem 0;
  color: #666;
  font-size: 0.9rem;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: #e1e5e9;
  z-index: 1;
}

.divider span {
  background: white;
  padding: 0 1rem;
  position: relative;
  z-index: 2;
}

.social-auth {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.social-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  font-weight: 500;
}

.social-button:hover:not(:disabled) {
  transform: translateY(-1px);
}

.social-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.google-auth:hover:not(:disabled) {
  border-color: #db4437;
  color: #db4437;
}

.github-auth:hover:not(:disabled) {
  border-color: #333;
  color: #333;
}

.signup-link {
  text-align: center;
  color: #666;
  font-size: 0.9rem;
}

.signup-link-text {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
}

.signup-link-text:hover {
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

/* Адаптивность */
@media (max-width: 480px) {
  .auth-form {
    padding: 1.5rem;
  }
  
  .remember-forgot {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
  
  .social-button {
    font-size: 0.8rem;
  }
}
</style>