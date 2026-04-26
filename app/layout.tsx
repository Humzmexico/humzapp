import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Humz - Business Operating System',
  description: 'Centro operativo para negocios de servicios y pequeñas empresas',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
