<template>
  <div class="modal-wrapper">
    <transition name="fade-modal">
      <div class="modal__container modal-content">
          <div class="logo-container">
            <h1 class="modal__container--title">Участники проекта</h1>
            <button type="button" class="edit-btn" v-if="currentRole === 'OWNER' || currentRole === 'ADMINISTRATOR'" @click="edit = !edit" title="Редактировать">
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
                <path d="M4 20h4.586l10.293-10.293a1 1 0 0 0 0-1.414l-3.172-3.172a1 1 0 0 0-1.414 0L4 15.586V20z" stroke="#667eea" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>

          <div v-if="showNotification" class="notification" :class="notificationType">
            {{ notificationMessage }}
            <button @click="hideNotification" class="close-btn">×</button>
          </div>
          
          <div class="section" v-if="!edit">
            <div class="input__group" v-if="currentRole === 'OWNER' || currentRole === 'ADMINISTRATOR'">
              <label for="userEmail" class="input__group--label">Добавить участника</label>
              <div class="add-user-container">
                <input
                  id="userEmail"
                  v-model.trim="newUserEmail"
                  type="email"
                  class="input__group--input"
                  :class="{ 'input-error': errors.userEmail }"
                  placeholder="Введите email пользователя"
                  @blur="validateEmail"
                  @input="clearError('userEmail')"
                >
                <button
                  type="button"
                  class="add-user-button"
                  @click="addUser"
                  :disabled="!newUserEmail || loading"
                >
                  Добавить
                </button>
              </div>
              <span v-if="errors.userEmail" class="error-message">{{ errors.userEmail }}</span>
            </div>

            <div v-if="projectMembers.length > 0" class="members-list">
              <h3 class="members-title">Участники ({{ projectMembers.length }})</h3>
              <div 
                v-for="member in projectMembers" 
                :key="member.id" 
                class="member-item"
              >
                <div class="member-info">
                  <span class="member-name">{{ member.id }}</span>
                  <span class="member-email">{{ member.role }}</span>
                  <div class="member-newrole" v-if="(currentRole === 'OWNER' && member.role !== 'OWNER') || (currentRole === 'ADMINISTRATOR' && member.role !== 'ADMINISTRATOR' && member.role !== 'OWNER')">
                    <svg width="22" height="22" fill="none" viewBox="0 0 24 24" class="member-newrole-title" @click="updateRole = !updateRole && (currentNewRole = member.user_id)">
                      <path d="M4 20h4.586l10.293-10.293a1 1 0 0 0 0-1.414l-3.172-3.172a1 1 0 0 0-1.414 0L4 15.586V20z" stroke="#667eea" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <div class="member-newrole-variants" :class="{ 'active': updateRole && (currentNewRole === member.user_id) }" >
                      <div class="member-newrole-variant" v-for="role in roles" :key="role" @click="changeRole(role, member.user_id)">
                        {{ role }}
                      </div>
                    </div>
                  </div>
                  <span v-if="member.user_id === currentUserId" class="member-badge">Вы</span>
                  <span v-if="member.role === 'OWNER'" class="member-badge owner">Владелец</span>
                  <span v-if="member.role === 'ADMINISTRATOR'" class="member-badge admin">Админ</span>
                  <span v-if="member.role === 'READER'" class="member-badge reader">Гость</span>
                </div> 
                <button
                  v-if="canRemoveMember(member)"
                  type="button"
                  class="remove-member-btn"
                  @click="removeMember(member)"
                  title="Удалить из проекта"
                >
                  ×
                </button>
              </div>
            </div>
          </div>

          <div v-if="edit">
            <div class="section">
              <h2 class="section-title">Основная информация</h2>
              <div class="input__group">
                <label for="name" class="input__group--label">Название проекта</label>
                <input
                  id="name"
                  v-model.trim="form.name"
                  type="text"
                  class="input__group--input"
                  :class="{ 'input-error': errors.name }"
                  :placeholder="data.name"
                  @blur="validateField('name')"
                  @input="clearError('name')"
                >
                <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
              </div>
              <div class="input__group">
                <label for="description" class="input__group--label">Описание проекта</label>
                <input
                  id="description"
                  v-model.trim="form.description"
                  class="input__group--input"
                  :class="{ 'input-error': errors.description }"
                  :placeholder="data.description"
                  rows="4"
                  @blur="validateField('description')"
                  @input="clearError('description')"
                >
                <span v-if="errors.description" class="error-message">{{ errors.description }}</span>
              </div>
              <div class="file-input-wrapper">
                <label class="custom-file-label" for="avatar-upload">Сменить иконку проекта</label>
                <input id="avatar-upload" type="file" @change="handleFileUpload" accept="image/png, image/jpeg">
                <span class="file-name">{{ file ? file.name : 'Не выбран файл' }}</span>
              </div>
            </div>
            
          </div>
          
          <div class="section danger-section" v-if="!showDeleteConfirm">
            <div class="danger-actions">
              <buttonComponent 
              class="delete"
              @click="confirmDeleteProject"
              :text="currentRole === 'OWNER' ? 'Удалить проект': 'Выйти из проекта'"
              />
              <p class="danger-description">
                Действие невозможно отменить. Все данные будут безвозвратно удалены.
              </p>
            </div>
          </div>
            <div class="section danger-section danger-actions" v-if="showDeleteConfirm" >
              <h1 class="danger-title">Подтверждение</h1>
              <p>{{ currentRole === 'OWNER'  ? 'Вы уверены, что хотите удалить проект?': 'Вы уверены, что хотите покинуть проект?' }}</p>
              <p class="warning-text">Это действие невозможно отменить!</p>
              <div class="modal-actions">
                <buttonComponent 
                @click="showDeleteConfirm = false"
                class="close"
                :text="'Отмена'"/>
                <buttonComponent 
                @click="deleteMethod"
                class="delete"
                :text="currentRole !== 'OWNER' ? 'Выйти из проекта': 'Удалить проект'"/>
              </div>
            </div>
          <div class="action-buttons">
            <buttonComponent 
            @click="$emit('close')"
            class="close"
            :text="'Отмена'"/>
            
            <buttonComponent 
            @click="handleSave"
            v-if="edit"
            class="positive"
            :text="loading ? 'Сохранение': 'Сохранить изменения'"/>
          </div>

        
          
        
      </div>
    </transition>
    
  </div>
