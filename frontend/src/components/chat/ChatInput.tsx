// frontend/src/components/chat/ChatInput.tsx
import { useState, useRef } from 'react'
import type { KeyboardEvent } from 'react'

interface Props {
  onSend: (text: string) => void
  disabled?: boolean
}

export function ChatInput({ onSend, disabled }: Props) {
  const [text, setText] = useState('')
  const ref = useRef<HTMLTextAreaElement>(null)

  const submit = () => {
    const trimmed = text.trim()
    if (!trimmed || disabled) return
    onSend(trimmed)
    setText('')
    ref.current?.focus()
  }

  const onKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
  }

  return (
    <div className="flex gap-2 items-end">
      <textarea
        ref={ref}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={onKey}
        disabled={disabled}
        rows={1}
        placeholder="Pergunte sobre seu negócio..."
        className="flex-1 resize-none px-3 py-2 rounded-xl text-sm bg-white/5 border border-white/8 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-blue)]/40 disabled:opacity-50 transition-colors max-h-28 overflow-y-auto"
        style={{ lineHeight: '1.5' }}
      />
      <button
        onClick={submit}
        disabled={disabled || !text.trim()}
        className="flex-shrink-0 w-8 h-8 rounded-xl bg-[var(--accent-blue)] text-white flex items-center justify-center disabled:opacity-40 hover:bg-[var(--accent-blue)]/90 transition-all"
        aria-label="Enviar"
      >
        <svg
          className="w-3.5 h-3.5"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M2 8h12M8 2l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  )
}
