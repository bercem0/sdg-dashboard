import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/ui/Header'
import { Footer } from '@/components/ui/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SDG Dashboard | Sustainable Development Goals',
  description: 'Interactive dashboard for tracking Sustainable Development Goals (SDGs) progress',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="nl">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        {/* TODO: Voeg SkipToContent component toe voor accessibility */}
        <Header  />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}