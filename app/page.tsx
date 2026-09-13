'use client'

import { useState, useCallback, useRef } from 'react'

type LineItem = { id: string; description: string; qty: number; rate: number }
type Invoice = {
  invoiceNo: string; date: string; dueDate: string
  fromName: string; fromEmail: string; fromAddress: string
  toName: string; toEmail: string; toAddress: string
  items: LineItem[]; notes: string; taxRate: number; currency: string
  accentColor: string
}

const genId = () => Math.random().toString(36).slice(2, 8).toUpperCase()

const CURRENCIES = [
  { code: 'USD', symbol: '$' }, { code: 'EUR', symbol: '€' }, { code: 'GBP', symbol: '£' },
  { code: 'JPY', symbol: '¥' }, { code: 'CAD', symbol: 'C$' }, { code: 'AUD', symbol: 'A$' },
]

function formatCurrency(amount: number, currencyCode: string): string {
  const sym = CURRENCIES.find((c) => c.code === currencyCode)?.symbol ?? '$'
  return `${sym}${amount.toFixed(2)}`
}

const DEFAULT: Invoice = {
  invoiceNo: `INV-${genId()}`, date: new Date().toISOString().split('T')[0],
  dueDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
  fromName: 'Your Name', fromEmail: 'you@example.com', fromAddress: '123 Main St\nYour City, ST 00000',
  toName: 'Client Name', toEmail: 'client@example.com', toAddress: '456 Client Ave\nClient City, ST 00000',
  items: [
    { id: genId(), description: 'Design Services', qty: 10, rate: 150 },
    { id: genId(), description: 'Development', qty: 20, rate: 200 },
  ],
  notes: 'Payment due within 30 days. Thank you for your business!',
  taxRate: 10, currency: 'USD', accentColor: '#3b82f6',
}

