import type { Metadata } from "next"
import { Fraunces, Work_Sans } from "next/font/google"
import "./globals.css"

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-serif-display",
  weight: ["400", "500", "600", "700", "900"],
  style: ["normal", "italic"],
  display: "swap",
})

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-sans-ui",
  weight: ["400", "500", "600", "700"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "InvoiceForge — Invoice Generator",
  description: "Create, customize, and export professional invoices to PDF. No account required.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${workSans.variable}`}>
      <body className="font-sans-ui antialiased">{children}</body>
    </html>
  )
}
