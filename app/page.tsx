'use client'

import { useState, useCallback, useRef } from 'react'

type LineItem = {
  id: string
  description: string
  qty: number
  rate: number
}

type InvoiceStatus = 'draft' | 'pending' | 'paid' | 'overdue'

type Invoice = {
  invoiceNo: string
  status: InvoiceStatus
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
  terms: string
  taxRate: number
  discountRate: number
  currency: string
  accentColor: string
}

const genId = () => Math.random().toString(36).slice(2, 8).toUpperCase()

const CURRENCIES = [
  { code: 'USD', symbol: '$', label: 'USD ($)' },
  { code: 'EUR', symbol: '€', label: 'EUR (€)' },
  { code: 'GBP', symbol: '£', label: 'GBP (£)' },
  { code: 'CAD', symbol: 'CA$', label: 'CAD ($)' },
  { code: 'AUD', symbol: 'AU$', label: 'AUD ($)' },
  { code: 'JPY', symbol: '¥', label: 'JPY (¥)' },
  { code: 'ZAR', symbol: 'R', label: 'ZAR (R)' },
  { code: 'INR', symbol: '₹', label: 'INR (₹)' },
]

const ACCENT_PRESETS = [
  { name: 'Sapphire', color: '#2563EB' },
  { name: 'Emerald', color: '#059669' },
  { name: 'Violet', color: '#7C3AED' },
  { name: 'Slate', color: '#334155' },
  { name: 'Rose', color: '#E11D48' },
  { name: 'Amber', color: '#D97706' },
]

