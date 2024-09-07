import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import { getStatus } from '@/app/dashboard/data'
import { EditStatusForm } from './form'

export default async function EditTask({
  params,
}: {
  params: { slug: string; id: string }
}) {
  const { data: status } = await getStatus(params.id, params.slug)
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
          Edit Status Board
        </Typography>
        <EditStatusForm projectSlug={params.slug} status={status} />
      </Box>
    </Container>
  )
}
