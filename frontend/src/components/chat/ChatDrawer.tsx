// frontend/src/components/chat/ChatDrawer.tsx
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { MagicCard } from '@/components/inspira/MagicCard'
import { ChatMessage } from './ChatMessage'
import { ChatInput } from './ChatInput'
import { useChatStore } from '@/store'

export function ChatDrawer() {
  const { messages, isOpen, isStreaming, sendMessage, clearHistory, toggleChat } = useChatStore()
  const drawerRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!drawerRef.current) return
    if (isOpen) {
      gsap.fromTo(
        drawerRef.current,
        { x: 400, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.35, ease: 'power2.out' },
      )
    }
  }, [isOpen])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (!isOpen) return null

  return (
    <div ref={drawerRef} className="fixed bottom-6 right-6 z-50 w-80 sm:w-96">
      <MagicCard className="bg-[var(--bg-card)] border border-white/8 shadow-2xl shadow-black/40 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/6">
          <div>
            <p className="text-sm font-semibold text-[var(--text-primary)]">Assistente</p>
            <p className="text-xs text-[var(--text-muted)]">Powered by Claude</p>
          </div>
          <div className="flex gap-1">
            <button
              onClick={clearHistory}
              className="p-1.5 rounded-lg hover:bg-white/5 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
              title="Limpar historico"
            >
              <svg
                className="w-3.5 h-3.5"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  d="M2 4h12l-1 9H3L2 4ZM6 4V2h4v2M1 4h14"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              onClick={toggleChat}
              className="p-1.5 rounded-lg hover:bg-white/5 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
              aria-label="Fechar assistente"
            >
              <svg
                className="w-3.5 h-3.5"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M2 2l12 12M14 2 2 14" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="h-72 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 && (
            <div className="h-full flex items-center justify-center">
              <p className="text-xs text-[var(--text-muted)] text-center leading-relaxed">
                Ola! Pergunte sobre seus
                <br />
                agendamentos, financas ou clientes.
              </p>
            </div>
          )}
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="px-4 pb-4 pt-2 border-t border-white/6">
          <ChatInput onSend={sendMessage} disabled={isStreaming} />
        </div>
      </MagicCard>
    </div>
  )
}