export default function InvoiceForgePage() {
  const [inv, setInv] = useState<Invoice>(DEFAULT)
  const [preview, setPreview] = useState(false)
  const printRef = useRef<HTMLDivElement>(null)

  const update = (patch: Partial<Invoice>) => setInv((i) => ({ ...i, ...patch }))
  const updateItem = (id: string, patch: Partial<LineItem>) => update({ items: inv.items.map((item) => item.id === id ? { ...item, ...patch } : item) })
  const addItem = () => update({ items: [...inv.items, { id: genId(), description: 'Service', qty: 1, rate: 100 }] })
  const removeItem = (id: string) => update({ items: inv.items.filter((i) => i.id !== id) })

  const subtotal = inv.items.reduce((s, i) => s + i.qty * i.rate, 0)
  const tax = subtotal * (inv.taxRate / 100)
  const total = subtotal + tax

  const handlePrint = useCallback(() => {
    window.print()
  }, [])

  const Field = ({ label, value, onChange, multi = false, placeholder = '' }: { label: string; value: string; onChange: (v: string) => void; multi?: boolean; placeholder?: string }) => (
    <div>
      <label className="block text-xs text-neutral-500 mb-1">{label}</label>
      {multi ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} className="w-full bg-[#1a1a1a] border border-[#2e2e2e] rounded px-2.5 py-1.5 text-sm text-neutral-200 resize-none outline-none focus:border-blue-500" placeholder={placeholder} aria-label={label} />
      ) : (
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-[#1a1a1a] border border-[#2e2e2e] rounded px-2.5 py-1.5 text-sm text-neutral-200 outline-none focus:border-blue-500" placeholder={placeholder} aria-label={label} />
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-neutral-100 print:bg-white print:text-black">
      {/* Header (hidden when printing) */}
      <header className="px-6 py-4 border-b border-[#1e1e1e] flex items-center justify-between print:hidden">
        <h1 className="font-bold text-lg">InvoiceForge</h1>
        <div className="flex gap-3">
          <button onClick={handlePrint} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded transition-colors">Print / Save PDF</button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6 grid lg:grid-cols-5 gap-8 print:block print:p-0">
        {/* Editor */}
        <div className="lg:col-span-2 space-y-5 print:hidden">
          <div className="bg-[#1a1a1a] border border-[#2e2e2e] rounded-xl p-5 space-y-3">
            <h2 className="text-sm font-semibold text-neutral-300">Invoice Details</h2>
            <Field label="Invoice #" value={inv.invoiceNo} onChange={(v) => update({ invoiceNo: v })} />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Issue Date" value={inv.date} onChange={(v) => update({ date: v })} />
              <Field label="Due Date" value={inv.dueDate} onChange={(v) => update({ dueDate: v })} />
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-xs text-neutral-500 mb-1">Currency</label>
                <select value={inv.currency} onChange={(e) => update({ currency: e.target.value })} className="w-full bg-[#1a1a1a] border border-[#2e2e2e] rounded px-2 py-1.5 text-sm text-neutral-200 outline-none" aria-label="Currency">
                  {CURRENCIES.map((c) => <option key={c.code} value={c.code}>{c.code}</option>)}
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-xs text-neutral-500 mb-1">Tax Rate (%)</label>
                <input type="number" min={0} max={100} value={inv.taxRate} onChange={(e) => update({ taxRate: Number(e.target.value) })} className="w-full bg-[#1a1a1a] border border-[#2e2e2e] rounded px-2 py-1.5 text-sm text-neutral-200 outline-none" aria-label="Tax rate" />
              </div>
              <div>
                <label className="block text-xs text-neutral-500 mb-1">Color</label>
                <input type="color" value={inv.accentColor} onChange={(e) => update({ accentColor: e.target.value })} className="w-full h-9 rounded border border-[#333] bg-transparent cursor-pointer" aria-label="Accent color" />
              </div>
            </div>
          </div>

          <div className="bg-[#1a1a1a] border border-[#2e2e2e] rounded-xl p-5 space-y-3">
            <h2 className="text-sm font-semibold text-neutral-300">From</h2>
            <Field label="Name / Company" value={inv.fromName} onChange={(v) => update({ fromName: v })} />
            <Field label="Email" value={inv.fromEmail} onChange={(v) => update({ fromEmail: v })} />
            <Field label="Address" value={inv.fromAddress} onChange={(v) => update({ fromAddress: v })} multi />
          </div>

          <div className="bg-[#1a1a1a] border border-[#2e2e2e] rounded-xl p-5 space-y-3">
            <h2 className="text-sm font-semibold text-neutral-300">Bill To</h2>
            <Field label="Name / Company" value={inv.toName} onChange={(v) => update({ toName: v })} />
            <Field label="Email" value={inv.toEmail} onChange={(v) => update({ toEmail: v })} />
            <Field label="Address" value={inv.toAddress} onChange={(v) => update({ toAddress: v })} multi />
          </div>

          <div className="bg-[#1a1a1a] border border-[#2e2e2e] rounded-xl p-5 space-y-3">
            <h2 className="text-sm font-semibold text-neutral-300">Notes</h2>
            <Field label="" value={inv.notes} onChange={(v) => update({ notes: v })} multi placeholder="Payment terms, bank details, etc…" />
          </div>
        </div>

        {/* Preview */}
        <div className="lg:col-span-3 print:w-full" ref={printRef}>
          <div className="bg-white text-gray-900 rounded-xl shadow-2xl print:shadow-none print:rounded-none overflow-hidden">
            {/* Invoice top bar */}
            <div className="px-10 py-8" style={{ borderTop: `4px solid ${inv.accentColor}` }}>
              <div className="flex justify-between items-start mb-8">
                <div>
                  <div className="text-3xl font-black tracking-tight" style={{ color: inv.accentColor }}>INVOICE</div>
                  <div className="text-sm text-gray-500 mt-1">#{inv.invoiceNo}</div>
                </div>
                <div className="text-right text-sm text-gray-600">
                  <div><span className="text-gray-400">Date: </span>{inv.date}</div>
                  <div><span className="text-gray-400">Due: </span>{inv.dueDate}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                  <div className="text-xs uppercase tracking-wider text-gray-400 mb-2">From</div>
                  <div className="font-semibold text-gray-800">{inv.fromName}</div>
                  <div className="text-sm text-gray-600">{inv.fromEmail}</div>
                  <div className="text-sm text-gray-600 whitespace-pre-line">{inv.fromAddress}</div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-gray-400 mb-2">Bill To</div>
                  <div className="font-semibold text-gray-800">{inv.toName}</div>
                  <div className="text-sm text-gray-600">{inv.toEmail}</div>
                  <div className="text-sm text-gray-600 whitespace-pre-line">{inv.toAddress}</div>
                </div>
              </div>

              {/* Items table */}
              <table className="w-full mb-6 text-sm">
                <thead>
                  <tr style={{ background: inv.accentColor + '15' }}>
                    <th className="py-3 px-4 text-left text-gray-600 font-semibold">Description</th>
                    <th className="py-3 px-4 text-right text-gray-600 font-semibold">Qty</th>
                    <th className="py-3 px-4 text-right text-gray-600 font-semibold">Rate</th>
                    <th className="py-3 px-4 text-right text-gray-600 font-semibold">Amount</th>
                    <th className="print:hidden py-3 px-2 w-8" />
                  </tr>
                </thead>
                <tbody>
                  {inv.items.map((item) => (
                    <tr key={item.id} className="border-b border-gray-100 print:border-gray-200">
                      <td className="py-3 px-4">
                        <input type="text" value={item.description} onChange={(e) => updateItem(item.id, { description: e.target.value })} className="w-full bg-transparent outline-none focus:bg-gray-50 rounded px-1 print:pointer-events-none" aria-label="Item description" />
                      </td>
                      <td className="py-3 px-4 text-right">
                        <input type="number" value={item.qty} onChange={(e) => updateItem(item.id, { qty: Number(e.target.value) })} className="w-16 text-right bg-transparent outline-none focus:bg-gray-50 rounded px-1 print:pointer-events-none" aria-label="Quantity" />
                      </td>
                      <td className="py-3 px-4 text-right">
                        <input type="number" value={item.rate} onChange={(e) => updateItem(item.id, { rate: Number(e.target.value) })} className="w-24 text-right bg-transparent outline-none focus:bg-gray-50 rounded px-1 print:pointer-events-none" aria-label="Rate" />
                      </td>
                      <td className="py-3 px-4 text-right font-medium tabular-nums">{formatCurrency(item.qty * item.rate, inv.currency)}</td>
                      <td className="py-3 px-2 print:hidden">
                        <button onClick={() => removeItem(item.id)} className="text-gray-300 hover:text-red-400 transition-colors" aria-label="Remove item">×</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <button onClick={addItem} className="text-sm px-4 py-2 border border-dashed rounded text-gray-400 hover:text-gray-600 mb-6 print:hidden" style={{ borderColor: inv.accentColor + '60', color: inv.accentColor }}>
                + Add item
              </button>

              {/* Totals */}
              <div className="flex justify-end">
                <div className="w-60 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="tabular-nums">{formatCurrency(subtotal, inv.currency)}</span>
                  </div>
                  {inv.taxRate > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Tax ({inv.taxRate}%)</span>
                      <span className="tabular-nums">{formatCurrency(tax, inv.currency)}</span>
                    </div>
                  )}
                  <div className="border-t pt-2 flex justify-between font-bold text-base" style={{ borderColor: inv.accentColor }}>
                    <span>Total</span>
                    <span className="tabular-nums" style={{ color: inv.accentColor }}>{formatCurrency(total, inv.currency)}</span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {inv.notes && (
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <div className="text-xs uppercase tracking-wider text-gray-400 mb-2">Notes</div>
                  <p className="text-sm text-gray-600 whitespace-pre-line">{inv.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
