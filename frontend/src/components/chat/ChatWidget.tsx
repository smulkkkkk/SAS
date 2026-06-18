// frontend/src/components/chat/ChatWidget.tsx
import { useChatStore } from '@/store'
import { ChatDrawer } from './ChatDrawer'
import { cn } from '@/utils'

export function ChatWidget() {
  const { isOpen, toggleChat } = useChatStore()

  return (
    <>
      <ChatDrawer />
      <button
        onClick={toggleChat}
        aria-label={isOpen ? 'Fechar assistente' : 'Abrir assistente'}
        className={cn(
          'fixed bottom-6 right-6 z-40 w-12 h-12 rounded-2xl',
          'bg-[var(--accent-blue)] text-white shadow-lg shadow-[var(--accent-blue)]/20',
          'flex items-center justify-center',
          'hover:scale-105 active:scale-95 transition-transform duration-150',
          isOpen && 'opacity-0 pointer-events-none',
        )}
      >
        <svg
          className="w-5 h-5"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M17.5 11.25a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z" />
          <path d="M6.25 9.375h7.5M6.25 12.5h5" strokeLinecap="round" />
        </svg>
      </button>
    </>
  )
}