</template>

<script>
import { useProjectsStore } from '@/stores/projects'
import { useAuthStore } from '@/stores/auth'
import { useIconStore } from '@/stores/icon';
import buttonComponent from '@/components/button.vue';

export default {
  name: 'ProjectSettings',
  components: { buttonComponent },
  data() {
    return {
      currentRole: '',
      new_user_role: 'READER',
      form: {
        name: '',
        description: '',
        icon_id: null
      },
      roles : ['ADMINISTRATOR', 'USER', 'READER'],
      currentNewRole: null,
      newUserEmail: '',
      projectMembers: [],
      currentUserId: 1,
      errors: {
        name: '',
        description: '',
        userEmail: ''
      },
      loading: true,
      updateRole: false,
      showNotification: false,
      notificationMessage: '',
      notificationType: 'error',
      showDeleteConfirm: false,
      edit: false,
      file: null
    }
  },
  props: {
    data: {
        type: Object,
        required: true
    },
  },
  
  methods: {
    handleFileUpload(event) {
      this.file = event.target.files[0];
    },
    validateField(field) {
      switch (field) {
        case 'name':
          this.errors.name = this.form.name ? 
            (this.form.name.length < 5 ? 'Название должно содержать минимум 5 символов' : this.form.name.length > 100 ? 'Название должно содержать менее 100 символов': '') : 
            ''
          break
        
        case 'description':
          this.errors.description = this.form.description ? 
            (this.form.description.length > 300 ? 'Описание не должно превышать 300 символов' : '') : 
            ''
          break
      }
    },
    
    validateEmail() {
      this.errors.userEmail = this.newUserEmail ? 
        (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.newUserEmail) ? 'Некорректный формат email' : '') : 
        ''
    },
    
    clearError(field) {
      this.errors[field] = ''
    },
    
    canRemoveMember(member) {
      return member.user_id !== this.currentUserId && member.role !== 'OWNER' && ((this.currentRole === 'OWNER') || (this.currentRole === 'ADMINISTRATOR' && member.role !== 'ADMINISTRATOR'))
    },
    
    async removeMember(member) {
      if (!confirm(`Удалить ${member.role} из проекта?`)) return
      this.loading = true
      try {
        const response = await useProjectsStore().deleteMember({
          project_id: this.data.id,
          user_id: member.user_id
        },{
          headers: {
            Authorization: `${useAuthStore().token}`
          }
        })
        if (response.success){
          this.showNotificationMessage('Пользователь успешно удален!', 'success')
          await this.getProjectMembers()
        } else {
          this.showNotificationMessage(response.error, 'error')
        }
      } catch(error) {
        this.showNotificationMessage(error, 'error')
      } finally {
        this.loading = false
      }
    },
    async uploadIcon() {
      if (!this.file) {
        return
      }
      const formData = new FormData()
      formData.append('attachment', this.file)
      try {
        const response = await useIconStore().upload(formData, {
          headers: {
            Authorization: `${useAuthStore().token}`
          }
        })
        if (response.success) {
          console.log(response.data)
          this.form.icon_id = response.data.id
        } else {
          console.log(response.error)
        }
      } catch (error) {
        this.showNotificationMessage('Ошибка при загрузке иконки', 'error')
      }
    },
    async handleSave() {
      if (!this.validateForm()) {
        this.showNotificationMessage('Пожалуйста, исправьте ошибки в форме', 'error')
        return
      }
      
      this.loading = true

      try {
        if (this.file) {
          await this.uploadIcon()
        }
        const authStore = useAuthStore()
        const response = await useProjectsStore().updateProject(
        this.data.id, 
        {
            name: this.form.name === "" ? this.data.name : this.form.name,
            description: this.form.description === "" ? this.data.description : this.form.description,
            icon_id: this.form.icon_id === null ? this.data.icon_id : this.form.icon_id
        }, {
            headers: {
                Authorization: `${authStore.token}`
            }
        })
        

        if (response.success) {
            this.showNotificationMessage('Обновление прошло успешо', 'success')
            setTimeout(() => {
                this.$emit('update')
            }, 1000)
        } else {
            this.showNotificationMessage('Не удалось обновить данные', 'error')
        }
      } catch (error) {
        this.showNotificationMessage('Ошибка', 'error')
      } finally {
        this.loading = false
      }
    },
    
    validateForm() {
      this.validateField('name')
      return !this.errors.name
    },
    
    confirmDeleteProject() {
      this.showDeleteConfirm = true
    },
    
    async deleteMethod() {
      if (this.currentRole === 'OWNER') {
        this.loading = true
        try {
            const projectStore = useProjectsStore()
            const response = await projectStore.deleteProject(this.data.id, { 
                headers: { 
                    Authorization: `${useAuthStore().token}`
                }
            })
            this.showDeleteConfirm = false
            if (response.success) {
                
                this.$emit('update', 'deleted')

            } else {
                this.showNotificationMessage(response.error, 'error')
            }
        } catch (error) {
            this.showNotificationMessage(error?.message || 'Ошибка', 'error')
        } finally {
            this.loading = false
        }
      } else {
        this.loading = true
        try {
          const response = await useProjectsStore().leaveProject(this.data.id, {
            headers: {
              Authorization: `${useAuthStore().token}`
            }
          })
          if (response.success) {
            this.showNotificationMessage('Вы успешно покинули проект!', 'success')
            setTimeout(() => {
              this.$emit('update')
            }, 1000)
          } else {
            this.showNotificationMessage(response.error, 'error')
          }
        } catch (error) {
          this.showNotificationMessage(error, 'error')
        } finally {
          this.loading = false
        }
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
    },

    getRole() {
      for(let member of this.projectMembers){
        if(member.user_id === useAuthStore().user_id){
          this.currentRole = member.role
          if (this.currentRole ==='ADMINISTRATOR'){
            this.roles = ['USER', 'READER']
          }
        }
      }
    },

    async getProjectMembers(){
        this.loading = true
        try {
            const response = await useProjectsStore().getProjectUsers(
                this.data.id,
                {
                    headers: {
                        Authorization: `${useAuthStore().token}`
                    }
                }
            )
            this.projectMembers = response.data.items
            if (this.currentUserId) {
              this.getRole()
            }
            if (!response.success) {
                this.showNotificationMessage('Не удалось получить участников проекта', 'error')
            }
        } catch (error) {
            this.showNotificationMessage(error, 'error')
        } finally {
            this.loading = false
        }
    },
    async addUser(){
        this.loading = true
        try {
            const response = await useProjectsStore().addProjectMember(
                this.data.id,
                {
                    inv_email: this.newUserEmail,
                    inv_role: this.new_user_role 
                },
                {
                    headers: {
                        Authorization: `${useAuthStore().token}`
                    }
                }
            )                 
            if (response.success) {
                this.showNotificationMessage('Уведомление отправлено на почту', 'success')
            } else {
                this.showNotificationMessage(response.error.data.detail, 'error')
            }
        } catch (error) {
            this.showNotificationMessage(error, 'error')
        } finally {
            this.loading = false
        }
    },
    
    async changeRole(project_role, memberID) {
      this.loading = true
      try {
        const response = await useProjectsStore().changeRole(this.data.id, memberID,
          {
            role: project_role
          },
          {
            headers: {
              Authorization: `${useAuthStore().token}`
            }
          }
        )
        if (response.success) {
          await this.getProjectMembers()
          this.showNotificationMessage('Роль успешно обновлена', 'success')

        } else {
          this.showNotificationMessage(response.error, 'error')
        }
      } catch (error) {
        this.showNotificationMessage(error, 'error')
      } finally {
        this.loading = false
      }
    },
  },

  async mounted() {
    this.currentUserId = useAuthStore().user_id
    this.form.name = this.data.name
    this.form.description = this.data.description
    await this.getProjectMembers()
  }
}
</script>

