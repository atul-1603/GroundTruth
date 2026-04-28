import { useState, useEffect } from 'react'
import { ToastProvider, ToastViewport, Toast, ToastTitle, ToastDescription } from '@radix-ui/react-toast'

let toastCount = 0

export function useToast() {
  const [toasts, setToasts] = useState<any[]>([])

  const toast = ({ title, description, variant = 'default' }: any) => {
    setToasts((prev) => [...prev, { id: toastCount++, title, description, variant }])
  }

  return { toast, toasts }
}

export function ToastContainer() {
  const { toasts } = useToast()
  return (
    <ToastProvider>
      {toasts.map((t) => (
        <Toast key={t.id} className="bg-dark-card border border-dark-border text-white p-4 rounded-md shadow-lg">
          <ToastTitle className="font-bold">{t.title}</ToastTitle>
          <ToastDescription>{t.description}</ToastDescription>
        </Toast>
      ))}
      <ToastViewport className="fixed bottom-0 right-0 p-6 flex flex-col gap-2 z-[100]" />
    </ToastProvider>
  )
}
