import { useState } from 'react'
import clsx from 'clsx'
import dayjs from 'dayjs'

import { Button } from '@/components/ui/Button'
import { Heading } from '@/components/ui/Heading'
import { Text } from '@/components/ui/Text'

import { formatCurrency } from '@/utils/format-currency'

import Announcement from '@/@types/announcement'

interface TableDashboardProps {
  announcements: Announcement[]
}

type ModeState = {
  [adsId: string]: 'group' | 'detail' | null
}

export function TableDashboard({ announcements }: TableDashboardProps) {
  const [mode, setMode] = useState<ModeState>()

  function handleToggleMode(adsId: string, currentMode: ModeState[string]) {
    setMode((prevMode = {}) => ({
      ...prevMode,
      [adsId]: currentMode === prevMode[adsId] ? null : currentMode,
    }))
  }
  return (
    <div className="max-h-[540px] overflow-auto border border-zinc-600">
      <table className="w-full min-w-[620px] table-auto border-collapse">
        <thead className="sticky top-0 bg-zinc-700">
          <tr className="bg-zinc-600">
            <th className="w-96 p-4 text-left text-sm leading-relaxed text-zinc-200">
              Anúncio
            </th>
            <th className="w-56 p-4 text-left text-sm leading-relaxed text-zinc-200">
              Vendas
            </th>
            <th className="w-56 p-4 text-left text-sm leading-relaxed text-zinc-200">
              Descontos
            </th>
            <th className="w-72 p-4 text-left text-sm leading-relaxed text-zinc-200">
              Custo
            </th>
            <th className="w-52 text-left text-sm leading-relaxed text-zinc-200">
              Imposto
            </th>
            <th className="w-52 text-left text-sm leading-relaxed text-zinc-200">
              Receita
            </th>
            <th className="w-52 text-left text-sm leading-relaxed text-zinc-200">
              Lucro (R$)
            </th>
            <th className="w-52 p-4 text-left text-sm leading-relaxed text-zinc-200">
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
                          {formatCurrency(Number(announcement.value))}
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
                    <Text>{formatCurrency(totalSales)}</Text>
                  </td>
                  <td className="p-4 text-left text-sm leading-relaxed text-zinc-200">
                    <div className="flex items-center gap-2">
                      <Text>Tarifa: {formatCurrency(saleFee)}</Text>
                    </div>
                    <div className="flex items-center gap-2">
                      <Text>Frete Pago: {formatCurrency(shippingPay)}</Text>
                    </div>
                    <div className="flex items-center gap-2">
                      <Text>
                        Frete Desc: {formatCurrency(shippingDiscount)}
                      </Text>
                    </div>
                  </td>
                  <td className="p-4 text-left text-sm leading-relaxed text-zinc-200">
                    <div className="flex items-center gap-2">
                      <Text>Custo Unitário: {formatCurrency(unitaryCost)}</Text>
                    </div>
                    <div className="flex items-center gap-2">
                      <Text>Custo Total: {formatCurrency(totalCost)}</Text>
                    </div>
                  </td>
                  <td className="p-4 text-left text-sm leading-relaxed text-zinc-200">
                    <div className="flex items-center gap-2">
                      <Text>{formatCurrency(tax)}</Text>
                    </div>
                  </td>
                  <td className="p-4 text-left text-sm leading-relaxed text-zinc-200">
                    <div className="flex items-center gap-2">
                      <Text>{formatCurrency(revenue)}</Text>
                    </div>
                  </td>
                  <td className="p-4 text-left text-sm leading-relaxed text-zinc-200">
                    <div className="flex items-center gap-2">
                      <Text
                        className={clsx('font-bold', {
                          'text-green-400': profit > 0,
                          'text-red-400': profit < 0,
                        })}
                      >
                        {formatCurrency(profit)}
                      </Text>
                    </div>
                  </td>
                  <td className="p-4 text-left text-sm leading-relaxed text-zinc-200">
                    <div className="flex items-center gap-2">
                      <Text
                        className={clsx('font-bold', {
                          'text-green-400': Number(mc) > 0,
                          'text-red-400': Number(mc) < 0,
                        })}
                      >
                        MC: {mc}%
                      </Text>
                    </div>

                    <div className="flex items-center gap-2">
                      <Text
                        className={clsx('font-bold', {
                          'text-green-400': Number(roi) > 0,
                          'text-red-400': Number(roi) < 0,
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
                      const roi = ((profit / (totalCost + tax)) * 100).toFixed(
                        1,
                      )

                      return (
                        <tr key={order.order_id} className="bg-zinc-900">
                          <td className="flex w-96 flex-col p-4 text-left">
                            <div className="flex flex-col items-start gap-2"></div>
                          </td>
                          <td className="p-4 text-left text-sm leading-relaxed text-zinc-200">
                            <Text>
                              Valor: {formatCurrency(parseFloat(order.value))}
                            </Text>
                            <Text>Qtde: {order.quantity}</Text>
                            <Text>
                              Total: {formatCurrency(order.total_value)}
                            </Text>
                          </td>
                          <td className="p-4 text-left text-sm leading-relaxed text-zinc-200">
                            <Text>
                              Tarifa: {formatCurrency(Number(saleFee))}
                            </Text>
                            <Text>
                              Frete pago: {formatCurrency(Number(shippingPay))}
                            </Text>
                            <Text>
                              Frete desc: {formatCurrency(shippingDiscount)}
                            </Text>
                          </td>
                          <td className="p-4 text-left text-sm leading-relaxed text-zinc-200">
                            <Text>Unitário: {formatCurrency(unitaryCost)}</Text>
                            <Text>Total: {formatCurrency(totalCost)}</Text>
                          </td>
                          <td className="p-4 text-left text-sm leading-relaxed text-zinc-200">
                            <Text>{formatCurrency(tax)}</Text>
                          </td>
                          <td className="p-4 text-left text-sm leading-relaxed text-zinc-200">
                            <Text>{formatCurrency(revenue)}</Text>
                          </td>
                          <td className="p-4 text-left text-sm leading-relaxed text-zinc-200">
                            <Text
                              className={clsx('font-bold', {
                                'text-green-400': profit > 0,
                                'text-red-400': profit < 0,
                              })}
                            >
                              {formatCurrency(profit)}
                            </Text>
                          </td>
                          <td className="p-4 text-left text-sm leading-relaxed text-zinc-200">
                            <div className="flex items-center gap-2">
                              <Text
                                className={clsx('font-bold', {
                                  'text-green-400': Number(mc) > 0,
                                  'text-red-400': Number(mc) < 0,
                                })}
                              >
                                MC: {mc}%
                              </Text>
                            </div>

                            <div className="flex items-center gap-2">
                              <Text
                                className={clsx('font-bold', {
                                  'text-green-400': Number(mc) > 0,
                                  'text-red-400': Number(mc) < 0,
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
                                  Data: {dayjs(order.date).format('DD/MM/YYYY')}
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
                                Valor: {formatCurrency(parseFloat(order.value))}
                              </Text>
                              <Text>Qtde: {order.quantity}</Text>
                              <Text>
                                Total: {formatCurrency(order.total_value)}
                              </Text>
                            </td>
                            <td className="p-4 text-left text-sm leading-relaxed text-zinc-200">
                              <Text>
                                Tarifa: {formatCurrency(Number(saleFee))}
                              </Text>
                              <Text>
                                Frete pago:{' '}
                                {formatCurrency(Number(shippingPay))}
                              </Text>
                              <Text>
                                Frete desc: {formatCurrency(shippingDiscount)}
                              </Text>
                            </td>
                            <td className="p-4 text-left text-sm leading-relaxed text-zinc-200">
                              <Text>
                                Unitário: {formatCurrency(unitaryCost)}
                              </Text>
                              <Text>Total: {formatCurrency(totalCost)}</Text>
                            </td>
                            <td className="p-4 text-left text-sm leading-relaxed text-zinc-200">
                              <Text>{formatCurrency(tax)}</Text>
                            </td>
                            <td className="p-4 text-left text-sm leading-relaxed text-zinc-200">
                              <Text>{formatCurrency(revenue)}</Text>
                            </td>
                            <td className="p-4 text-left text-sm leading-relaxed text-zinc-200">
                              <Text
                                className={clsx('font-bold', {
                                  'text-green-400': profit > 0,
                                  'text-red-400': profit < 0,
                                })}
                              >
                                {formatCurrency(profit)}
                              </Text>
                            </td>
                            <td className="p-4 text-left text-sm leading-relaxed text-zinc-200">
                              <div className="flex items-center gap-2">
                                <Text
                                  className={clsx('font-bold', {
                                    'text-green-400': Number(mc) > 0,
                                    'text-red-400': Number(mc) < 0,
                                  })}
                                >
                                  MC: {mc}%
                                </Text>
                              </div>

                              <div className="flex items-center gap-2">
                                <Text
                                  className={clsx('font-bold', {
                                    'text-green-400': Number(roi) > 0,
                                    'text-red-400': Number(roi) < 0,
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
  )
}
