import './globals.css'
import { Toaster } from 'sonner'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="max-w-7xl mx-auto">
        {children}

        <Toaster
          richColors
          position="top-center"
        />
      </body>
    </html>
  )
}