function formatCurrency(amount: number, currencyCode: string): string {
  const sym = CURRENCIES.find((c) => c.code === currencyCode)?.symbol ?? '$'
  return `${sym}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

const SAMPLE_FREELANCE: Invoice = {
  invoiceNo: `INV-${genId()}`,
  status: 'pending',
  date: new Date().toISOString().split('T')[0],
  dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
  fromName: 'Studio Vertex Design',
  fromEmail: 'billing@studiovertex.com',
  fromAddress: '742 Evergreen Terrace, Suite 400\nSan Francisco, CA 94107\nTax ID: US-94821039',
  toName: 'Acme Global Ventures, Inc.',
  toEmail: 'accounts.payable@acmeglobal.com',
  toAddress: '100 Innovation Way, Floor 12\nNew York, NY 10001\nAttn: Operations Dept',
  items: [
    { id: genId(), description: 'Brand Identity System & Style Guide', qty: 1, rate: 4200 },
    { id: genId(), description: 'Frontend Web App Architecture & Implementation (Phase 1)', qty: 40, rate: 160 },
    { id: genId(), description: 'Interactive Design System & Component Library', qty: 1, rate: 2800 },
    { id: genId(), description: 'User Experience Auditing & Performance Optimization', qty: 12, rate: 150 },
  ],
  notes: 'Payment is appreciated within 14 days of issue date. Direct wire transfer preferred.',
  terms: 'Late payments subject to a 1.5% monthly finance charge. Thank you for your partnership!',
  taxRate: 8.5,
  discountRate: 0,
  currency: 'USD',
  accentColor: '#2563EB',
}

export default function InvoiceForgePage() {
  const [inv, setInv] = useState<Invoice>(SAMPLE_FREELANCE)

  const update = (patch: Partial<Invoice>) => setInv((i) => ({ ...i, ...patch }))
  const updateItem = (id: string, patch: Partial<LineItem>) =>
    update({ items: inv.items.map((item) => (item.id === id ? { ...item, ...patch } : item)) })
  const addItem = () =>
    update({ items: [...inv.items, { id: genId(), description: 'New Service Item', qty: 1, rate: 100 }] })
  const removeItem = (id: string) => update({ items: inv.items.filter((i) => i.id !== id) })

  const subtotal = inv.items.reduce((s, i) => s + (Number(i.qty) || 0) * (Number(i.rate) || 0), 0)
  const discountAmount = subtotal * ((Number(inv.discountRate) || 0) / 100)
  const taxableAmount = Math.max(0, subtotal - discountAmount)
  const tax = taxableAmount * ((Number(inv.taxRate) || 0) / 100)
  const total = taxableAmount + tax

  const handlePrint = useCallback(() => {
    window.print()
  }, [])

  const resetBlank = () => {
    setInv({
      invoiceNo: `INV-${genId()}`,
      status: 'draft',
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      fromName: '',
      fromEmail: '',
      fromAddress: '',
      toName: '',
      toEmail: '',
      toAddress: '',
      items: [{ id: genId(), description: '', qty: 1, rate: 0 }],
      notes: '',
      terms: '',
      taxRate: 0,
      discountRate: 0,
      currency: 'USD',
      accentColor: '#2563EB',
    })
  }

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 pb-16">
      {/* Control App Bar (Hidden on Print) */}
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-md px-6 py-3.5 no-print shadow-xs">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4">
          {/* Logo & Identity */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 p-0.5 shadow-sm shadow-blue-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold tracking-tight text-slate-900">
                  Invoice<span className="text-blue-600">Forge</span>
                </h1>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  Fintech Grade
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Craft, customize, and export client invoices with real-time tax & math
              </p>
            </div>
          </div>

          {/* Action Tools */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setInv(SAMPLE_FREELANCE)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Load Demo Data
            </button>
            <button
              onClick={resetBlank}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Clear
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-blue-600/20 transition-all hover:scale-[1.02] flex items-center gap-2 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              <span>Export PDF / Print</span>
            </button>
          </div>
        </div>
      </header>

      {/* Settings Ribbon (No-Print) */}
      <div className="max-w-4xl mx-auto px-4 mt-6 no-print">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4 text-xs">
          {/* Status Picker */}
          <div className="flex items-center gap-2">
            <span className="font-medium text-slate-500">Status:</span>
            {(['draft', 'pending', 'paid', 'overdue'] as InvoiceStatus[]).map((st) => {
              const active = inv.status === st
              const colorMap: Record<InvoiceStatus, string> = {
                draft: 'bg-slate-100 text-slate-700 border-slate-300',
                pending: 'bg-amber-50 text-amber-700 border-amber-300',
                paid: 'bg-emerald-50 text-emerald-700 border-emerald-300',
                overdue: 'bg-rose-50 text-rose-700 border-rose-300',
              }
              return (
                <button
                  key={st}
                  onClick={() => update({ status: st })}
                  className={`px-2.5 py-1 rounded-full uppercase text-[10px] font-bold tracking-wider border transition-all cursor-pointer ${
                    active ? `${colorMap[st]} ring-2 ring-blue-500/20` : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {st}
                </button>
              )
            })}
          </div>

          {/* Currency & Color Theme */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="font-medium text-slate-500">Currency:</span>
              <select
                value={inv.currency}
                onChange={(e) => update({ currency: e.target.value })}
                className="bg-slate-50 border border-slate-300 rounded-lg px-2 py-1 text-xs font-medium text-slate-700 outline-none"
              >
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="font-medium text-slate-500">Theme:</span>
              <div className="flex gap-1">
                {ACCENT_PRESETS.map((p) => (
                  <button
                    key={p.name}
                    onClick={() => update({ accentColor: p.color })}
                    title={p.name}
                    style={{ background: p.color }}
                    className={`w-5 h-5 rounded-full transition-transform hover:scale-110 cursor-pointer ${
                      inv.accentColor === p.color ? 'ring-2 ring-offset-2 ring-slate-900' : ''
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Printable Invoice Paper */}
      <main className="max-w-4xl mx-auto px-4 mt-6">
        <div className="invoice-paper bg-white rounded-2xl border border-slate-200/90 shadow-xl shadow-slate-200/50 p-8 sm:p-14 transition-all">
          {/* Top Invoice Header */}
          <div className="flex flex-wrap items-start justify-between gap-6 pb-8 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-sm"
                  style={{ backgroundColor: inv.accentColor }}
                >
                  {inv.fromName ? inv.fromName.charAt(0).toUpperCase() : 'I'}
                </div>
                <input
                  type="text"
                  value={inv.fromName}
                  onChange={(e) => update({ fromName: e.target.value })}
                  placeholder="Your Business Name"
                  className="text-2xl font-bold tracking-tight text-slate-900 border-b border-transparent hover:border-slate-300 focus:border-blue-500 outline-none transition-all"
                />
              </div>
              <textarea
                rows={3}
                value={inv.fromAddress}
                onChange={(e) => update({ fromAddress: e.target.value })}
                placeholder="Your Address, Tax ID, City, State, ZIP"
                className="w-full max-w-sm text-xs text-slate-500 border border-transparent hover:border-slate-200 focus:border-blue-500 rounded-lg p-1.5 outline-none resize-none leading-relaxed transition-all"
              />
            </div>

            <div className="text-right flex flex-col items-end">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl font-black tracking-wider uppercase" style={{ color: inv.accentColor }}>
                  INVOICE
                </span>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                    inv.status === 'paid'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                      : inv.status === 'pending'
                      ? 'bg-amber-50 text-amber-700 border-amber-300'
                      : inv.status === 'overdue'
                      ? 'bg-rose-50 text-rose-700 border-rose-300'
                      : 'bg-slate-100 text-slate-700 border-slate-300'
                  }`}
                >
                  {inv.status}
                </span>
              </div>

              <div className="space-y-1 text-xs">
                <div className="flex items-center justify-end gap-2">
                  <span className="text-slate-400 font-medium">Invoice #</span>
                  <input
                    type="text"
                    value={inv.invoiceNo}
                    onChange={(e) => update({ invoiceNo: e.target.value })}
                    className="font-mono font-bold text-slate-800 text-right w-32 border-b border-transparent hover:border-slate-300 focus:border-blue-500 outline-none"
                  />
                </div>
                <div className="flex items-center justify-end gap-2">
                  <span className="text-slate-400 font-medium">Date</span>
                  <input
                    type="date"
                    value={inv.date}
                    onChange={(e) => update({ date: e.target.value })}
                    className="font-mono text-slate-700 text-right border-b border-transparent hover:border-slate-300 focus:border-blue-500 outline-none"
                  />
                </div>
                <div className="flex items-center justify-end gap-2">
                  <span className="text-slate-400 font-medium">Due Date</span>
                  <input
                    type="date"
                    value={inv.dueDate}
                    onChange={(e) => update({ dueDate: e.target.value })}
                    className="font-mono text-slate-700 text-right border-b border-transparent hover:border-slate-300 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Bill To Section */}
          <div className="py-6 border-b border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Billed To
            </span>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  value={inv.toName}
                  onChange={(e) => update({ toName: e.target.value })}
                  placeholder="Client / Company Name"
                  className="text-base font-semibold text-slate-800 w-full border-b border-transparent hover:border-slate-300 focus:border-blue-500 outline-none"
                />
                <input
                  type="email"
                  value={inv.toEmail}
                  onChange={(e) => update({ toEmail: e.target.value })}
                  placeholder="client.contact@company.com"
                  className="text-xs text-slate-500 w-full mt-1 border-b border-transparent hover:border-slate-300 focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <textarea
                  rows={2}
                  value={inv.toAddress}
                  onChange={(e) => update({ toAddress: e.target.value })}
                  placeholder="Client Mailing Address, City, Country"
                  className="w-full text-xs text-slate-500 border border-transparent hover:border-slate-200 focus:border-blue-500 rounded-lg p-1.5 outline-none resize-none leading-relaxed transition-all"
                />
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="py-6">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b-2 border-slate-200/80 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="pb-3 w-1/2">Item Description</th>
                  <th className="pb-3 text-right">Qty / Hrs</th>
                  <th className="pb-3 text-right">Unit Rate</th>
                  <th className="pb-3 text-right">Amount</th>
                  <th className="pb-3 w-8 no-print" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {inv.items.map((item) => {
                  const lineTotal = (Number(item.qty) || 0) * (Number(item.rate) || 0)
                  return (
                    <tr key={item.id} className="group">
                      <td className="py-3 pr-4">
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => updateItem(item.id, { description: e.target.value })}
                          placeholder="Service or product description..."
                          className="w-full font-medium text-slate-800 border-b border-transparent hover:border-slate-300 focus:border-blue-500 outline-none py-1"
                        />
                      </td>
                      <td className="py-3 text-right">
                        <input
                          type="number"
                          min={0}
                          step="any"
                          value={item.qty}
                          onChange={(e) => updateItem(item.id, { qty: parseFloat(e.target.value) || 0 })}
                          className="w-16 font-mono text-right text-slate-700 border-b border-transparent hover:border-slate-300 focus:border-blue-500 outline-none py-1"
                        />
                      </td>
                      <td className="py-3 text-right">
                        <input
                          type="number"
                          min={0}
                          step="any"
                          value={item.rate}
                          onChange={(e) => updateItem(item.id, { rate: parseFloat(e.target.value) || 0 })}
                          className="w-20 font-mono text-right text-slate-700 border-b border-transparent hover:border-slate-300 focus:border-blue-500 outline-none py-1"
                        />
                      </td>
                      <td className="py-3 text-right font-mono font-semibold text-slate-800">
                        {formatCurrency(lineTotal, inv.currency)}
                      </td>
                      <td className="py-3 text-right no-print">
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all p-1"
                          title="Remove line item"
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            <div className="mt-4 no-print">
              <button
                onClick={addItem}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <span>+ Add Line Item</span>
              </button>
            </div>
          </div>

          {/* Calculations & Notes Area */}
          <div className="pt-6 border-t border-slate-100 grid sm:grid-cols-12 gap-8 items-start">
            {/* Notes & Payment Terms */}
            <div className="sm:col-span-7 space-y-4">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Payment Instructions & Notes
                </span>
                <textarea
                  rows={3}
                  value={inv.notes}
                  onChange={(e) => update({ notes: e.target.value })}
                  placeholder="e.g. Bank: Chase Bank, Account #: 12345678, Routing: 987654321..."
                  className="w-full text-xs text-slate-600 border border-slate-200 hover:border-slate-300 focus:border-blue-500 rounded-xl p-3 outline-none resize-none leading-relaxed transition-all"
                />
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Terms & Conditions
                </span>
                <input
                  type="text"
                  value={inv.terms}
                  onChange={(e) => update({ terms: e.target.value })}
                  placeholder="e.g. Net 14 days. 1.5% interest on late payments."
                  className="w-full text-xs text-slate-500 border border-transparent hover:border-slate-200 focus:border-blue-500 rounded-lg p-1.5 outline-none transition-all"
                />
              </div>
            </div>

            {/* Calculations Card */}
            <div className="sm:col-span-5 bg-slate-50 rounded-2xl p-5 border border-slate-200/80 space-y-2.5 text-xs">
              <div className="flex justify-between items-center text-slate-500">
                <span>Subtotal</span>
                <span className="font-mono font-medium text-slate-800">
                  {formatCurrency(subtotal, inv.currency)}
                </span>
              </div>

              <div className="flex justify-between items-center text-slate-500">
                <div className="flex items-center gap-1">
                  <span>Discount</span>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={inv.discountRate}
                    onChange={(e) => update({ discountRate: parseFloat(e.target.value) || 0 })}
                    className="w-10 font-mono text-center bg-white border border-slate-200 rounded px-1 text-[11px] outline-none"
                  />
                  <span>%</span>
                </div>
                <span className="font-mono font-medium text-slate-800">
                  -{formatCurrency(discountAmount, inv.currency)}
                </span>
              </div>

              <div className="flex justify-between items-center text-slate-500">
                <div className="flex items-center gap-1">
                  <span>Tax Rate</span>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    step="0.1"
                    value={inv.taxRate}
                    onChange={(e) => update({ taxRate: parseFloat(e.target.value) || 0 })}
                    className="w-12 font-mono text-center bg-white border border-slate-200 rounded px-1 text-[11px] outline-none"
                  />
                  <span>%</span>
                </div>
                <span className="font-mono font-medium text-slate-800">
                  {formatCurrency(tax, inv.currency)}
                </span>
              </div>

              <div className="pt-3 border-t border-slate-200/80 flex justify-between items-baseline">
                <span className="font-bold text-sm text-slate-900">Total Due</span>
                <span
                  className="font-mono font-black text-xl tracking-tight"
                  style={{ color: inv.accentColor }}
                >
                  {formatCurrency(total, inv.currency)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
