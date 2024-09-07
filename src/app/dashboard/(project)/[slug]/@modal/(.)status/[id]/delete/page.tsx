import Box from '@mui/material/Box'
import { Modal } from '@/app/dashboard/modal'
import { getStatus } from '@/app/dashboard/data'
import { SelectStatusForDelete } from '../../../../select-status'
import { DeleteStatusForm } from '../../../../status/[id]/delete/form'

export default async function DeleteStatusModal({
  params,
}: {
  params: { slug: string; id: string }
}) {
  console.log('delete status modal')
  const { data: status } = await getStatus(params.id, params.slug)
  return (
    <Modal>
      <Box p={4}>
        <DeleteStatusForm
          modal
          projectSlug={params.slug}
          status={status}
          renderInput={
            <SelectStatusForDelete
              labelId="moveTo"
              id="moveTo"
              name="moveTo"
              label="Status"
              fullWidth
              projectId={status.projectId}
              deletedStatusId={status.id}
            />
          }
        />
      </Box>
    </Modal>
  )
}
