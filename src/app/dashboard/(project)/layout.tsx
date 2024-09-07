import Box from '@mui/material/Box'
import { Sidebar } from './sidebar'

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <Box
      sx={{
        display: 'flex',
      }}
    >
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: '80vw',
        }}
      >
        {children}
      </Box>
    </Box>
  )
}
