import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const headingVariants = cva('font-title font-bold text-zinc-50 leading-tight', {
  variants: {
    size: {
      xxs: 'text-base',
      xs: 'text-lg',
      sm: 'text-xl',
      md: 'text-2xl',
      lg: 'text-3xl xl:text-6xl',
      '2xl': 'text-4xl xl:text-6xl',
      '3xl': 'text-5xl md:text-6xl lg:text-7xl',
      '4xl': 'text-6xl md:text-7xl lg:text-8xl',
      '5xl': 'text-7xl md:text-8xl lg:text-9xl',
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
