<template>
    <li class="subtask-item">
      <div class="subtask-content">
        <input
          type="checkbox"
          :checked="subtask.completed"
          @change="toggleCompletion()"
          class="subtask-checkbox"
        />
        <span
          :class="{ 'subtask-completed': subtask.completed }"
          class="subtask-title"
          v-if="!creating"
          @dblclick="editSubtask(index)"
        >
          {{ subtask.name }}
        </span>
        <input
          v-if="creating"
          type="text"
          v-model="form.name"
          class="input__group--input"
        />
      </div>
      <div class="subtask-actions" v-if="!creating">
        <img src="../assets/icons/pen.svg" alt="update" class="icon" @click="creating = true" />
        <img src="../assets/icons/delete.svg" alt="delete" class="icon" @click="deleteSubtask()" />
      </div><div class="subtask-actions" v-if="creating">
        <img src="../assets/icons/save.svg" alt="save" class="icon" @click="updateSubtask()" />
        <img src="../assets/icons/close.svg" alt="close" class="icon" @click="cancelEdit()" />
      </div>
    </li>
</template>

<script>
import buttonComponent from './button.vue';
import { useSubtaskStore } from '@/stores/subtask';
export default {
    name: "subtaskCard",
    components: { buttonComponent },
    props: {
        subtask: {
            type: Object,
            required: true,
        },
        projectId: {
            type: Number,
            required: true,
        },
        taskId: {
            type: Number,
            required: true,
        },
    },
    data () {
        return {
            creating: false,
            form: {
                name: '',
            }
        }
    },    
    methods: {
        cancelEdit(){
            this.form.name = this.subtask.name
            this.creating = false
        },
        async toggleCompletion() {
            try {
                const response = await useSubtaskStore().updateSubtask(this.projectId, this.taskId, this.subtask.id, {
                    completed: !this.subtask.completed
                });
                if (response.success) {
                    console.log(response.data);
                    this.subtask.completed = !this.subtask.completed
                    console.log("Подзадача обновлена:", response.data);
                }
            } catch (error) {
                console.error("Ошибка при изменении задачи:", error);
            }
        },
        async updateSubtask() {
            try {
                const response = await useSubtaskStore().updateSubtask(this.projectId, this.taskId, this.subtask.id, {
                    name: this.form.name
                });
                if (response.success) {
                    console.log("Подзадача обновлена:", response.data);
                    this.subtask.name = this.form.name
                    this.creating = false
                    this.$emit("update");
                } else {
                    console.error("Ошибка при обновлении подзадачи:", response);
                }
            } catch (error) {
                console.error("Ошибка при обновлении подзадачи (2):", error);
            }
        },
        async deleteSubtask() {
            try {
                const response = await useSubtaskStore().deleteSubtask(this.projectId, this.taskId, this.subtask.id);
                if (response.success) {
                    console.log("Подзадача удалена:");
                    this.$emit("update");
                } else {
                    console.error("Ошибка при удалении подзадачи:", response);
                }
            } catch (error) {
                console.error("Ошибка при удалении подзадачи (2):", error);
            }
        }
    },
    mounted() {
        this.form.name = this.subtask.name
        console.log(this.form.name)
    }
}
</script>

<style>
.subtask-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #e6e9ef;
}

.subtask-content {
  display: flex;
  align-items: center;
  gap: 10px;
}

.subtask-checkbox {
  cursor: pointer;
}

.subtask-title {
  font-size: 1rem;
  color: #333;
  cursor: pointer;
  margin: 15.6px 18px;
}

.subtask-completed {
  text-decoration: line-through;
  color: #999;
}

.subtask-actions {
  display: flex;
  gap: 20px;
}

.new-subtask {
    padding-left: 23px;
}

.icon {
    width: 24px;
    height: 24px;
    cursor: pointer;
    transition: transform 0.2s ease-in-out;
}

.icon:hover {
    transform: scale(1.3);
}
</style>