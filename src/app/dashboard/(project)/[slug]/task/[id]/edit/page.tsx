import { getTask } from '@/app/dashboard/data'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import { EditTaskForm } from './form'
import { SelectStatus } from '../../../select-status'

export default async function EditTask({
  params,
}: {
  params: { slug: string; id: string }
}) {
  const { data: task } = await getTask(params.id, params.slug)
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
          Edit Task
        </Typography>
        <EditTaskForm
          task={task}
          projectSlug={params.slug}
          selectStatus={
            <SelectStatus
              labelId="statusId"
              id="statusId"
              name="statusId"
              label="Status"
              fullWidth
              projectId={task.projectId}
              defaultValue={task.statusId}
            />
          }
        />
      </Box>
    </Container>
  )
}
