import { getProjectBySlug } from '@/app/dashboard/data'
import { EditProjectForm } from './form'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

export default async function EditProjectPage({
  params,
}: {
  params: { slug: string }
}) {
  const { data: project } = await getProjectBySlug(params.slug)
  return (
    <Box>
      <Typography variant="h4" component="h1">
        Edit Project
      </Typography>
      <EditProjectForm project={project} />
    </Box>
  )
}
