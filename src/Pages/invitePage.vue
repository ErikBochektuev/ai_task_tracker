<template>
  <div class="auth-container">
    <div class="auth-form invite-form">
      <div class="logo-container">
        <h1>Приглашение в проект</h1>
      </div>

      <div v-if="error" class="error-state">
        <div class="error-icon">⚠️</div>
        <h3>Ошибка</h3>
        <p>{{ error }}</p>
        <router-link to="/projects" class="back-button">
          Перейти к проектам
        </router-link>
      </div>

      <div v-else-if="inviteAccepted" class="success-state">
        <div class="success-icon">🎉</div>
        <h3>Поздравляем!</h3>
        <p>Вы успешно присоединились к проекту</p>
        <router-link :to="`/projects`" class="success-button">
          Перейти к проекту
        </router-link>
      </div>

      <div v-else class="invite-content">
        <div class="invite-icon">📨</div>
        <h2 class="invite-title">Вас пригласили в проект!</h2>

        <div class="action-buttons">
          <button
            @click="acceptInvite"
            class="accept-button"
            :disabled="processing"
            :class="{ 'button-loading': processing }"
          >
            <span v-if="!processing">Принять приглашение</span>
            <span v-else>Присоединение...</span>
          </button>
        </div>

        <p class="invite-note">
          Приняв приглашение, вы получите доступ к проекту.
        </p>
      </div>
    </div>

  </div>
</template>

<script>
import { useProjectsStore } from '@/stores/projects'

export default {
  name: 'ProjectInvite',
  
  data() {
    return {
      error: null,
      processing: false,
      inviteAccepted: false,
      token: null
    }
  },
  
  async mounted() {
    this.token = this.$route.query.access_token
  },
  
  methods: {
    async loadInviteData() {

    },
    
    getRoleDisplayName(role) {
      const roles = {
        'member': 'Участник',
        'admin': 'Администратор',
        'viewer': 'Наблюдатель'
      }
      return roles[role] || role
    },
    
    async acceptInvite() {
      this.processing = true
      try {
        const response = await useProjectsStore().acceptInvite(this.token)
        if (!response.success) {
            this.error = response.error
        } else {
            this.inviteAccepted = true
        }
      } catch (error) {
        console.log(error)
      } finally {
        this.processing = false
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
  max-width: 500px;
  text-align: center;
}

.logo-container {
  margin-bottom: 2rem;
}

.logo-container h1 {
  color: #333;
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
}

/* Состояния загрузки и ошибки */
.loading-state,
.error-state,
.success-state {
  padding: 2rem 0;
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

.error-icon,
.success-icon,
.invite-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.error-state h3,
.success-state h3 {
  color: #333;
  margin-bottom: 0.5rem;
  font-size: 1.5rem;
}

.error-state p,
.success-state p {
  color: #666;
  margin-bottom: 2rem;
  line-height: 1.5;
}

/* Контент приглашения */
.invite-title {
  color: #333;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 2rem;
}

.invite-details {
  background: #f8fafc;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  text-align: left;
}

.detail-item {
  display: flex;
  margin-bottom: 1rem;
  align-items: flex-start;
}

.detail-item.full-width {
  flex-direction: column;
}

.detail-item:last-child {
  margin-bottom: 0;
}

.detail-label {
  font-weight: 600;
  color: #555;
  min-width: 120px;
  flex-shrink: 0;
}

.detail-value {
  color: #333;
  flex: 1;
}

.role-badge {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.description-text {
  margin-top: 0.5rem;
  line-height: 1.5;
  color: #666;
  font-style: italic;
}

/* Кнопки действий */
.action-buttons {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  justify-content: center;
}

.decline-button {
  background: #6b7280;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.3s ease;
  flex: 1;
}

.decline-button:hover:not(:disabled) {
  background: #4b5563;
}

.accept-button {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 2;
}

.accept-button:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.decline-button:disabled,
.accept-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.invite-note {
  color: #666;
  font-size: 0.9rem;
  line-height: 1.4;
  margin: 0;
}

/* Кнопки для состояний */
.back-button,
.success-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-decoration: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
  display: inline-block;
}

.back-button:hover,
.success-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

/* Информация о проекте в success состоянии */
.project-info {
  background: #f0f9ff;
  padding: 1rem;
  border-radius: 8px;
  margin: 1.5rem 0;
  border-left: 4px solid #667eea;
}

.project-info h4 {
  color: #333;
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
}

.project-info .project-description {
  color: #666;
  margin: 0;
  font-style: italic;
}

/* Модальное окно */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  max-width: 400px;
  width: 90%;
  text-align: center;
}

.modal-content h3 {
  color: #333;
  margin-bottom: 1rem;
}

.modal-content p {
  color: #666;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.warning-text {
  color: #dc2626 !important;
  font-weight: 500;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 1.5rem;
}

.cancel-button {
  background: #6b7280;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.3s ease;
  flex: 1;
}

.cancel-button:hover {
  background: #4b5563;
}

.danger-button {
  background: #dc2626;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.3s ease;
  flex: 1;
}

.danger-button:hover {
  background: #b91c1c;
}

</style>