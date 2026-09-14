"use client"

import { useCallback, useRef, useState } from "react"
import { Printer } from "lucide-react"
import { createDefaultInvoice, genId, type Invoice } from "@/lib/invoice"
import { Mark } from "@/components/Mark"
import { InvoiceEditor } from "@/components/InvoiceEditor"
import { InvoicePreview } from "@/components/InvoicePreview"

export default function InvoiceForgePage() {
  const [invoice, setInvoice] = useState<Invoice>(createDefaultInvoice)
  const printRef = useRef<HTMLDivElement>(null)

  const update = useCallback((patch: Partial<Invoice>) => {
    setInvoice((current) => ({ ...current, ...patch }))
  }, [])

  const updateItem = useCallback((id: string, patch: Partial<Invoice["items"][number]>) => {
    setInvoice((current) => ({
      ...current,
      items: current.items.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    }))
  }, [])

  const addItem = useCallback(() => {
    setInvoice((current) => ({
      ...current,
      items: [...current.items, { id: genId(), description: "Service", qty: 1, rate: 100 }],
    }))
  }, [])

  const removeItem = useCallback((id: string) => {
    setInvoice((current) => ({ ...current, items: current.items.filter((item) => item.id !== id) }))
  }, [])

  const handlePrint = useCallback(() => {
    window.print()
  }, [])

  return (
    <div className="min-h-screen bg-ledger-paper print:bg-white">
      <header className="no-print sticky top-0 z-10 bg-ledger-paper/95 backdrop-blur-sm border-b border-ledger-rule">
        <div className="max-w-[1400px] mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Mark size={36} />
            <div>
              <h1 className="font-serif-display font-bold text-xl leading-none text-ledger-ink">InvoiceForge</h1>
              <p className="text-[11px] uppercase tracking-[0.16em] text-ledger-ink-faint mt-1">Ledger &amp; Draft</p>
            </div>
          </div>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 min-h-11 px-5 bg-ledger-burgundy hover:bg-ledger-burgundy-deep text-ledger-paper text-sm font-semibold tracking-wide rounded-sm transition-colors shadow-[2px_2px_0_rgba(28,29,43,0.2)]"
          >
            <Printer size={16} aria-hidden="true" />
            Print / Save PDF
          </button>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-6 py-10 lg:py-14 grid lg:grid-cols-5 gap-10 lg:gap-14 print:block print:p-0 print:max-w-none">
        <div className="lg:col-span-2 print:hidden">
          <InvoiceEditor invoice={invoice} onUpdate={update} />
        </div>

        <div className="lg:col-span-3 print:w-full">
          <InvoicePreview
            invoice={invoice}
            onUpdateItem={updateItem}
            onAddItem={addItem}
            onRemoveItem={removeItem}
            printRef={printRef}
          />
        </div>
      </main>
    </div>
  )
}
