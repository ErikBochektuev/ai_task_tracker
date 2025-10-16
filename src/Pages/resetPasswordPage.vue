<template>
  <div class="auth-container">
    <div class="auth-form">
      <transition name="slide" mode="out-in">
        <!-- Шаг 1: Ввод email -->
        <div v-if="!showCodeInput" class="form-step" key="step1">
          <div class="logo-container">
            <h1>Восстановление пароля</h1>
          </div>

          <h2 class="form-title">Введите ваш email</h2>

          <div v-if="showNotification" class="notification" :class="notificationType">
            {{ notificationMessage }}
            <button @click="hideNotification" class="close-btn">×</button>
          </div>

          <div class="input-group">
            <label for="email" class="input-label">Электронная почта</label>
            <input
              id="email"
              v-model.trim="email"
              type="email"
              autocomplete="email"
              required
              class="form-input"
              :class="{ 'input-error': errors.email }"
              placeholder="your.email@example.com"
              @blur="validateEmail"
              @input="clearError('email')"
              @keyup.enter="sendCode"
            >
            <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
          </div>

          <button
            @click="sendCode"
            class="submit-button"
            :disabled="loading"
            :class="{ 'button-loading': loading }"
          >
            <span v-if="!loading">Отправить код</span>
            <span v-else>Отправка...</span>
          </button>
        </div>

        <!-- Шаг 2: Ввод кода -->
        <div v-else-if="!showPasswordInput" class="form-step" key="step2">
          <div class="logo-container">
            <h1>Проверка кода</h1>
          </div>

          <h2 class="form-title">Введите код из письма</h2>

          <div v-if="showNotification" class="notification" :class="notificationType">
            {{ notificationMessage }}
            <button @click="hideNotification" class="close-btn">×</button>
          </div>

          <div class="success-message">
            <div class="success-icon">✓</div>
            <p>Код отправлен на <strong>{{ email }}</strong></p>
            <button @click="resendCode" class="resend-button" :disabled="resendCooldown > 0">
              {{ resendCooldown > 0 ? `Отправить повторно (${resendCooldown})` : 'Отправить повторно' }}
            </button>
          </div>

          <div class="input-group">
            <label for="code" class="input-label">Код подтверждения</label>
            <input
              id="code"
              v-model.trim="code"
              type="text"
              inputmode="numeric"
              pattern="[0-9]*"
              maxlength="6"
              required
              class="form-input code-input"
              :class="{ 'input-error': errors.code }"
              placeholder="000000"
              @input="onCodeInput"
              @blur="validateCode"
              @keyup.enter="verifyCode"
            >
            <span v-if="errors.code" class="error-message">{{ errors.code }}</span>
          </div>

          <div class="action-buttons">
            <button @click="goBack" class="back-button" :disabled="loading">← Назад</button>
            <button @click="verifyCode" class="submit-button" :disabled="loading" :class="{ 'button-loading': loading }">
              <span v-if="!loading">Проверить код</span>
              <span v-else>Проверка...</span>
            </button>
          </div>
        </div>

        <!-- Шаг 3: Ввод нового пароля -->
        <div v-else class="form-step" key="step3">
          <div class="logo-container">
            <h1>Новый пароль</h1>
          </div>

          <h2 class="form-title">Введите новый пароль</h2>

          <div v-if="showNotification" class="notification" :class="notificationType">
            {{ notificationMessage }}
            <button @click="hideNotification" class="close-btn">×</button>
          </div>

          <div class="input-group">
            <label for="newPassword" class="input-label">Новый пароль</label>
            <div class="password-input-container">
              <input
                id="newPassword"
                v-model.trim="newPassword"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="new-password"
                required
                class="form-input"
                :class="{ 'input-error': errors.newPassword }"
                placeholder="Введите новый пароль"
                @blur="validatePassword('password')"
                @input="clearError('newPassword')"
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
            <span v-if="errors.newPassword" class="error-message">{{ errors.newPassword }}</span>

            <label for="confirmPassword" class="input-label">Повторите пароль</label>
            <div class="password-input-container">
              <input
                id="confirmPassword"
                v-model.trim="confirmPassword"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="new-password"
                required
                class="form-input"
                :class="{ 'input-error': errors.confirmPassword }"
                placeholder="Повторите пароль"
                @blur="validatePassword('confirmPassword')"
                @input="clearError('confirmPassword')"
              />
              <button
                type="button"
                class="password-toggle"
                @click="togglePasswordVisibility"
                :aria-label="showPassword ? 'Скрыть пароль' : 'Показать пароль'"
              >
                {{ showPassword ? 'Скрыть' : 'Показать' }}
              </button>
            </div>
            <span v-if="errors.confirmPassword" class="error-message">{{ errors.confirmPassword }}</span>
          </div>

          <div class="action-buttons">
            <button @click="backButton()" class="back-button" :disabled="loading">← Назад</button>
            <button @click="changePassword" class="submit-button" :disabled="loading" :class="{ 'button-loading': loading }">
              <span v-if="!loading">Сменить пароль</span>
              <span v-else>Смена...</span>
            </button>
          </div>
        </div>
      </transition>

      <!-- Анимационный overlay -->
      <div class="animation-overlay" :class="{ 'overlay-active': animating }">
        <div class="animation-content">
          <div class="loading-spinner"></div>
          <p>Отправляем код...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useResetStore } from '@/stores/reset'

