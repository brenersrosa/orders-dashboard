import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const textVariants = cva('font-sans text-zinc-200 leading-relaxed', {
  variants: {
    size: {
      xs: 'text-xs',
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg md:text-xl lg:text-2xl',
      xl: 'text-xl md:text-2xl lg:text-3xl',
      '2xl': 'text-2xl md:text-3xl lg:text-4xl',
      '3xl': 'text-3xl md:text-4xl lg:text-5xl',
      '4xl': 'text-4xl md:text-5xl lg:text-6xl',
      '5xl': 'text-5xl md:text-6xl lg:text-7xl',
      '6xl': 'text-6xl md:text-7xl lg:text-8xl',
      '7xl': 'text-7xl md:text-8xl lg:text-9xl',
      '8xl': 'text-8xl md:text-8xl lg:text-9xl',
      '9xl': 'text-9xl',
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

interface TextProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof textVariants> {
  as?: React.ElementType
}

const Text = React.forwardRef<HTMLParagraphElement, TextProps>(
  ({ as, className, size, ...props }, ref) => {
    const Component = as || 'p'

    return (
      <Component
        ref={ref}
        className={cn(textVariants({ className, size }), className)}
        {...props}
      />
    )
  },
)

Text.displayName = 'Text'

export { Text }
