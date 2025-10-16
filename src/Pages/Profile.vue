<template>
  <div class="auth-container">
    <Loader v-if="loading" text="Загрузка профиля..." />
    <div v-else class="auth-form profile-form">
      <div class="profile-header">
        <div class="avatar-section">
          <div class="avatar-container">
            <div class="avatar" :style="avatarStyle" v-if="!filePreview">
              {{ avatarInitials }}
            </div>
            <img v-if="filePreview" class="avatar" :style="avatarStyle" :src="filePreview" alt="avatar">
            <button @click="editAvatar" class="avatar-edit-btn" title="Сменить аватар">
              ✏️
            </button>
          </div>
        </div>
        <div class="profile-info">
          <h1 class="username">{{ user.username }}</h1>
          <div class="user-meta">
            <span class="user-id">ID: {{ user.id }}</span>
          </div>
          <h2 class="user-email">{{ user.email }}</h2>
        </div>
      </div>
      <div v-if="showNotification" class="notification" :class="notificationType">
        {{ notificationMessage }}
        <button @click="hideNotification" class="close-btn">×</button>
      </div>
      <div class="profile-section">
        <h3 class="section-title">О себе</h3>
        <div v-if="!editingBio" class="bio-content">
          <p class="bio-text" :class="{ 'bio-empty': !user.bio }">
            {{ user.bio || 'Пользователь пока не добавил информацию о себе' }}
          </p>
        </div>
        <div v-else class="bio-editor">
          <textarea
            v-model="editBioText"
            class="bio-textarea"
            placeholder="Расскажите о себе..."
            rows="4"
            maxlength="500"
          ></textarea>
          <div class="bio-actions">
            <span class="char-counter">{{ editBioText.length }}/500</span>
            <div class="action-buttons">
              <button @click="cancelEditingBio" class="cancel-button">Отмена</button>
              <button @click="saveBio" class="save-button" :disabled="!editBioText.trim() || saving">
                {{ saving ? 'Сохранение...' : 'Сохранить' }}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="profile-section">
        <h3 class="section-title">Настройки аккаунта</h3>
        <div class="settings-list">
          <button @click="showEditModal = true" class="settings-button">
            <span class="settings-icon">👤</span>
            <span class="settings-text">Редактировать профиль</span>
            <span class="settings-arrow">→</span>
          </button>
          <button @click="changePassword" class="settings-button">
            <span class="settings-icon">🔒</span>
            <span class="settings-text">Сменить пароль</span>
            <span class="settings-arrow">→</span>
          </button>
          <button @click="logout" class="settings-button">
            <span class="settings-icon">@</span>
            <span class="settings-text">Изменить адрес электронной почты (ДОДЕЛАЙ СУКА!!)</span>
            <span class="settings-arrow">→</span>
          </button>
          <button @click="logout" class="settings-button logout-button">
            <span class="settings-icon">🚪</span>
            <span class="settings-text">Выйти из аккаунта</span>
            <span class="settings-arrow">→</span>
          </button>
        </div>
      </div>
    </div>
    <div v-if="showAvatarModal" class="modal-overlay">
      <div class="modal-content avatar-modal">
        <Loader v-if="loadingModal" text="Загрузка..." />
        <h3>Смена аватара</h3>
        <div class="file-input-wrapper">
          <label class="custom-file-label" for="avatar-upload">Выберите файл</label>
          <input id="avatar-upload" type="file" @change="handleFileUpload" accept="image/png, image/jpeg">
          <span class="file-name">{{ file ? file.name : 'Не выбран файл' }}</span>
        </div>
        <div class="modal-actions">
          <button @click="showAvatarModal = false" class="cancel-button">Отмена</button>
          <button @click="uploadIcon" :disabled="!file" class="save-button">Сохранить</button>
        </div>
      </div>
    </div>
    <div v-if="showEditModal" class="modal-overlay">
      <div class="modal-content avatar-modal">
        <Loader v-if="loadingModal" text="Загрузка..." />
        <h3>Редактирование профиля</h3>
        <div class="edit-fields">
          <input type="text" class="modal-input" placeholder="username" v-model="newUsername">
          <input type="text" class="modal-input" placeholder="description" v-model="newDescription">
        </div>
        <div class="modal-actions">
          <button @click="showEditModal = false" class="cancel-button">Отмена</button>
          <button @click="updateProfile" class="save-button">Сохранить</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Loader from '@/components/Loader.vue'
import { useAuthStore } from '@/stores/auth';
import { useIconStore } from '@/stores/icon';
import { useUserStore } from '@/stores/user';

