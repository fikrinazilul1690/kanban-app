import { getStatus } from '@/app/dashboard/data'
import Container from '@mui/material/Container'
import { DeleteStatusForm } from './form'
import { SelectStatusForDelete } from '../../../select-status'

export default async function DeleteStatus({
  params,
}: {
  params: { slug: string; id: string }
}) {
  const { data: status } = await getStatus(params.id, params.slug)
  return (
    <Container maxWidth="xl" sx={{ pt: 4 }}>
      <DeleteStatusForm
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
    </Container>
  )
}
