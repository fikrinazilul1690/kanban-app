import { getStatus } from '@/app/dashboard/data'
import { Modal } from '@/app/dashboard/modal'
import Typography from '@mui/material/Typography'
import { EditStatusForm } from '../../../../status/[id]/edit/form'

export default async function ModalEditTask({
  params,
}: {
  params: { slug: string; id: string }
}) {
  const { data: status } = await getStatus(params.id, params.slug)
  return (
    <Modal>
      <Typography variant="h4" component="h1">
        Edit Status Board
      </Typography>
      <EditStatusForm modal projectSlug={params.slug} status={status} />
    </Modal>
  )
}
