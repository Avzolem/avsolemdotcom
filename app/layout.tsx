import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../styles/globals.css'
import { Providers } from './providers'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Andrés Aguilar - Full Stack Developer & Web3 Specialist',
  description: 'Portfolio de Andrés Aguilar - Desarrollador Full Stack especializado en React, Next.js, Solana y Web3. Creando experiencias web innovadoras.',
  keywords: 'Andrés Aguilar, Full Stack Developer, React, Next.js, Solana, Web3, NFT, Blockchain',
  authors: [{ name: 'Andrés Aguilar' }],
  openGraph: {
    title: 'Andrés Aguilar - Full Stack Developer',
    description: 'Portfolio profesional de desarrollo web y blockchain',
    url: 'https://avsolem.com',
    siteName: 'Avsolem',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'es_MX',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className} data-theme="avsolem">
        <Providers>
          <Navbar />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  )
}