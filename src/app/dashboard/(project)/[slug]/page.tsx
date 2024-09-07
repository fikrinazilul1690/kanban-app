import { getProjectBySlug } from '../../data'
import Kanban from './kanban'

export default async function DetailBoardPage({
  params,
}: {
  params: { slug: string }
}) {
  const { data: project } = await getProjectBySlug(params.slug)
  return <Kanban project={project} />
}