export default {
  name: 'UserProfile',
  components: { Loader },
  data() {
    return {
      user: {},
      file: null,
      filePreview: null,
      loading: true,
      loadingModal: false,
      editingBio: false,
      editBioText: '',
      saving: false,
      showAvatarModal: false,
      showEditModal: false,
      showNotification: false,
      notificationMessage: '',
      notificationType: 'error',
      avatarColor: '#2b2b2b',

      newUsername: '',
      newDescription: ''
    }
  },
  computed: {
    avatarStyle() {
      return {
        backgroundColor: this.avatarColor,
      }
    },
  },
  async mounted() {
    await this.loadUserData()
  },
  methods: {
    async loadUserData() {
      this.loading = true
      try {
        const response = await useUserStore().getMe()
        if (response.success) {
          this.user = response.data
          console.log('user',this.user)
          await this.getIcon(this.user.id)
        } else {
          this.showNotificationMessage(response.error, 'error')
        }
      } catch (error) {
        this.showNotificationMessage('Ошибка загрузки профиля', 'error')
      } finally {
        this.loading = false
      }
    },
    async updateProfile(){
      this.loadingModal = true
      if (this.newUsername === '' && this.newDescription === ''){
        this.showNotificationMessage('Измените хотя бы одно поле', 'error')
        return 
      }
      try {
        const response = await useUserStore().updateProfile({
          username: this.newUsername === '' ? null : this.newUsername,
          bio: this.newDescription === '' ? null : this.newDescription
        },{
          headers: {
            Authorization: `${useAuthStore().token}`
          }
        })
        if (response.success) {
          this.showNotificationMessage('Обновление информации прошло успешно','success')
          this.newUsername !== '' ? this.user.username = this.newUsername : ''
          this.newDescription !== '' ? this.user.bio = this.newDescription : ''
        }
      } catch (error) {
        this.showNotificationMessage(error,'error')
      } finally {
        this.loadingModal = false 
      }
    },
    async getIcon(id){
      try{
        console.log(id)
        const iconResponse = await useUserStore().getUserIcon(id)
        console.log(iconResponse)
        if (iconResponse && iconResponse.data) {
          const blob = new Blob([iconResponse.data], { type: 'image/jpeg' })
          this.filePreview = URL.createObjectURL(blob)
        }else{
          console.log('иконка профиля не найдена')
        }
      } catch (error) {
        console.log('Ошибка при получении иконки профиля')
      }
      
    },
    handleFileUpload() {
      this.file = event.target.files[0]
    },
    async uploadIcon() {
      if (!this.file) return
      const formData = new FormData()
      formData.append('attachment', this.file)
      this.loadingModal = true
      try {
        const response = await useIconStore().upload(formData)
        if (response.success){
          this.showNotificationMessage('Иконка успешно обновлена', 'success')
          this.showAvatarModal = false
          await useUserStore().updateProfile({ icon_id: response.data.id })
          setTimeout(async () => {
            await this.getIcon(this.user.id)
          },300)
        } else {
          this.showNotificationMessage(response.error, 'error')
          this.showAvatarModal = false
        }
      } catch (error) {
        this.showNotificationMessage('Ошибка при загрузке иконки', 'error')
      } finally {
        this.loadingModal = false
      }
    },
    startEditingBio() {
      this.editBioText = this.user.bio
      this.editingBio = true
    },
    cancelEditingBio() {
      this.editingBio = false
      this.editBioText = ''
    },
    async saveBio() {
      this.saving = true
      try {
        await new Promise(resolve => setTimeout(resolve, 1000))
        this.user.bio = this.editBioText
        this.editingBio = false
        this.showNotificationMessage('Описание успешно обновлено', 'success')
      } catch (error) {
        this.showNotificationMessage('Ошибка сохранения', 'error')
      } finally {
        this.saving = false
      }
    },
    editAvatar() {
      this.showAvatarModal = true
    },
    changePassword() {
      this.$router.push('/change-password')
    },
    logout() {
      try {
        useAuthStore().logout()
        this.$router.push('/login')
      } catch (error) {
        this.showNotificationMessage('Ошибка при выходе', 'error')
      }
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
  max-width: 600px;
}

.profile-form {
  max-width: 700px;
}

/* Шапка профиля */
.profile-header {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  align-items: flex-start;
}

.avatar-section {
  flex-shrink: 0;
}

.avatar-container {
  position: relative;
  display: inline-block;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 700;
  color: white;
  background-size: cover;
  background-position: center;
  border: 4px solid white;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.avatar-edit-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  transition: all 0.3s ease;
}

.avatar-edit-btn:hover {
  background: #5a67d8;
  transform: scale(1.1);
}

.profile-info {
  flex: 1;
}

.username {
  color: #333;
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  line-height: 1.2;
}

.user-meta {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 0.5rem;
}

.user-id {
  color: #666;
  font-size: 0.9rem;
  font-family: 'Courier New', monospace;
  background: #f8fafc;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.user-email {
  color: #667eea;
  font-size: 1.1rem;
  font-weight: 500;
  margin: 0;
}

/* Секции профиля */
.profile-section {
  margin-bottom: 2.5rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #e1e5e9;
}

.profile-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.section-title {
  color: #333;
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

/* Биография */
.bio-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.bio-text {
  color: #555;
  line-height: 1.6;
  margin: 0;
}

.bio-empty {
  color: #999;
  font-style: italic;
}

.edit-button {
  align-self: flex-start;
  background: #667eea;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.3s ease;
}

.edit-button:hover {
  background: #5a67d8;
}

.bio-editor {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.bio-textarea {
  width: 100%;
  padding: 1rem;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  min-height: 100px;
  transition: border-color 0.3s ease;
}

.bio-textarea:focus {
  outline: none;
  border-color: #667eea;
}

.bio-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.char-counter {
  color: #666;
  font-size: 0.8rem;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.cancel-button {
  background: #6b7280;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.3s ease;
}

.cancel-button:hover {
  background: #4b5563;
}

.save-button {
  background: #10b981;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.3s ease;
}

.save-button:hover:not(:disabled) {
  background: #059669;
}

.save-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Настройки */
.settings-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.settings-button {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: none;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
  width: 100%;
}

.settings-button:hover {
  background: #f8fafc;
  border-color: #667eea;
  transform: translateX(4px);
}

.settings-icon {
  font-size: 1.2rem;
  width: 24px;
  text-align: center;
}

.settings-text {
  flex: 1;
  color: #333;
  font-weight: 500;
}

.settings-arrow {
  color: #666;
  font-size: 1.2rem;
}

.settings-button.logout-button {
  border-color: #fee2e2;
  color: #dc2626;
}

.settings-button.logout-button:hover {
  background: #fee2e2;
  border-color: #dc2626;
}

/* Модальное окно */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(40, 40, 70, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  overflow: auto;
  animation: fadeInModal 0.3s;
}

@keyframes fadeInModal {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-content {
  background: #fff;
  padding: 2.5rem 2rem 2rem 2rem;
  border-radius: 18px;
  box-shadow: 0 8px 32px rgba(60, 60, 120, 0.18);
  max-width: 420px;
  width: 96vw;
  text-align: center;
  position: relative;
  animation: modalPop 0.3s;
  box-sizing: border-box;
  overflow: hidden;
}

@keyframes modalPop {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.modal-content h3 {
  color: #2d2d2d;
  margin-bottom: 1.2rem;
  font-size: 1.35rem;
  font-weight: 700;
  letter-spacing: 0.01em;
  word-break: break-word;
}

.file-input-wrapper {
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
  box-sizing: border-box;
  margin-bottom: 1.1rem;
  overflow: hidden;
}

.modal-content input[type="file"] {
  width: 0.1px;
  height: 0.1px;
  opacity: 0;
  position: absolute;
  z-index: -1;
}

.custom-file-label {
  display: inline-block;
  background: #e0e7ff;
  color: #764ba2;
  border: 2px solid #764ba2;
  border-radius: 8px;
  padding: 0.6rem 1.2rem;
  cursor: pointer;
  font-weight: 500;
  font-size: 1rem;
  transition: background 0.2s, color 0.2s;
  margin-right: 0.5rem;
  box-sizing: border-box;
  white-space: nowrap;
}

.custom-file-label:hover {
  background: #c7d2fe;
  color: #5a67d8;
}

.file-name {
  flex: 1;
  font-size: 1rem;
  color: #333;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  word-break: break-all;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
  flex-wrap: wrap;
}

.cancel-button,
  .save-button {
    min-width: 120px;
    box-sizing: border-box;
  }


/* Для input[type="file"] — скрыть стандартную кнопку, добавить кастомную */
.modal-content input[type="file"]::-webkit-file-upload-button {
  visibility: hidden;
}
.modal-content input[type="file"]::before {
  content: 'Выберите файл';
  display: inline-block;
  background: #e0e7ff;
  color: #764ba2;
  border: 2px solid #764ba2;
  border-radius: 8px;
  padding: 0.6rem 1.2rem;
  outline: none;
  white-space: nowrap;
  cursor: pointer;
  font-weight: 500;
  font-size: 1rem;
  margin-right: 1rem;
  transition: background 0.2s, color 0.2s;
}
.modal-content input[type="file"]:hover::before {
  background: #c7d2fe;
  color: #5a67d8;
}

/* Адаптивность */
@media (max-width: 600px) {
  .modal-content {
    padding: 1.2rem 0.5rem;
    max-width: 98vw;
  }
  .modal-actions {
    flex-direction: column;
    gap: 0.7rem;
  }
}

.edit-fields {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.2rem;
}

.modal-input {
  width: 100%;
  padding: 0.85rem 1rem;
  border: 2px solid #e1e5e9;
  border-radius: 10px;
  font-size: 1rem;
  background: #f8fafc;
  transition: border-color 0.2s;
  font-family: inherit;
  box-sizing: border-box;
}

.modal-input:focus {
  border-color: #764ba2;
  background: #eef2ff;
  outline: none;
}

.notification {
  margin: 1rem 0 1.5rem 0;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  background: #f3f4f6;
  color: #333;
  border: 1.5px solid #e1e5e9;
  position: relative;
}

.notification.success {
  background: #e0fbe7;
  color: #059669;
  border-color: #bbf7d0;
}

.notification.error {
  background: #fee2e2;
  color: #dc2626;
  border-color: #fecaca;
}

.close-btn {
  background: none;
  border: none;
  color: #888;
  font-size: 1.3rem;
  cursor: pointer;
  margin-left: 1rem;
  transition: color 0.2s;
}

.close-btn:hover {
  color: #333;
}
</style>