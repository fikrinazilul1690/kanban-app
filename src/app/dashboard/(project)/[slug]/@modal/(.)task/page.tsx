import { CreateTaskForm } from '@/app/dashboard/(project)/[slug]/task/form'
import { getProjectBySlug } from '@/app/dashboard/data'
import { Modal } from '@/app/dashboard/modal'
import Typography from '@mui/material/Typography'

export default async function ModalCreateTask({
  params,
}: {
  params: { slug: string }
}) {
  const { data: project } = await getProjectBySlug(params.slug)
  return (
    <Modal>
      <Typography variant="h4" component="h1">
        Create Task
      </Typography>
      <CreateTaskForm modal project={project} />
    </Modal>
  )
}
