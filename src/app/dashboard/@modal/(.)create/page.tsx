import { Modal } from '@/app/dashboard/modal'
import Typography from '@mui/material/Typography'
import { CreateProjectForm } from '@/app/dashboard/(project)/create/form'

export default function CreateProjectModal() {
  return (
    <Modal>
      <Typography variant="h4" component="h1">
        Create Project
      </Typography>
      <CreateProjectForm modal />
    </Modal>
  )
}
