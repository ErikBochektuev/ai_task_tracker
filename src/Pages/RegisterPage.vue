<template>
  <div class="auth-container">
    <form class="auth-form" @submit.prevent="handleSubmit">
      <div class="logo-container">
        <h1>Мое Приложение</h1>
      </div>
      
      <h2 class="form-title">Регистрация</h2>
      
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
          :class="{ 'input-error': errors.email }"
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
            autocomplete="new-password"
            required
            class="form-input"
            :class="{ 'input-error': errors.password }"
            placeholder="Придумайте пароль"
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
      
      <div class="input-group">
        <label for="confirmPassword" class="input-label">Подтверждение пароля</label>
        <div class="password-input-container">
          <input
            id="confirmPassword"
            v-model.trim="form.confirmPassword"
            :type="showConfirmPassword ? 'text' : 'password'"
            autocomplete="new-password"
            required
            class="form-input"
            :class="{ 'input-error': errors.confirmPassword }"
            placeholder="Повторите пароль"
            @blur="validateField('confirmPassword')"
            @input="clearError('confirmPassword')"
          >
          <button
            type="button"
            class="password-toggle"
            @click="toggleConfirmPasswordVisibility"
            :aria-label="showConfirmPassword ? 'Скрыть пароль' : 'Показать пароль'"
          >
            {{ showConfirmPassword ? 'Скрыть' : 'Показать' }}
          </button>
        </div>
        <span v-if="errors.confirmPassword" class="error-message">{{ errors.confirmPassword }}</span>
      </div>
      
      <div class="terms-agreement">
        <label class="checkbox-container">
          <input
            v-model="form.agreeTerms"
            type="checkbox"
            class="checkbox-input"
            :class="{ 'input-error': errors.agreeTerms }"
          >
          <span class="checkbox-label">
            Я принимаю 
            <a href="/terms" target="_blank" class="terms-link">условия использования</a>
            и 
            <a href="/privacy" target="_blank" class="terms-link">политику конфиденциальности</a>
          </span>
        </label>
        <span v-if="errors.agreeTerms" class="error-message">{{ errors.agreeTerms }}</span>
      </div>
      
      <button
        type="submit"
        class="submit-button"
        :disabled="loading"
        :class="{ 'button-loading': loading }"
      >
        <span v-if="!loading">Зарегистрироваться</span>
        <span v-else>Регистрация...</span>
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
          Зарегистрироваться через Google
        </button>
        <button 
          type="button" 
          class="social-button github-auth" 
          @click="handleSocialAuth('github')"
          :disabled="loading"
        >
          Зарегистрироваться через GitHub
        </button>
      </div> -->
      
      <p class="login-link">
        Уже есть аккаунт? 
        <router-link to="/login" class="login-link-text">
          Войти
        </router-link>
      </p>
    </form>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'RegisterPage',
  
  data() {
    return {
      form: {
        email: '',
        password: '',
        confirmPassword: '',
        agreeTerms: false
      },
      errors: {
        email: '',
        password: '',
        confirmPassword: '',
        agreeTerms: ''
      },
      showPassword: false,
      showConfirmPassword: false,
      loading: false,
      showNotification: false,
      notificationMessage: '',
      notificationType: 'error'
    }
  },
  
  mounted() {
    this.checkExistingAuth()
  },
  
  methods: {
    // Проверка, если пользователь уже авторизован
    checkExistingAuth() {
      if (this.$store && this.$store.state.auth && this.$store.state.auth.isAuthenticated) {
        this.$router.push('/dashboard')
      }
    },
    
    // Валидация поля
    validateField(field) {
      switch (field) {
        case 'email':
          this.errors.email = this.form.email ? 
            (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.email) ? 'Некорректный формат email' : '') : 
            'Email обязателен'
          break
        
        case 'password':
          this.errors.password = this.form.password ? 
            (this.form.password.length < 6 ? 'Пароль должен содержать минимум 8 символов' : 
            !/(?=.*[a-z])(?=.*\d)/.test(this.form.password) ? 'Пароль должен содержать буквы в верхнем и нижнем регистре и цифры' : '') : 
            'Пароль обязателен'
          break
        
        case 'confirmPassword':
          this.errors.confirmPassword = this.form.confirmPassword ? 
            (this.form.password !== this.form.confirmPassword ? 'Пароли не совпадают' : '') : 
            'Подтверждение пароля обязательно'
          break
        
        case 'agreeTerms':
          this.errors.agreeTerms = this.form.agreeTerms ? '' : 'Необходимо принять условия использования'
          break
      }
    },
    
    // Очистка ошибки поля
    clearError(field) {
      this.errors[field] = ''
    },
    
    // Валидация всей формы
    validateForm() {
      this.validateField('email')
      this.validateField('password')
      this.validateField('confirmPassword')
      this.validateField('agreeTerms')
      
      return !this.errors.email && 
             !this.errors.password && 
             !this.errors.confirmPassword && 
             !this.errors.agreeTerms
    },
    
    // Переключение видимости пароля
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword
    },
    
    // Переключение видимости подтверждения пароля
    toggleConfirmPasswordVisibility() {
      this.showConfirmPassword = !this.showConfirmPassword
    },
    
    // Показать уведомление
    showNotificationMessage(message, type = 'error') {
      this.notificationMessage = message
      this.notificationType = type
      this.showNotification = true
      
      // Автоматическое скрытие для success сообщений
      if (type === 'success') {
        setTimeout(() => {
          this.hideNotification()
        }, 3000)
      }
    },
    
    // Скрыть уведомление
    hideNotification() {
      this.showNotification = false
      this.notificationMessage = ''
    },
    
    // Обработка отправки формы
    async handleSubmit() {
      if (!this.validateForm()) {
        this.showNotificationMessage('Пожалуйста, исправьте ошибки в форме', 'error')
        return
      }
      
      this.loading = true
      
      try {
        console.log(this.confirmPassword)
        const authStore = useAuthStore() 
        const result = await authStore.register({
            email: this.form.email,
            password: this.form.password,
            verify_password: this.form.confirmPassword
        })
        
        if (result.success) {
          this.showNotificationMessage('Регистрация прошла успешно! Добро пожаловать!', 'success')
          console.log('Registration successful:', result)

          setTimeout(() => {
            this.$router.push('/login')
          }, 2000)
        } else {
          
          this.showNotificationMessage(result.error, 'error')
        }
        
      } catch (error) {
        this.showNotificationMessage('Произошла ошибка при регистрации', 'error')
        console.error('Registration error:', error)
      } finally {
        this.loading = false
      }
    },
    
    
  },
  
  watch: {
    // Наблюдаем за изменениями в хранилище аутентификации
    '$store.state.auth.isAuthenticated': {
      handler(newValue) {
        if (newValue) {
          this.$router.push('/dashboard')
        }
      },
      immediate: true
    },
    
    // Сброс ошибки подтверждения пароля при изменении основного пароля
    'form.password'(newPassword) {
      if (this.form.confirmPassword && newPassword !== this.form.confirmPassword) {
        this.errors.confirmPassword = 'Пароли не совпадают'
      } else if (this.errors.confirmPassword === 'Пароли не совпадают') {
        this.errors.confirmPassword = ''
      }
    },
    
    // Сброс ошибки подтверждения пароля при изменении подтверждения
    'form.confirmPassword'(newConfirmPassword) {
      if (newConfirmPassword && this.form.password !== newConfirmPassword) {
        this.errors.confirmPassword = 'Пароли не совпадают'
      } else if (this.errors.confirmPassword === 'Пароли не совпадают') {
        this.errors.confirmPassword = ''
      }
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

.terms-agreement {
  margin-bottom: 1.5rem;
}

.checkbox-container {
  display: flex;
  align-items: flex-start;
  cursor: pointer;
}

.checkbox-input {
  margin-right: 0.5rem;
  margin-top: 0.2rem;
  width: 1rem;
  height: 1rem;
}

.checkbox-input.input-error {
  outline: 2px solid #e74c3c;
}

.checkbox-label {
  color: #555;
  font-size: 0.9rem;
  line-height: 1.4;
}

.terms-link {
  color: #667eea;
  text-decoration: none;
}

.terms-link:hover {
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

.login-link {
  text-align: center;
  color: #666;
  font-size: 0.9rem;
}

.login-link-text {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
}

.login-link-text:hover {
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
  
  .checkbox-label {
    font-size: 0.8rem;
  }
  
  .social-button {
    font-size: 0.8rem;
  }
}
</style>