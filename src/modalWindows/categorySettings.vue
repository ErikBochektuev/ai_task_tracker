<template>
  <div class="modal-wrapper">
    <transition name="fade-modal">
      <div class="modal-content modal__container">
        <Loader v-if="loading"></Loader>
        <h1 class="modal__container--title">Настройки категории</h1>
        <div class="input__group">
          <label for="categoryName" class="input__group--label">Название категории</label>
          <input
            id="categoryName"
            v-model="editName"
            type="text"
            class="input__group--input"
            placeholder="Введите название"
            maxlength="30"
          >
          <label for="categoryName" class="input__group--label">Цвет</label>
          <input
            id="categoryName"
            v-model="color"
            type="text"
            class="input__group--input"
            placeholder="Введите название"
            maxlength="10"
          >
        </div>
        <div class="modal-actions">
          <buttonComponent 
          @click="$emit('close')"
          :text="'Отмена'"
          class="close"/>
          <buttonComponent 
          @click="saveCategory"
          :text="'Сохранить'"
          class="positive"/>
          <buttonComponent 
          @click="confirmDelete"
          class="delete"
          :text="'Удалить категорию'"/>
        </div>
        <div v-if="showDeleteConfirm" class="delete-confirm">
          <p>Вы уверены, что хотите удалить категорию?</p>
          <div class="modal-actions">
            <buttonComponent 
            @click="showDeleteConfirm = false"
            class="close"
            :text="'Отмена'"/>
            <buttonComponent 
            @click="deleteCategory"
            class="delete"
            :text="'Удалить'"/>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { useCategoryStore } from '@/stores/category';
import { useAuthStore } from '@/stores/auth';
import buttonComponent from '@/components/button.vue';
import Loader from '@/components/Loader.vue';

export default {
  name: 'categorySettings',
  components: { buttonComponent, Loader },
  props: {
    data: Object
  },
  data() {
    return {
      editName: this.data?.name || '',
      color: '',

      showDeleteConfirm: false,
      loading: false
    }
  },
  methods: {
    async saveCategory() {
        this.loading = true
        try{
            const response = await useCategoryStore().updateCategory(this.data.id ,{
                name: this.editName,
                color: this.color
            },{
                headers: {
                    Authorization: `${useAuthStore().token}`
                }
            })
            if (response.success === true) {
                this.$emit('save', { name: this.editName, color: this.color })
            } else {
              console.log(response.error)
            }
        } catch (error) {
            console.log(error)
        } finally {
            this.loading = false
        }
    },
    confirmDelete() {
      this.showDeleteConfirm = true
    },
    async deleteCategory() {
      this.loading = true
      try {
        const response = await useCategoryStore().deleteCategory(this.data.id, {
          headers: {
            Authorization: `${useAuthStore().token}`
          }
        })
        if (response.success){
          this.$emit('update')
        } else {
          console.log(response)
        }
      } catch (error) {
        console.log('catch',error)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

