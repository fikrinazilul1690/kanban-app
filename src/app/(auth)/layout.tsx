import { Container, Box } from '@mui/material'

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <Container component={'main'} maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        {children}
      </Box>
    </Container>
  )
}
