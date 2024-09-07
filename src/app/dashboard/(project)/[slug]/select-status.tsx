import { getBoard } from '@/app/dashboard/data'
import { SelectStatusClient } from './select-status.client'

type Props = {
  projectId: string
  defaultValue?: string
  fullWidth?: boolean
  labelId?: string
  id?: string
  name?: string
  label: string
}

export async function SelectStatus({ projectId, ...props }: Props) {
  const { data: statuses } = await getBoard(projectId)
  return <SelectStatusClient statuses={statuses} {...props} />
}

type PropsForDelete = {
  projectId: string
  deletedStatusId: string
  fullWidth?: boolean
  labelId?: string
  id?: string
  name?: string
  label: string
}

export async function SelectStatusForDelete({
  projectId,
  deletedStatusId,
  ...props
}: PropsForDelete) {
  const { data: statuses } = await getBoard(projectId)
  const filteredStatus = statuses.filter(
    (status) => status.id !== deletedStatusId
  )
  return (
    <SelectStatusClient
      statuses={filteredStatus}
      defaultValue={filteredStatus[0].id}
      {...props}
    />
  )
}
