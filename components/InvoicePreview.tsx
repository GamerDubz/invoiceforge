import { Plus, Trash2 } from "lucide-react"
import { formatCurrency, type Invoice } from "@/lib/invoice"
import { Mark } from "./Mark"

type InvoicePreviewProps = {
  invoice: Invoice
  onUpdateItem: (id: string, patch: Partial<Invoice["items"][number]>) => void
  onAddItem: () => void
  onRemoveItem: (id: string) => void
  printRef: React.RefObject<HTMLDivElement | null>
}

export function InvoicePreview({ invoice, onUpdateItem, onAddItem, onRemoveItem, printRef }: InvoicePreviewProps) {
  const subtotal = invoice.items.reduce((s, i) => s + i.qty * i.rate, 0)
  const tax = subtotal * (invoice.taxRate / 100)
  const total = subtotal + tax

  return (
    <div
      ref={printRef}
      className="stamp-in relative mx-auto max-w-[680px] print:mx-0 print:max-w-none"
    >
      {/* Stacked paper edges beneath the top sheet, for desk presence. */}
      <div className="absolute inset-0 translate-x-2 translate-y-3 bg-ledger-paper-deep border border-ledger-rule rounded-sm no-print" aria-hidden="true" />
      <div className="absolute inset-0 translate-x-1 translate-y-1.5 bg-ledger-card border border-ledger-rule rounded-sm no-print" aria-hidden="true" />

      <div className="paper-grain relative bg-ledger-card border border-ledger-ink/15 rounded-sm shadow-[0_18px_40px_-14px_rgba(28,29,43,0.35)] print:shadow-none print:border-0 overflow-hidden">
        <div className="h-1.5 w-full" style={{ background: `linear-gradient(90deg, ${invoice.accentColor}, ${invoice.accentColor}aa)` }} />

        <div className="px-8 py-8 sm:px-10 sm:py-10">
          <div className="flex items-start justify-between gap-6 mb-10">
            <div className="flex items-start gap-4">
              <Mark size={44} className="mt-1 shrink-0 no-print" />
              <div>
                <h2
                  className="font-serif-display font-black text-[2.1rem] leading-none tracking-tight"
                  style={{ color: invoice.accentColor }}
                >
                  Invoice
                </h2>
                <p className="text-sm text-ledger-ink-faint mt-2 font-medium tracking-wide" suppressHydrationWarning>
                  No. {invoice.invoiceNo}
                </p>
              </div>
            </div>
            <dl className="text-right text-sm text-ledger-ink-soft space-y-1 shrink-0">
              <div className="flex justify-end gap-2">
                <dt className="text-ledger-ink-faint">Issued</dt>
                <dd className="tabular-nums font-medium" suppressHydrationWarning>{invoice.date}</dd>
              </div>
              <div className="flex justify-end gap-2">
                <dt className="text-ledger-ink-faint">Due</dt>
                <dd className="tabular-nums font-medium" suppressHydrationWarning>{invoice.dueDate}</dd>
              </div>
            </dl>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-10 pb-8 border-b border-ledger-rule">
            <div>
              <div className="text-[11px] uppercase tracking-[0.16em] text-ledger-ink-faint mb-2 font-semibold">From</div>
              <div className="font-semibold text-ledger-ink">{invoice.fromName}</div>
              <div className="text-sm text-ledger-ink-soft">{invoice.fromEmail}</div>
              <div className="text-sm text-ledger-ink-soft whitespace-pre-line">{invoice.fromAddress}</div>
            </div>
            <div className="pl-8 border-l border-ledger-rule">
              <div className="text-[11px] uppercase tracking-[0.16em] text-ledger-ink-faint mb-2 font-semibold">Bill to</div>
              <div className="font-semibold text-ledger-ink">{invoice.toName}</div>
              <div className="text-sm text-ledger-ink-soft">{invoice.toEmail}</div>
              <div className="text-sm text-ledger-ink-soft whitespace-pre-line">{invoice.toAddress}</div>
            </div>
          </div>

          <table className="w-full mb-4 text-sm border-collapse">
            <thead>
              <tr className="border-b-2" style={{ borderColor: invoice.accentColor }}>
                <th className="py-2 px-2 text-left text-[11px] uppercase tracking-[0.14em] text-ledger-ink-faint font-semibold">
                  Description
                </th>
                <th className="py-2 px-2 text-right text-[11px] uppercase tracking-[0.14em] text-ledger-ink-faint font-semibold w-20">
                  Qty
                </th>
                <th className="py-2 px-2 text-right text-[11px] uppercase tracking-[0.14em] text-ledger-ink-faint font-semibold w-28">
                  Rate
                </th>
                <th className="py-2 px-2 text-right text-[11px] uppercase tracking-[0.14em] text-ledger-ink-faint font-semibold w-28">
                  Amount
                </th>
                <th className="no-print w-11" />
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item) => (
                <tr key={item.id} className="align-middle border-b border-ledger-rule">
                  <td className="py-1.5 px-2">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => onUpdateItem(item.id, { description: e.target.value })}
                      className="w-full bg-transparent outline-none focus:bg-ledger-paper-deep/60 rounded-sm px-1 py-1 print:pointer-events-none text-ledger-ink min-h-11"
                      aria-label="Item description"
                    />
                  </td>
                  <td className="py-1.5 px-2 text-right">
                    <input
                      type="number"
                      value={item.qty}
                      onChange={(e) => onUpdateItem(item.id, { qty: Number(e.target.value) })}
                      className="w-full text-right bg-transparent outline-none focus:bg-ledger-paper-deep/60 rounded-sm px-1 py-1 print:pointer-events-none text-ledger-ink min-h-11 tabular-nums"
                      aria-label="Quantity"
                    />
                  </td>
                  <td className="py-1.5 px-2 text-right">
                    <input
                      type="number"
                      value={item.rate}
                      onChange={(e) => onUpdateItem(item.id, { rate: Number(e.target.value) })}
                      className="w-full text-right bg-transparent outline-none focus:bg-ledger-paper-deep/60 rounded-sm px-1 py-1 print:pointer-events-none text-ledger-ink min-h-11 tabular-nums"
                      aria-label="Rate"
                    />
                  </td>
                  <td className="py-1.5 px-2 text-right font-medium tabular-nums text-ledger-ink">
                    {formatCurrency(item.qty * item.rate, invoice.currency)}
                  </td>
                  <td className="no-print px-1 text-center">
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="inline-flex h-11 w-11 items-center justify-center text-ledger-ink-faint hover:text-ledger-burgundy transition-colors rounded-sm"
                      aria-label={`Remove line item: ${item.description || "untitled"}`}
                    >
                      <Trash2 size={16} aria-hidden="true" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button
            onClick={onAddItem}
            className="no-print inline-flex items-center gap-2 text-sm font-medium px-4 min-h-11 border border-dashed rounded-sm mb-8 transition-colors hover:bg-ledger-paper-deep/50"
            style={{ borderColor: `${invoice.accentColor}88`, color: invoice.accentColor }}
          >
            <Plus size={15} aria-hidden="true" />
            Add line item
          </button>

          <div className="flex justify-end">
            <div className="w-full sm:w-64 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-ledger-ink-faint">Subtotal</span>
                <span className="tabular-nums text-ledger-ink">{formatCurrency(subtotal, invoice.currency)}</span>
              </div>
              {invoice.taxRate > 0 && (
                <div className="flex justify-between">
                  <span className="text-ledger-ink-faint">Tax ({invoice.taxRate}%)</span>
                  <span className="tabular-nums text-ledger-ink">{formatCurrency(tax, invoice.currency)}</span>
                </div>
              )}
              <div
                className="flex justify-between items-baseline pt-3 mt-1 border-t-2 font-serif-display font-bold text-xl"
                style={{ borderColor: invoice.accentColor }}
              >
                <span style={{ color: invoice.accentColor }}>Total</span>
                <span className="tabular-nums" style={{ color: invoice.accentColor }}>
                  {formatCurrency(total, invoice.currency)}
                </span>
              </div>
            </div>
          </div>

          {invoice.notes && (
            <div className="mt-10 pt-6 border-t border-ledger-rule">
              <div className="text-[11px] uppercase tracking-[0.16em] text-ledger-ink-faint mb-2 font-semibold">Notes</div>
              <p className="text-sm text-ledger-ink-soft whitespace-pre-line">{invoice.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
