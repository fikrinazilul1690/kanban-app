import { getTask } from '@/app/dashboard/data'
import Box from '@mui/material/Box'
import { Modal } from '@/app/dashboard/modal'
import { DeleteTaskForm } from '../../delete/form'

export default async function DeleteTaskModal({
  params,
}: {
  params: { slug: string; id: string }
}) {
  const { data: task } = await getTask(params.id, params.slug)
  return (
    <Modal>
      <Box p={4}>
        <DeleteTaskForm projectSlug={params.slug} modal task={task} />
      </Box>
    </Modal>
  )
}
