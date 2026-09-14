import type { ReactNode } from "react"

type LedgerSectionProps = {
  index: string
  title: string
  children: ReactNode
}

/** A form section styled as a tabbed index card in a ledger book. */
export function LedgerSection({ index, title, children }: LedgerSectionProps) {
  return (
    <section className="relative bg-ledger-card border border-ledger-rule rounded-sm px-5 pt-6 pb-5 shadow-[2px_3px_0_rgba(28,29,43,0.05)]">
      <div className="absolute -top-3 left-5 flex items-center gap-2 bg-ledger-brass text-ledger-paper text-[11px] font-semibold uppercase tracking-[0.14em] px-2.5 py-1 rounded-sm shadow-sm">
        <span aria-hidden="true">{index}</span>
        <span>{title}</span>
      </div>
      <div className="space-y-4 mt-1">{children}</div>
    </section>
  )
}
