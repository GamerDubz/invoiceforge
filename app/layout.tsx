import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'InvoiceForge — Executive Invoice & Estimate Generator',
  description:
    'Create, customize, and export professional PDF invoices instantly. Private, in-browser, no account required.',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} min-h-full bg-slate-100/75 text-slate-900 antialiased selection:bg-blue-500/20 selection:text-blue-900`}>
        {children}
      </body>
    </html>
  )
}
