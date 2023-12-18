import { useEffect, useState } from 'react'
import { GetServerSideProps } from 'next'
import { ArrowDown, ArrowUp, MagnifyingGlass, Trash } from 'phosphor-react'

import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Box } from '@/components/ui/Box'
import { Heading } from '@/components/ui/Heading'
import { Text } from '@/components/ui/Text'

import { api } from '@/lib/axios'

import Announcement from '@/@types/announcement'
import clsx from 'clsx'

interface AnnouncementsProps {
  announcements: Announcement[]
}

export default function Home({ announcements }: AnnouncementsProps) {
  const [totalSales, setTotalSales] = useState(0)
  const [totalCost, setTotalCost] = useState(0)
  const [totalProfit, setTotalProfit] = useState(0)
  const [percentageProfit, setPercentageProfit] = useState(0)
  const [totalUnitsSold, setTotalUnitsSold] = useState(0)
  const [averageTicket, setAverageTicket] = useState(0)
  const [totalCancelledSales, setTotalCancelledSales] = useState(0)
  const [cancelledUnits, setCancelledUnits] = useState(0)

  const formatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })

  useEffect(() => {
    function handleCalculateTotals() {
      let sales = 0
      let cost = 0
      let profit = 0
      let unitsSold = 0
      let cancelledSales = 0
      let cancelledUnits = 0

      announcements.forEach((item) => {
        item.orders_detail.forEach((orderDetail) => {
          unitsSold += orderDetail.quantity

          if (orderDetail.is_cancel) {
            cancelledSales += orderDetail.total_value
            cancelledUnits += orderDetail.quantity
          } else {
            sales += orderDetail.total_value

            const shippingPriceAsNumber = parseFloat(orderDetail.shipping_price)
            const saleFeeAsNumber = parseFloat(orderDetail.sale_fee)

            const totalCostOrder =
              orderDetail.total_cost + shippingPriceAsNumber + saleFeeAsNumber

            cost += totalCostOrder

            const profitOrder = orderDetail.total_value - totalCostOrder
            profit += profitOrder
          }
        })
      })

      const averageTicket =
        unitsSold - cancelledUnits !== 0
          ? sales / (unitsSold - cancelledUnits)
          : 0

      setTotalSales(sales)
      setTotalCost(cost)
      setTotalProfit(profit)
      setTotalUnitsSold(unitsSold)
      setAverageTicket(averageTicket)
      setTotalCancelledSales(cancelledSales)
      setCancelledUnits(cancelledUnits)

      const percentageProfit = ((profit / sales) * 100).toFixed(2)
      setPercentageProfit(parseFloat(percentageProfit))
    }

    handleCalculateTotals()
  }, [announcements, averageTicket])

  return (
    <div className="flex min-h-screen flex-col gap-6 p-10">
      <div className="flex items-center gap-4">
        <Input placeholder="Filtrar por nome, SKU ou MBL" />

        <Button icon={MagnifyingGlass} />

        <Button icon={Trash} />
      </div>

      <div className="grid grid-cols-3 items-center justify-between gap-6">
        <Box className="bg-zinc-800">
          <div className="flex w-full flex-col items-start gap-2">
            <div className="flex w-full items-center justify-between">
              <Text size="2xl" className="text-zinc-400">
                Vendas
              </Text>
              <ArrowUp className="h-12 w-12 text-green-500" />
            </div>
            <Heading size="4xl">{formatter.format(totalSales)}</Heading>
          </div>
        </Box>

        <Box className="bg-zinc-800">
          <div className="flex w-full flex-col items-start gap-2">
            <div className="flex w-full items-center justify-between">
              <Text size="2xl" className="text-zinc-400">
                Custos
              </Text>
              <ArrowDown className="h-12 w-12 text-red-500" />
            </div>
            <Heading size="4xl">{formatter.format(totalCost)}</Heading>
          </div>
        </Box>

        <Box
          className={clsx('', {
            'bg-green-600': totalProfit > 0,
            'bg-red-600': totalProfit < 0,
          })}
        >
          <div className="flex w-full flex-col items-start gap-2">
            <div className="flex w-full items-center justify-between">
              <Text size="2xl" className="font-bold text-zinc-50">
                {totalProfit < 0 ? 'Prejuízo' : 'Lucro'}
              </Text>
              {percentageProfit > 0 ? (
                <Text
                  size="lg"
                  className="flex items-center justify-center gap-2 text-zinc-50"
                >
                  {percentageProfit}%
                  <ArrowUp className="h-12 w-12" />
                </Text>
              ) : (
                <Text
                  size="lg"
                  className="flex items-center justify-center gap-2 text-zinc-50"
                >
                  {percentageProfit}%
                  <ArrowDown className="h-12 w-12" />
                </Text>
              )}
            </div>
            <Heading size="4xl">{formatter.format(totalProfit)}</Heading>
          </div>
        </Box>
      </div>

      <div>
        <Text>Unidades vendidas:</Text>
        <Heading>{totalUnitsSold} un.</Heading>
      </div>

      <div>
        <Text>Ticket médio:</Text>
        <Heading>{formatter.format(averageTicket)}</Heading>
      </div>

      <div>
        <Text>Vendas canceladas:</Text>
        <Heading>{formatter.format(totalCancelledSales)}</Heading>
        <Text>Qtde. {cancelledUnits} un.</Text>
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const response = await api.get('/announcements')
    const announcements = response.data

    return {
      props: {
        announcements,
      },
    }
  } catch (error) {
    console.error('Error fetching data: ', error)
    return {
      props: {
        announcements: null,
      },
    }
  }
}
