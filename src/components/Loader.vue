<template>
  <div class="loader">
    <div class="spinner"></div>
    <span>{{ text }}</span>
  </div>
</template>

<script>
export default {
  name: 'Loader',
  props: {
    text: {
      type: String,
      default: 'Загрузка...'
    }
  }
}
</script>

<style scoped>
.loader {
  z-index: 1000;
  position: absolute;
  background: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  height: 100%;
  top: 0;
  left: 0;
  width:  100%;
  color: #667eea;
  font-size: 1.2rem;
  gap: 1rem;
}
.spinner {
  width: 48px;
  height: 48px;
  border: 5px solid #e0e7ff;
  border-top: 5px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 0.5rem;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>