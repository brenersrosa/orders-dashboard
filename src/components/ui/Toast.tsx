import { useEffect, useState } from 'react'
import * as ToastRadix from '@radix-ui/react-toast'
import { X } from 'phosphor-react'

import { useToast } from '@/contexts/ToastContext'
import clsx from 'clsx'

interface ToastProps {
  show: boolean
  title: string
  message: string
  type: 'success' | 'error' | 'warning'
}

export function Toast({ show, title, message, type }: ToastProps) {
  const { showToast, hideToast } = useToast()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setOpen(show)
  }, [showToast, show])

  return (
    <ToastRadix.Provider swipeDirection="right">
      <ToastRadix.Root
        className="data-[state=closed]:animate-hide data-[state=open]:animate-slideIn data-[swipe=end]:animate-swipeOut flex items-center justify-between gap-10 rounded-lg bg-zinc-800 p-6 shadow-lg data-[swipe=cancel]:translate-x-0 data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=cancel]:transition-[transform_200ms_ease-out]"
        open={open}
        onOpenChange={(newOpen: boolean) => {
          setOpen(newOpen)
          if (!newOpen) hideToast()
        }}
      >
        <div
          className={clsx(
            "flex items-center gap-4 before:h-3 before:w-3 before:rounded-full before:content-['']",
            {
              'before:bg-green-500': type === 'success',
              'before:bg-red-500': type === 'error',
              'before:bg-yellow-500': type === 'warning',
            },
          )}
        >
          <div className="flex flex-col gap-2">
            <ToastRadix.Title className="font-medium text-zinc-50">
              {title}
            </ToastRadix.Title>
            <ToastRadix.Description asChild>
              <time className="text-sm leading-snug text-zinc-200">
                {message}
              </time>
            </ToastRadix.Description>
          </div>
        </div>
        <ToastRadix.Action className="" asChild altText="Goto schedule to undo">
          <button
            className="flex cursor-pointer items-center justify-center rounded-md p-2 leading-[0] text-zinc-200 transition-colors hover:bg-zinc-700"
            onClick={() => setOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </ToastRadix.Action>
      </ToastRadix.Root>
      <ToastRadix.Viewport className="fixed right-0 top-0 z-[2147483647] m-0 flex w-auto max-w-[100vw] list-none flex-col gap-3 p-[var(--viewport-padding)] outline-none [--viewport-padding:_25px]" />
    </ToastRadix.Provider>
  )
}
