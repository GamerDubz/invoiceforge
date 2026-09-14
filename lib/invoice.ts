export type LineItem = {
  id: string
  description: string
  qty: number
  rate: number
}

export type Invoice = {
  invoiceNo: string
  date: string
  dueDate: string
  fromName: string
  fromEmail: string
  fromAddress: string
  toName: string
  toEmail: string
  toAddress: string
  items: LineItem[]
  notes: string
  taxRate: number
  currency: string
  accentColor: string
}

export const genId = (): string => Math.random().toString(36).slice(2, 8).toUpperCase()

export const CURRENCIES = [
  { code: "USD", symbol: "$" },
  { code: "EUR", symbol: "€" },
  { code: "GBP", symbol: "£" },
  { code: "JPY", symbol: "¥" },
  { code: "CAD", symbol: "C$" },
  { code: "AUD", symbol: "A$" },
] as const

export function formatCurrency(amount: number, currencyCode: string): string {
  const sym = CURRENCIES.find((c) => c.code === currencyCode)?.symbol ?? "$"
  return `${sym}${amount.toFixed(2)}`
}

/**
 * Starting invoice. The invoice number and dates are generated fresh per
 * render call (random id, today's date) — intentionally different between
 * the static export's build-time HTML and the viewer's client render. The
 * fields that carry these values use `suppressHydrationWarning` so React
 * quietly adopts the client's value instead of logging a mismatch.
 */
export function createDefaultInvoice(): Invoice {
  return {
    invoiceNo: `INV-${genId()}`,
    date: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
    fromName: "Your Name",
    fromEmail: "you@example.com",
    fromAddress: "123 Main St\nYour City, ST 00000",
    toName: "Client Name",
    toEmail: "client@example.com",
    toAddress: "456 Client Ave\nClient City, ST 00000",
    items: [
      { id: genId(), description: "Design Services", qty: 10, rate: 150 },
      { id: genId(), description: "Development", qty: 20, rate: 200 },
    ],
    notes: "Payment due within 30 days. Thank you for your business!",
    taxRate: 10,
    currency: "USD",
    accentColor: "#7a2331",
  }
}
