import clsx from 'clsx'

import { Box } from '@/components/ui/Box'
import { Heading } from '@/components/ui/Heading'
import { Text } from '@/components/ui/Text'

import { formatCurrency } from '@/utils/format-currency'
import { ArrowUp, ArrowDown } from 'phosphor-react'

interface CardSummaryProps {
  title: string
  value: number
  type?: 'sales' | 'cost' | 'profit'
  icon?: React.ElementType
  percentageProfit?: number
}

export function CardSummary({
  title,
  value,
  type,
  icon: Icon = () => null,
  percentageProfit,
}: CardSummaryProps) {
  return (
    <Box
      className={clsx('', {
        'bg-zinc-800': type === 'sales' || type === 'cost',
        'bg-green-600': type === 'profit' && value > 0,
        'bg-red-600': type === 'profit' && value < 0,
      })}
    >
      <div className="flex w-full flex-col items-start gap-4">
        <div className="flex w-full items-center justify-between">
          <Text
            size="lg"
            className={clsx('text-zinc-400', {
              'text-zinc-50': type === 'profit',
            })}
          >
            {title}
          </Text>
          {type === 'profit' && percentageProfit !== undefined && (
            <Text
              size="sm"
              className="flex items-center justify-center gap-2 text-zinc-50"
            >
              {percentageProfit}%
              {percentageProfit > 0 ? (
                <ArrowUp className="h-6 w-6 md:h-9 md:w-9 lg:h-12 lg:w-12" />
              ) : (
                <ArrowDown className="h-6 w-6 md:h-9 md:w-9 lg:h-12 lg:w-12" />
              )}
            </Text>
          )}
          <Icon
            className={clsx('h-6 w-6 md:h-9 md:w-9 lg:h-12 lg:w-12', {
              'text-green-500': type === 'sales',
              'text-red-500': type === 'cost',
              'text-zinc-50': type === 'profit',
            })}
          />
        </div>
        <Heading size="2xl">{formatCurrency(value)}</Heading>
      </div>
    </Box>
  )
}
