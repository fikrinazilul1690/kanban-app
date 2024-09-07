import { getTask } from '@/app/dashboard/data'
import Container from '@mui/material/Container'
import { DeleteTaskForm } from './form'

export default async function DeleteTask({
  params,
}: {
  params: { slug: string; id: string }
}) {
  const { data: task } = await getTask(params.id, params.slug)
  return (
    <Container maxWidth="xl" sx={{ pt: 4 }}>
      <DeleteTaskForm projectSlug={params.slug} task={task} />
    </Container>
  )
}