export default {
  name: 'ForgotPassword',
  data() {
    return {
      email: '',
      code: '',
      newPassword: '',
      confirmPassword: '',
      showCodeInput: false,
      showPasswordInput: false,
      showPassword: false,
      loading: false,
      animating: false,
      resendCooldown: 0,
      showNotification: false,
      notificationMessage: '',
      notificationType: 'error',
      errors: {
        email: '',
        code: '',
        newPassword: '',
        confirmPassword: ''
      },
      user_id: null,
      token: '',
      access: false
    }
  },
  watch: {
    showCodeInput() {
      this.hideNotification()
    },
    showPasswordInput() {
      this.hideNotification()
    }
  },
  methods: {
    validateEmail() {
      this.errors.email = this.email
        ? (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email) ? 'Некорректный формат email' : '')
        : 'Email обязателен'
    },
    validateCode() {
      this.errors.code = this.code
        ? (!/^\d{6}$/.test(this.code) ? 'Код должен состоять из 6 цифр' : '')
        : 'Код обязателен'
    },
    validatePassword(field) {
      if (field === 'password') {
        this.errors.newPassword = this.newPassword
          ? (this.newPassword.length < 6
              ? 'Пароль должен содержать минимум 6 символов'
              : !/(?=.*\d)/.test(this.newPassword)
                ? 'Пароль должен содержать цифры'
                : '')
          : 'Пароль обязателен'
      }
      if (field === 'confirmPassword') {
        this.errors.confirmPassword = this.confirmPassword
          ? (this.newPassword !== this.confirmPassword
              ? 'Пароли не совпадают'
              : '')
          : 'Подтверждение пароля обязательно'
      }
    },
    clearError(field) {
      this.errors[field] = ''
    },
    onCodeInput(event) {
      this.code = event.target.value.replace(/\D/g, '')
      if (this.code.length === 6) {
        this.validateCode()
      }
    },
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword
    },
    async sendCode() {
      this.validateEmail()
      if (this.errors.email) return
      this.loading = true
      this.animating = true
      try {
        const response = await useResetStore().sendCode(this.email)
        if (response.success === true) {
          this.user_id = response.data.user_id
          setTimeout(() => {
            this.animating = false
            this.showCodeInput = true
            this.startResendCooldown()
          }, 500)
        } else {
          this.animating = false
          this.loading = false
          this.showNotificationMessage(response.error, 'error')
        }
      } catch (error) {
        this.animating = false
        this.showNotificationMessage('Ошибка отправки кода', 'error')
      } finally {
        this.loading = false
      }
    },
    async resendCode() {
      if (this.resendCooldown > 0) return
      this.loading = true
      try {
        await this.sendCode()
        this.startResendCooldown()
        this.showNotificationMessage('Код отправлен повторно', 'success')
      } catch (error) {
        this.showNotificationMessage('Ошибка отправки кода', 'error')
      } finally {
        this.loading = false
      }
    },
    startResendCooldown() {
      this.resendCooldown = 60
      const timer = setInterval(() => {
        this.resendCooldown--
        if (this.resendCooldown <= 0) {
          clearInterval(timer)
        }
      }, 1000)
    },
    async verifyCode() {
      this.validateCode()
      if (this.errors.code) {
        this.showNotificationMessage('Пожалуйста, исправьте ошибки', 'error')
        return
      }
      this.loading = true
      try {
        const response = await useResetStore().resetPasswordAccess(this.user_id, this.code)
        if (response.success === true) {
          this.showNotificationMessage('Код подтвержден!', 'success')
          console.log(response)
          this.token = response.data.token
          setTimeout(() => {
            this.showPasswordInput = true
          }, 1000)
        } else {
          this.showNotificationMessage(response.error, 'error')
        }
      } catch (error) {
        this.showNotificationMessage('Неверный код или ошибка смены пароля', 'error')
      } finally {
        this.loading = false
      }
    },
    async changePassword() {
      this.validatePassword('password')
      this.validatePassword('confirmPassword')
      if (this.errors.newPassword || this.errors.confirmPassword) {
        this.showNotificationMessage('Пожалуйста, исправьте ошибки', 'error')
        return
      }
      this.loading = true
      try {
        const response = await useResetStore().resetPassword(this.token, {
          password: this.newPassword
        })
        if (response.success === true) {
          this.showNotificationMessage('Пароль успешно изменен!', 'success')
          setTimeout(() => {
            this.$router.push('/login')
          }, 1500)
        } else {
          this.showNotificationMessage(response.error, 'error')
        }
      } catch (error) {
        this.showNotificationMessage('Ошибка смены пароля', 'error')
      } finally {
        this.loading = false
      }
    },
    goBack() {
      this.showCodeInput = false
      this.code = ''
      this.newPassword = ''
      this.clearError('code')
      this.clearError('newPassword')
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
  position: relative;
  overflow: hidden;
  min-height: 450px;
}

