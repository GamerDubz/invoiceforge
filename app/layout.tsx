import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
const inter = Inter({ subsets: ['latin'] })
export const metadata: Metadata = {
  title: 'InvoiceForge — Invoice Generator',
  description: 'Create, customize, and export professional invoices to PDF. No account required.',
}
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="en"><body className={`${inter.className} antialiased`}>{children}</body></html>)
}
