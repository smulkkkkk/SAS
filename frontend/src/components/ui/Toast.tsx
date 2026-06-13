import { useNotificationsStore } from '@/store'

export function ToastContainer() {
  const { toasts, removeToast } = useNotificationsStore()
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          onClick={() => removeToast(t.id)}
          className="cursor-pointer rounded-lg px-4 py-3 text-sm text-white shadow-lg"
          style={{ background: t.type === 'error' ? '#EF4444' : t.type === 'success' ? '#10B981' : t.type === 'warning' ? '#F59E0B' : '#3B82F6' }}
        >
          {t.message}
        </div>
      ))}
    </div>
  )
}
