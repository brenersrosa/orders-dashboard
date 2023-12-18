interface OrderDetail {
  order_id: string
  sku: string
  name: string
  date: string
  logistic_type: string
  value: string
  quantity: number
  total_value: number
  sale_fee: string
  shipping_price: string
  shipping_payed: string
  shipping_discount: number
  cost: number
  total_cost: number
  tax: number
  income: number
  tax_percentage: number
  profit_value: number
  profit_sale: number
  profit_item: number
  is_cancel: boolean
}

interface OrderGroup {
  order_id: string
  sku: string
  name: string
  value: string
  quantity: number
  total_value: number
  sale_fee: string
  shipping_price: string
  shipping_payed: string
  shipping_discount: number
  cost: number
  total_cost: number
  tax: number
  income: number
  tax_percentage: number
  profit_value: number
  profit_sale: number
  profit_item: number
}

interface Announcement {
  ads_id: string
  name: string
  sku: string
  modality: string
  value: string
  quantity: number
  total_value: number
  sale_fee: string
  shipping_price: string
  shipping_payed: string
  shipping_discount: number
  cost: number
  total_cost: number
  tax: number
  income: number
  profit_value: number
  profit_sale: number
  profit_item: number
  is_registered: boolean
  orders_detail: OrderDetail[]
  orders_group: OrderGroup[]
}

export default Announcement
