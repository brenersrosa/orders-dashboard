import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const headingVariants = cva('font-title font-bold text-zinc-50 leading-tight', {
  variants: {
    size: {
      sm: 'text-xl',
      md: 'text-2xl',
      lg: 'text-4xl',
      '2xl': 'text-5xl',
      '3xl': 'text-6xl',
      '4xl': 'text-7xl',
      '5xl': 'text-8xl',
      '6xl': 'text-9xl',
    },
  },
  defaultVariants: {
    size: 'sm',
  },
})

interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {
  as?: React.ElementType
}

const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ as, className, size, ...props }, ref) => {
    const Component = as || 'h2'

    return (
      <Component
        ref={ref}
        className={cn(headingVariants({ className, size }), className)}
        {...props}
      />
    )
  },
)

Heading.displayName = 'Heading'

export { Heading }
