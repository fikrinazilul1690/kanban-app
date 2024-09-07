import Box from '@mui/material/Box'
import Container from '@mui/material/Container/Container'
import Typography from '@mui/material/Typography'
import { CreateStatusForm } from './form'
import { getProjectBySlug } from '@/app/dashboard/data'

export default async function CreateTask({
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
          Create Status
        </Typography>
        <CreateStatusForm project={project} />
      </Box>
    </Container>
  )
}
