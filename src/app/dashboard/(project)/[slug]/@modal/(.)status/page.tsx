import { CreateStatusForm } from '@/app/dashboard/(project)/[slug]/status/form'
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
        Create Status
      </Typography>
      <CreateStatusForm modal project={project} />
    </Modal>
  )
}
