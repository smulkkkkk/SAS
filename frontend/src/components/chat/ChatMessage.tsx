// frontend/src/components/chat/ChatMessage.tsx
import { cn } from '@/utils'
import type { ChatMessage as Msg } from '@/store/chat.store'

export function ChatMessage({ message }: { message: Msg }) {
  const isUser = message.role === 'user'
  return (
    <div className={cn('flex gap-2 text-sm', isUser && 'flex-row-reverse')}>
      <div
        className={cn(
          'w-6 h-6 rounded-lg flex-shrink-0 flex items-center justify-center text-xs font-semibold mt-0.5',
          isUser
            ? 'bg-[var(--accent-blue)]/20 text-[var(--accent-blue)]'
            : 'bg-white/8 text-[var(--text-muted)]',
        )}
      >
        {isUser ? 'U' : 'P'}
      </div>
      <div
        className={cn(
          'max-w-[78%] px-3 py-2 rounded-xl leading-relaxed',
          isUser
            ? 'bg-[var(--accent-blue)]/15 text-[var(--text-primary)] rounded-tr-sm'
            : 'bg-white/5 text-[var(--text-primary)] rounded-tl-sm',
        )}
      >
        {message.content || (
          <span className="inline-block w-4 h-3 bg-white/20 rounded animate-pulse" />
        )}
      </div>
    </div>
  )
}
