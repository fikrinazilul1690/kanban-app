import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter'
import { ThemeProvider } from '@mui/material'
import theme from '@/theme'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Kanban App',
  description: 'Project Management Application',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <AppRouterCacheProvider>
        <ThemeProvider theme={theme}>
          <body className={inter.className}>{children}</body>
        </ThemeProvider>
      </AppRouterCacheProvider>
    </html>
  )
}
