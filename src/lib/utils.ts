import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  const mergedInputs = inputs.map((input) => {
    if (typeof input === 'object' && !Array.isArray(input)) {
      return twMerge(clsx(input))
    }
    return input
  })

  return clsx(...mergedInputs)
}
