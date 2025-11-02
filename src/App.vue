<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { useNotifications } from '@/composables/useNotification'
import Header from './components/header.vue'


// function handleIncoming(msg) {
//   console.log('WS message:', msg)
// }

// const { connected, send, close } = useNotifications({
//   serverPort: '8001',         
//   onMessage: handleIncoming,
//   onOpen: () => console.log('WS open'),
//   onClose: () => console.log('WS close'),
//   onError: () => console.log('WS error')
// })

</script>

<template>
  <Header />

  <RouterView />
</template>

<script>
import Header from './components/header.vue';

export default {
  name: 'App',
  components: {
    Header
  }
}
</script>

