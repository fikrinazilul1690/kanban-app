import { getProjectBySlug } from '@/app/dashboard/data'
import { Modal } from '@/app/dashboard/modal'
import { DeleteForm } from './form'

export default async function DeleteProjectModal({
  params,
}: {
  params: { slug: string }
}) {
  const { data: project } = await getProjectBySlug(params.slug)
  return (
    <Modal>
      <DeleteForm project={project} />
    </Modal>
  )
}
