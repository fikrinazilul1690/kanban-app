import { getProjectBySlug } from '@/app/dashboard/data'
import { DeleteForm } from './form'

export default async function DeleteProject({
  params,
}: {
  params: { slug: string }
}) {
  const { data: project } = await getProjectBySlug(params.slug)
  return <DeleteForm project={project} />
}
