import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { useAuthStore } from '@/stores/auth'

export function useNotifications(options = {}) {
  const auth = useAuthStore()
  const ws = ref(null)
  const connected = ref(false)
  const reconnectAttempts = ref(0)
  const maxReconnect = options.maxReconnect || 10
  const baseDelay = options.baseDelay || 500 
  const onMessage = options.onMessage || (() => {})
  const onOpen = options.onOpen || (() => {})
  const onClose = options.onClose || (() => {})
  const onError = options.onError || (() => {})

  const getWsUrl = () => {
    if (!auth.user_id) return null
    const protocol = 'ws'
    const host = '127.0.0.1'
    const serverPort = '8001'
    console.log('WebSocket URL:', `${protocol}://${host}:${serverPort}/ws/${auth.user_id}`)
    return `${protocol}://${host}:${serverPort}/ws/${auth.user_id}`
  }

  function connect() {
    const url = getWsUrl()
    if (!url) return
    if (ws.value && ws.value.readyState === WebSocket.OPEN) return

    try {
      ws.value = new WebSocket(url)

      ws.value.onopen = (ev) => {
        reconnectAttempts.value = 0
        connected.value = true
        onOpen(ev)
      }

      ws.value.onmessage = (ev) => {
        let data = ev.data
        try {
          data = JSON.parse(ev.data)
        } catch (e) {
        }
        onMessage(data, ev)
      }

      ws.value.onerror = (ev) => {
        onError(ev)
      }

      ws.value.onclose = (ev) => {
        connected.value = false
        onClose(ev)
        if (!ev.wasClean && reconnectAttempts.value < maxReconnect) {
          reconnectAttempts.value++
          const delay = baseDelay * Math.pow(1.5, reconnectAttempts.value)
          setTimeout(connect, delay)
        }
      }
    } catch (err) {
      connected.value = false
      setTimeout(connect, baseDelay)
    }
  }

  function send(obj) {
    if (!ws.value || ws.value.readyState !== WebSocket.OPEN) return false
    try {
      const payload = typeof obj === 'string' ? obj : JSON.stringify(obj)
      ws.value.send(payload)
      return true
    } catch (err) {
      return false
    }
  }

  function close() {
    if (ws.value) {
      try { ws.value.close(1000, 'client close') } catch (e) {}
      ws.value = null
      connected.value = false
    }
  }

  watch(
    () => auth.user_id,
    (id) => {
      if (id) connect()
      else close()
    },
    { immediate: true }
  )

  onBeforeUnmount(() => close())

  return {
    ws,
    connected,
    connect,
    close,
    send
  }
}