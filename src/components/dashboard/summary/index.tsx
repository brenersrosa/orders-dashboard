import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ArrowDown, ArrowUp } from 'phosphor-react'

import { CardSummary } from './card'
import { Heading } from '@/components/ui/Heading'
import { Text } from '@/components/ui/Text'

import { api } from '@/lib/axios'

import Announcement from '@/@types/announcement'
import { formatCurrency } from '@/utils/format-currency'

export function Summary() {
  const [totalSales, setTotalSales] = useState(0)
  const [totalCost, setTotalCost] = useState(0)
  const [totalProfit, setTotalProfit] = useState(0)
  const [percentageProfit, setPercentageProfit] = useState(0)
  const [totalUnitsSold, setTotalUnitsSold] = useState(0)
  const [averageTicket, setAverageTicket] = useState(0)
  const [totalCancelledSales, setTotalCancelledSales] = useState(0)
  const [cancelledUnits, setCancelledUnits] = useState(0)

  const { data: announcements } = useQuery<Announcement[]>({
    queryKey: ['announcements'],
    queryFn: async () => {
      const response = await api.get('/announcements')
      return response.data
    },
  })

  useEffect(() => {
    function handleCalculateTotals() {
      let sales = 0
      let cost = 0
      let profit = 0
      let unitsSold = 0
      let cancelledSales = 0
      let cancelledUnits = 0

      announcements?.forEach((item) => {
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
    <>
      <div className="grid grid-cols-3 items-center justify-between gap-6">
        <CardSummary
          title="Vendas"
          value={totalSales}
          type="sales"
          icon={ArrowUp}
        />

        <CardSummary
          title="Custos"
          value={totalCost}
          type="cost"
          icon={ArrowDown}
        />

        <CardSummary
          title="Lucro"
          value={totalProfit}
          type="profit"
          percentageProfit={percentageProfit}
        />
      </div>

      <div className="flex gap-8">
        <div>
          <Text>Unidades vendidas:</Text>
          <Heading>{totalUnitsSold} un.</Heading>
        </div>

        <div>
          <Text>Ticket médio:</Text>
          <Heading>{formatCurrency(averageTicket)}</Heading>
        </div>

        <div>
          <Text>Vendas canceladas:</Text>
          <Heading>{formatCurrency(totalCancelledSales)}</Heading>
          <Text>Qtde. {cancelledUnits} un.</Text>
        </div>
      </div>
    </>
  )
}
