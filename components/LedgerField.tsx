type LedgerFieldProps = {
  label: string
  value: string
  onChange: (value: string) => void
  multi?: boolean
  placeholder?: string
  type?: "text" | "email" | "date"
  /**
   * Set for fields seeded with a value generated fresh per render (a random
   * id, "today"). That value is intentionally different between the static
   * export's build-time HTML and the viewer's client render, so we tell
   * React to quietly adopt the client value instead of warning about it.
   */
  suppressHydrationWarning?: boolean
}

/**
 * A single ruled-line form field, styled like writing on a paper ledger
 * rather than filling a boxed input — underline only, ink on focus.
 */
export function LedgerField({
  label,
  value,
  onChange,
  multi = false,
  placeholder = "",
  type = "text",
  suppressHydrationWarning = false,
}: LedgerFieldProps) {
  const shared =
    "w-full bg-transparent border-0 border-b border-ledger-rule focus:border-ledger-burgundy outline-none text-[16px] leading-relaxed text-ledger-ink placeholder:text-ledger-ink-faint py-1.5 transition-colors"

  return (
    <label className="block">
      <span className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-ledger-ink-faint mb-1">
        {label}
      </span>
      {multi ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={2}
          className={`${shared} resize-none`}
          placeholder={placeholder}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={shared}
          placeholder={placeholder}
          suppressHydrationWarning={suppressHydrationWarning}
        />
      )}
    </label>
  )
}
