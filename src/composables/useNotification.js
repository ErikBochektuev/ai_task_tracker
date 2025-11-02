import { ref, watch, onBeforeUnmount } from 'vue'
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
    if (!auth.user_id || !auth.token) return null
    const protocol = 'ws'
    const host = 'localhost'
    const port = '8001'
    const token = encodeURIComponent(auth.token)
    const url = `${protocol}://${host}:${port}/ws/connect?token=${token}`
    console.log('[WebSocket] connecting to:', url)
    return url
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
        console.log('%c[WebSocket] Connected to server ✅', 'color: #4CAF50')
        onOpen(ev)
      }

      ws.value.onmessage = (ev) => {
        let data = ev.data
        try {
          data = JSON.parse(ev.data)
        } catch {}
        console.log('[WebSocket] Message received:', data)
        onMessage(data, ev)
      }

      ws.value.onerror = (ev) => {
        console.error('[WebSocket] Error ❌', ev)
        onError(ev)
      }

      ws.value.onclose = (ev) => {
        connected.value = false
        console.warn(`[WebSocket] Disconnected (code ${ev.code})`)
        onClose(ev)

        // автоматическое переподключение
        if (!ev.wasClean && reconnectAttempts.value < maxReconnect) {
          reconnectAttempts.value++
          const delay = baseDelay * Math.pow(1.5, reconnectAttempts.value)
          console.log(`[WebSocket] Reconnecting in ${Math.round(delay)}ms...`)
          setTimeout(connect, delay)
        }
      }
    } catch (err) {
      console.error('[WebSocket] Connection failed:', err)
      connected.value = false
      setTimeout(connect, baseDelay)
    }
  }

  function send(obj) {
    if (!ws.value || ws.value.readyState !== WebSocket.OPEN) {
      console.warn('[WebSocket] Tried to send message while disconnected')
      return false
    }
    try {
      const payload = typeof obj === 'string' ? obj : JSON.stringify(obj)
      ws.value.send(payload)
      console.log('[WebSocket] Message sent:', payload)
      return true
    } catch (err) {
      console.error('[WebSocket] Failed to send:', err)
      return false
    }
  }

  function close() {
    if (ws.value) {
      console.log('[WebSocket] Closing connection...')
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
