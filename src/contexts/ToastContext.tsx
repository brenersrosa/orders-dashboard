import { ReactNode, createContext, useContext, useState } from 'react'
import { Toast } from '@/components/ui/Toast'

interface ToastContextData {
  showToast: (
    title: string,
    message: string,
    type: 'success' | 'error' | 'warning',
  ) => void
  hideToast: () => void
}

const ToastContext = createContext<ToastContextData>({
  showToast: (title, message, type) => {
    console.log('Showing toast:', title, message, type)
  },
  hideToast: () => {
    console.log('Hiding toast')
  },
})

export function useToast() {
  return useContext(ToastContext)
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [show, setShow] = useState(false)
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [type, setType] = useState<'success' | 'error' | 'warning'>('success')

  function showToast(
    title: string,
    message: string,
    type: 'success' | 'error' | 'warning',
  ) {
    setShow(true)
    setTitle(title)
    setMessage(message)
    setType(type)
  }

  function hideToast() {
    setShow(false)
  }

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <Toast show={show} title={title} message={message} type={type} />
    </ToastContext.Provider>
  )
}
