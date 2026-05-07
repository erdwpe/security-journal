import './globals.css'
import { Toaster } from 'sonner'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-zinc-950 text-white">
        {children}

        <Toaster
          richColors
          position="top-center"
        />
      </body>
    </html>
  )
}