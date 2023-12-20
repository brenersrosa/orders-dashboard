import { useEffect, useState } from 'react'
import { GetServerSideProps } from 'next'
import { ArrowDown, ArrowUp, MagnifyingGlass, Trash } from 'phosphor-react'
import clsx from 'clsx'
import dayjs from 'dayjs'

import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Box } from '@/components/ui/Box'
import { Heading } from '@/components/ui/Heading'
import { Text } from '@/components/ui/Text'

import { api } from '@/lib/axios'

import Announcement from '@/@types/announcement'

interface AnnouncementsProps {
  announcements: Announcement[]
}

type ModeState = {
  [adsId: string]: 'group' | 'detail' | null
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
  const [mode, setMode] = useState<ModeState>()

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

  function handleToggleMode(adsId: string, currentMode: ModeState[string]) {
    setMode((prevMode = {}) => ({
      ...prevMode,
      [adsId]: currentMode === prevMode[adsId] ? null : currentMode,
    }))
  }

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

      <div className="flex gap-8">
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

      <div className="max-h-[540px] overflow-auto border border-zinc-600">
        <table className="w-full min-w-[620px] table-auto border-collapse">
          <thead className="sticky top-0 bg-zinc-700">
            <tr className="bg-zinc-600">
              <th className="w-96 p-4 text-left text-sm leading-relaxed text-zinc-200">
                Anúncio
              </th>
              <th className="p-4 text-left text-sm leading-relaxed text-zinc-200">
                Vendas
              </th>
              <th className="p-4 text-left text-sm leading-relaxed text-zinc-200">
                Descontos
              </th>
              <th className="p-4 text-left text-sm leading-relaxed text-zinc-200">
                Custo
              </th>
              <th className="p-4 text-left text-sm leading-relaxed text-zinc-200">
                Imposto
              </th>
              <th className="p-4 text-left text-sm leading-relaxed text-zinc-200">
                Receita
              </th>
              <th className="p-4 text-left text-sm leading-relaxed text-zinc-200">
                Lucro (R$)
              </th>
              <th className="p-4 text-left text-sm leading-relaxed text-zinc-200">
                Margem
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-600">
            {announcements.map((announcement) => {
              const totalSales = announcement.total_value

              const saleFee = announcement.orders_detail.reduce(
                (acc, orderDetail) =>
                  acc +
                  (orderDetail.is_cancel ? 0 : Number(orderDetail.sale_fee)),
                0,
              )

              const shippingPay = announcement.orders_detail.reduce(
                (acc, orderDetail) =>
                  acc +
                  (orderDetail.is_cancel
                    ? 0
                    : Number(orderDetail.shipping_payed)),
                0,
              )

              const shippingDiscount = announcement.orders_detail.reduce(
                (acc, orderDetail) =>
                  acc +
                  (orderDetail.is_cancel
                    ? 0
                    : Number(orderDetail.shipping_discount)),
                0,
              )

              const unitaryCost = announcement.orders_detail.reduce(
                (acc, orderDetail) =>
                  acc +
                  (orderDetail.is_cancel
                    ? 0
                    : (parseFloat(orderDetail.sale_fee) +
                        orderDetail.shipping_discount) /
                      announcement.quantity),
                0,
              )

              const totalCost = announcement.orders_detail.reduce(
                (acc, orderDetail) =>
                  acc +
                  (orderDetail.is_cancel
                    ? 0
                    : parseFloat(orderDetail.sale_fee) +
                      orderDetail.shipping_discount),
                0,
              )

              const tax = announcement.orders_detail.reduce(
                (acc, orderDetail) =>
                  acc +
                  (orderDetail.is_cancel
                    ? 0
                    : (orderDetail.tax_percentage / 100) *
                      orderDetail.total_value),
                0,
              )

              const revenue = announcement.orders_detail.reduce(
                (acc, orderDetail) =>
                  acc +
                  (orderDetail.is_cancel ? 0 : Number(orderDetail.total_value)),
                0,
              )

              const profit = announcement.orders_detail.reduce(
                (acc, orderDetail) => {
                  const totalValue = Number(orderDetail.total_value)
                  const totalCost =
                    Number(orderDetail.sale_fee) +
                    Number(orderDetail.shipping_price) -
                    Number(orderDetail.shipping_payed) +
                    Number((orderDetail.tax_percentage / 100) * totalValue)

                  return (
                    acc + (orderDetail.is_cancel ? 0 : totalValue - totalCost)
                  )
                },
                0,
              )

              const mc = ((profit / revenue) * 100).toFixed(1)
              const roi = ((profit / (totalCost + tax)) * 100).toFixed(1)

              return (
                <>
                  <tr key={announcement.ads_id}>
                    <td className="flex w-96 flex-col p-4 text-left">
                      <div className="flex flex-col items-start gap-2">
                        <Heading className="text-left">
                          {announcement.name}
                        </Heading>
                        <div className="flex items-center gap-2 divide-x divide-zinc-400">
                          <Text>{announcement.ads_id}</Text>

                          <Text className="pl-2">
                            {formatter.format(Number(announcement.value))}
                          </Text>
                        </div>

                        <Text>{announcement.sku}</Text>

                        <div className="flex items-center gap-4">
                          <Button
                            onClick={() =>
                              handleToggleMode(announcement.ads_id, 'group')
                            }
                            className={clsx('', {
                              'bg-opacity-50': mode
                                ? mode[announcement.ads_id] === 'group'
                                : '',
                            })}
                          >
                            Agrupado
                          </Button>
                          <Button
                            onClick={() =>
                              handleToggleMode(announcement.ads_id, 'detail')
                            }
                            className={clsx('', {
                              'bg-opacity-50': mode
                                ? mode[announcement.ads_id] === 'detail'
                                : '',
                            })}
                          >
                            Detalhado
                          </Button>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-left text-sm leading-relaxed text-zinc-200">
                      <Text>Total das vendas: {announcement.quantity}</Text>
                      <Text>{formatter.format(totalSales)}</Text>
                    </td>
                    <td className="p-4 text-left text-sm leading-relaxed text-zinc-200">
                      <div className="flex items-center gap-2">
                        <Text>Tarifa: {formatter.format(saleFee)}</Text>
                      </div>
                      <div className="flex items-center gap-2">
                        <Text>Frete Pago: {formatter.format(shippingPay)}</Text>
                      </div>
                      <div className="flex items-center gap-2">
                        <Text>
                          Frete Desc: {formatter.format(shippingDiscount)}
                        </Text>
                      </div>
                    </td>
                    <td className="p-4 text-left text-sm leading-relaxed text-zinc-200">
                      <div className="flex items-center gap-2">
                        <Text>
                          Custo Unitário: {formatter.format(unitaryCost)}
                        </Text>
                      </div>
                      <div className="flex items-center gap-2">
                        <Text>Custo Total: {formatter.format(totalCost)}</Text>
                      </div>
                    </td>
                    <td className="p-4 text-left text-sm leading-relaxed text-zinc-200">
                      <div className="flex items-center gap-2">
                        <Text>{formatter.format(tax)}</Text>
                      </div>
                    </td>
                    <td className="p-4 text-left text-sm leading-relaxed text-zinc-200">
                      <div className="flex items-center gap-2">
                        <Text>{formatter.format(revenue)}</Text>
                      </div>
                    </td>
                    <td className="p-4 text-left text-sm leading-relaxed text-zinc-200">
                      <div className="flex items-center gap-2">
                        <Text
                          className={clsx('font-bold', {
                            'text-green-600': profit > 0,
                            'text-red-600': profit < 0,
                          })}
                        >
                          {formatter.format(profit)}
                        </Text>
                      </div>
                    </td>
                    <td className="p-4 text-left text-sm leading-relaxed text-zinc-200">
                      <div className="flex items-center gap-2">
                        <Text
                          className={clsx('font-bold', {
                            'text-green-600': Number(mc) > 0,
                            'text-red-600': Number(mc) < 0,
                          })}
                        >
                          MC: {mc}%
                        </Text>
                      </div>

                      <div className="flex items-center gap-2">
                        <Text
                          className={clsx('font-bold', {
                            'text-green-600': Number(roi) > 0,
                            'text-red-600': Number(roi) < 0,
                          })}
                        >
                          ROI: {roi}%
                        </Text>
                      </div>
                    </td>
                  </tr>
                  {mode && mode[announcement.ads_id] === 'group'
                    ? announcement.orders_group.map((order) => {
                        const totalSales = order.total_value

                        const saleFee = order.sale_fee

                        const shippingPay = order.shipping_payed

                        const shippingDiscount = order.shipping_discount

                        const totalCost =
                          Number(order.sale_fee) + order.shipping_discount

                        const unitaryCost = totalCost / order.quantity

                        const tax =
                          order.tax_percentage > 0
                            ? (order.tax_percentage / 100) * order.total_value
                            : 0

                        const revenue = order.total_value

                        const profit = totalSales - totalCost

                        const mc = ((profit / revenue) * 100).toFixed(1)
                        const roi = (
                          (profit / (totalCost + tax)) *
                          100
                        ).toFixed(1)

                        return (
                          <tr key={order.order_id} className="bg-zinc-900">
                            <td className="flex w-96 flex-col p-4 text-left">
                              <div className="flex flex-col items-start gap-2"></div>
                            </td>
                            <td className="p-4 text-left text-sm leading-relaxed text-zinc-200">
                              <Text>
                                Valor:{' '}
                                {formatter.format(parseFloat(order.value))}
                              </Text>
                              <Text>Qtde: {order.quantity}</Text>
                              <Text>
                                Total: {formatter.format(order.total_value)}
                              </Text>
                            </td>
                            <td className="p-4 text-left text-sm leading-relaxed text-zinc-200">
                              <Text>
                                Tarifa: {formatter.format(Number(saleFee))}
                              </Text>
                              <Text>
                                Frete pago:{' '}
                                {formatter.format(Number(shippingPay))}
                              </Text>
                              <Text>
                                Frete desc: {formatter.format(shippingDiscount)}
                              </Text>
                            </td>
                            <td className="p-4 text-left text-sm leading-relaxed text-zinc-200">
                              <Text>
                                Unitário: {formatter.format(unitaryCost)}
                              </Text>
                              <Text>Total: {formatter.format(totalCost)}</Text>
                            </td>
                            <td className="p-4 text-left text-sm leading-relaxed text-zinc-200">
                              <Text>{formatter.format(tax)}</Text>
                            </td>
                            <td className="p-4 text-left text-sm leading-relaxed text-zinc-200">
                              <Text>{formatter.format(revenue)}</Text>
                            </td>
                            <td className="p-4 text-left text-sm leading-relaxed text-zinc-200">
                              <Text
                                className={clsx('font-bold', {
                                  'text-green-600': profit > 0,
                                  'text-red-600': profit < 0,
                                })}
                              >
                                {formatter.format(profit)}
                              </Text>
                            </td>
                            <td className="p-4 text-left text-sm leading-relaxed text-zinc-200">
                              <div className="flex items-center gap-2">
                                <Text
                                  className={clsx('font-bold', {
                                    'text-green-600': Number(mc) > 0,
                                    'text-red-600': Number(mc) < 0,
                                  })}
                                >
                                  MC: {mc}%
                                </Text>
                              </div>

                              <div className="flex items-center gap-2">
                                <Text
                                  className={clsx('font-bold', {
                                    'text-green-600': Number(mc) > 0,
                                    'text-red-600': Number(mc) < 0,
                                  })}
                                >
                                  ROI: {roi}%
                                </Text>
                              </div>
                            </td>
                          </tr>
                        )
                      })
                    : mode && mode[announcement.ads_id] === 'detail'
                      ? announcement.orders_detail.map((order) => {
                          const totalSales = order.total_value

                          const saleFee = order.sale_fee

                          const shippingPay = order.shipping_payed

                          const shippingDiscount = order.shipping_discount

                          const totalCost =
                            Number(order.sale_fee) + order.shipping_discount

                          const unitaryCost = totalCost / order.quantity

                          const tax =
                            order.tax_percentage > 0
                              ? (order.tax_percentage / 100) * order.total_value
                              : 0

                          const revenue = order.total_value

                          const profit = totalSales - totalCost

                          const mc = ((profit / revenue) * 100).toFixed(1)
                          const roi = (
                            (profit / (totalCost + tax)) *
                            100
                          ).toFixed(1)

                          return (
                            <tr key={order.order_id} className="bg-zinc-900">
                              <td className="flex w-96 flex-col p-4 text-left">
                                <div className="flex flex-col items-start gap-2">
                                  <Text>
                                    Data:{' '}
                                    {dayjs(order.date).format('DD/MM/YYYY')}
                                  </Text>
                                  <Text>N˚ do pedido: {order.order_id}</Text>
                                  <Text>
                                    Forma de envio: {order.logistic_type}
                                  </Text>
                                  <Text>SKU: {order.sku}</Text>
                                </div>
                              </td>
                              <td className="p-4 text-left text-sm leading-relaxed text-zinc-200">
                                <Text>
                                  Valor:{' '}
                                  {formatter.format(parseFloat(order.value))}
                                </Text>
                                <Text>Qtde: {order.quantity}</Text>
                                <Text>
                                  Total: {formatter.format(order.total_value)}
                                </Text>
                              </td>
                              <td className="p-4 text-left text-sm leading-relaxed text-zinc-200">
                                <Text>
                                  Tarifa: {formatter.format(Number(saleFee))}
                                </Text>
                                <Text>
                                  Frete pago:{' '}
                                  {formatter.format(Number(shippingPay))}
                                </Text>
                                <Text>
                                  Frete desc:{' '}
                                  {formatter.format(shippingDiscount)}
                                </Text>
                              </td>
                              <td className="p-4 text-left text-sm leading-relaxed text-zinc-200">
                                <Text>
                                  Unitário: {formatter.format(unitaryCost)}
                                </Text>
                                <Text>
                                  Total: {formatter.format(totalCost)}
                                </Text>
                              </td>
                              <td className="p-4 text-left text-sm leading-relaxed text-zinc-200">
                                <Text>{formatter.format(tax)}</Text>
                              </td>
                              <td className="p-4 text-left text-sm leading-relaxed text-zinc-200">
                                <Text>{formatter.format(revenue)}</Text>
                              </td>
                              <td className="p-4 text-left text-sm leading-relaxed text-zinc-200">
                                <Text
                                  className={clsx('font-bold', {
                                    'text-green-600': profit > 0,
                                    'text-red-600': profit < 0,
                                  })}
                                >
                                  {formatter.format(profit)}
                                </Text>
                              </td>
                              <td className="p-4 text-left text-sm leading-relaxed text-zinc-200">
                                <div className="flex items-center gap-2">
                                  <Text
                                    className={clsx('font-bold', {
                                      'text-green-600': Number(mc) > 0,
                                      'text-red-600': Number(mc) < 0,
                                    })}
                                  >
                                    MC: {mc}%
                                  </Text>
                                </div>

                                <div className="flex items-center gap-2">
                                  <Text
                                    className={clsx('font-bold', {
                                      'text-green-600': Number(roi) > 0,
                                      'text-red-600': Number(roi) < 0,
                                    })}
                                  >
                                    ROI: {roi}%
                                  </Text>
                                </div>
                              </td>
                            </tr>
                          )
                        })
                      : null}
                </>
              )
            })}
          </tbody>
        </table>
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