.form-step {
  width: 100%;
}

/* Анимации перехода между шагами */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.5s ease;
}

.slide-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.slide-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.slide-enter-to,
.slide-leave-from {
  opacity: 1;
  transform: translateX(0);
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

.code-input {
  text-align: center;
  font-size: 1.5rem;
  font-weight: 600;
  letter-spacing: 0.5rem;
  padding-left: 1.5rem;
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
  height: 70px;
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


/* Стили для второго шага */
.success-message {
  background: #f0f9ff;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  text-align: center;
  border-left: 4px solid #667eea;
}

.success-icon {
  width: 40px;
  height: 40px;
  background: #10b981;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 0.5rem;
  font-weight: bold;
}

.success-message p {
  color: #666;
  margin-bottom: 0.5rem;
}

.resend-button {
  background: none;
  border: none;
  color: #667eea;
  cursor: pointer;
  font-size: 0.9rem;
  text-decoration: underline;
}

.resend-button:hover:not(:disabled) {
  color: #5a67d8;
}

.resend-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.action-buttons {
  display: flex;
  gap: 1rem;
}

.back-button {
  max-height: 70px;
  background: #6b7280;
  color: white;
  border: none;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.3s ease;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.back-button:hover:not(:disabled) {
  background: #4b5563;
}

.back-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Анимационный overlay */
.animation-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  visibility: hidden;
  transition: all 0.5s ease;
  z-index: 10;
}

.overlay-active {
  opacity: 1;
  visibility: visible;
}

.animation-content {
  text-align: center;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.animation-content p {
  color: #666;
  font-size: 1rem;
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
    min-height: 400px;
  }
  
  .logo-container h1 {
    font-size: 1.5rem;
  }
  
  .form-title {
    font-size: 1.25rem;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .code-input {
    font-size: 1.25rem;
    letter-spacing: 0.3rem;
  }
}
</style>