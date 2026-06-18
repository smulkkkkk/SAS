// frontend/src/store/chat.store.ts
import { create } from 'zustand'
import { useAuthStore } from './auth.store'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface ChatState {
  messages: ChatMessage[]
  isOpen: boolean
  isStreaming: boolean
  toggleChat: () => void
  clearHistory: () => void
  sendMessage: (text: string, context?: Record<string, unknown>) => Promise<void>
}

export const useChatStore = create<ChatState>((set, _get) => ({
  messages: [],
  isOpen: false,
  isStreaming: false,

  toggleChat: () => set((s) => ({ isOpen: !s.isOpen })),

  clearHistory: () => set({ messages: [] }),

  sendMessage: async (text, context = {}) => {
    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    }
    set((s) => ({ messages: [...s.messages, userMsg], isStreaming: true }))

    const assistantId = crypto.randomUUID()
    const assistantMsg: ChatMessage = {
      id: assistantId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
    }
    set((s) => ({ messages: [...s.messages, assistantMsg] }))

    try {
      const token = useAuthStore.getState().accessToken
      const res = await fetch('/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ message: text, context }),
      })

      if (!res.ok) throw new Error('Erro na requisição')
      if (!res.body) throw new Error('Stream não disponível')

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() ?? ''

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const data = line.slice(6)
          if (data === '[DONE]') break
          try {
            const parsed = JSON.parse(data)
            if (parsed.text) {
              set((s) => ({
                messages: s.messages.map((m) =>
                  m.id === assistantId ? { ...m, content: m.content + parsed.text } : m
                ),
              }))
            }
          } catch { /* continua */ }
        }
      }
    } catch {
      set((s) => ({
        messages: s.messages.map((m) =>
          m.id === assistantId
            ? { ...m, content: 'Erro ao conectar com o assistente.' }
            : m
        ),
      }))
    } finally {
      set({ isStreaming: false })
    }
  },
}))
