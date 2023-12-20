export function formatCurrency(value: number) {
  const formatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })

  const numberFormatted = formatter.format(value)

  return numberFormatted
}
