import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const boxVariants = cva('flex gap-4 p-6 rounded-lg border border-zinc-700')

interface BoxProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof boxVariants> {
  as?: React.ElementType
}

const Box = React.forwardRef<HTMLDivElement, BoxProps>(
  ({ as, className, ...props }, ref) => {
    const Component = as || 'div'

    return (
      <Component
        ref={ref}
        className={cn(boxVariants({ className }), className)}
        {...props}
      />
    )
  },
)

Box.displayName = 'Box'

export { Box }
