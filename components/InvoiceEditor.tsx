import { Palette } from "lucide-react"
import { CURRENCIES, type Invoice } from "@/lib/invoice"
import { LedgerField } from "./LedgerField"
import { LedgerSection } from "./LedgerSection"

type InvoiceEditorProps = {
  invoice: Invoice
  onUpdate: (patch: Partial<Invoice>) => void
}

export function InvoiceEditor({ invoice, onUpdate }: InvoiceEditorProps) {
  return (
    <div className="space-y-8">
      <LedgerSection index="01" title="Particulars">
        <LedgerField
          label="Invoice No."
          value={invoice.invoiceNo}
          onChange={(v) => onUpdate({ invoiceNo: v })}
          suppressHydrationWarning
        />
        <div className="grid grid-cols-2 gap-4">
          <LedgerField
            label="Issued"
            type="date"
            value={invoice.date}
            onChange={(v) => onUpdate({ date: v })}
            suppressHydrationWarning
          />
          <LedgerField
            label="Due"
            type="date"
            value={invoice.dueDate}
            onChange={(v) => onUpdate({ dueDate: v })}
            suppressHydrationWarning
          />
        </div>
        <div className="grid grid-cols-2 gap-4 items-end">
          <label className="block">
            <span className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-ledger-ink-faint mb-1">
              Currency
            </span>
            <select
              value={invoice.currency}
              onChange={(e) => onUpdate({ currency: e.target.value })}
              className="w-full bg-transparent border-0 border-b border-ledger-rule focus:border-ledger-burgundy outline-none text-[16px] text-ledger-ink py-1.5 min-h-11"
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-ledger-ink-faint mb-1">
              Tax rate (%)
            </span>
            <input
              type="number"
              min={0}
              max={100}
              value={invoice.taxRate}
              onChange={(e) => onUpdate({ taxRate: Number(e.target.value) })}
              className="w-full bg-transparent border-0 border-b border-ledger-rule focus:border-ledger-burgundy outline-none text-[16px] text-ledger-ink py-1.5 min-h-11"
            />
          </label>
        </div>
        <label className="flex items-center gap-3 pt-1">
          <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-ledger-ink-faint">
            <Palette size={14} aria-hidden="true" />
            Seal color
          </span>
          <input
            type="color"
            value={invoice.accentColor}
            onChange={(e) => onUpdate({ accentColor: e.target.value })}
            className="h-11 w-11 rounded-sm border border-ledger-rule-strong bg-transparent cursor-pointer p-0.5"
            aria-label="Invoice accent color"
          />
        </label>
      </LedgerSection>

      <LedgerSection index="02" title="From">
        <LedgerField label="Name / Company" value={invoice.fromName} onChange={(v) => onUpdate({ fromName: v })} />
        <LedgerField label="Email" type="email" value={invoice.fromEmail} onChange={(v) => onUpdate({ fromEmail: v })} />
        <LedgerField label="Address" value={invoice.fromAddress} onChange={(v) => onUpdate({ fromAddress: v })} multi />
      </LedgerSection>

      <LedgerSection index="03" title="Bill to">
        <LedgerField label="Name / Company" value={invoice.toName} onChange={(v) => onUpdate({ toName: v })} />
        <LedgerField label="Email" type="email" value={invoice.toEmail} onChange={(v) => onUpdate({ toEmail: v })} />
        <LedgerField label="Address" value={invoice.toAddress} onChange={(v) => onUpdate({ toAddress: v })} multi />
      </LedgerSection>

      <LedgerSection index="04" title="Notes">
        <LedgerField
          label="Terms, bank details, thanks"
          value={invoice.notes}
          onChange={(v) => onUpdate({ notes: v })}
          multi
          placeholder="Payment terms, bank details, etc."
        />
      </LedgerSection>
    </div>
  )
}
