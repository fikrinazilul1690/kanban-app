import Box from '@mui/material/Box'
import { ProjectsContainer } from '../projects'
import Typography from '@mui/material/Typography'
import { getUser } from '../data'

export default async function DashboardPage() {
  const { data: user } = await getUser()
  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 5,
        p: 10,
        mx: 'auto',
        maxWidth: 'md',
        maxHeight: '100vh',
      }}
    >
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <Typography variant="h4" fontWeight="700">
          Welcome, {user.name}
        </Typography>
      </Box>
      <ProjectsContainer />
    </Box>
  )
}
