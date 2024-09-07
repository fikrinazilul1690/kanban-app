import Box from '@mui/material/Box'
import { CreateProjectForm } from './form'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'

export default function CreateProject() {
  return (
    <Container maxWidth="xl">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          width: '100%',
        }}
      >
        <Typography
          sx={{ alignSelf: 'self-start' }}
          variant="h3"
          component="h1"
        >
          Create Project
        </Typography>
        <CreateProjectForm />
      </Box>
    </Container>
  )
}
