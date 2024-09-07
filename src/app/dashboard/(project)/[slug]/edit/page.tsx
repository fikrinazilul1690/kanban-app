import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import { EditProjectForm } from './form'
import { getProjectBySlug } from '@/app/dashboard/data'

export default async function EditProject({
  params,
}: {
  params: { slug: string }
}) {
  const { data: project } = await getProjectBySlug(params.slug)
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
          Edit Project
        </Typography>
        <EditProjectForm project={project} />
      </Box>
    </Container>
  )
}
