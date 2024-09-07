import { getTask } from '@/app/dashboard/data'
import { Modal } from '@/app/dashboard/modal'
import Typography from '@mui/material/Typography'
import { EditTaskForm } from '../../edit/form'
import { SelectStatus } from '../../../../select-status'

export default async function ModalEditTask({
  params,
}: {
  params: { slug: string; id: string }
}) {
  const { data: task } = await getTask(params.id, params.slug)
  return (
    <Modal>
      <Typography variant="h4" component="h1">
        Edit Task
      </Typography>
      <EditTaskForm
        task={task}
        projectSlug={params.slug}
        modal
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
    </Modal>
  )
}
