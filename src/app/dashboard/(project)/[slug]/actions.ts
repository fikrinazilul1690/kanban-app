'use server'

import { getAuthToken } from '@/lib/auth'
import { baseUrl } from '@/lib/constans'
import { revalidateTag } from 'next/cache'

type BulkTaskStatusesOrderDto = {
  projectId: string
  bulkTaskStatuses: {
    order: number
    statusId: string
  }[]
}

type BulkTasksOrderDto = {
  bulkTasks: string[]
  projectId: string
  statusId: string
}

export async function bulkUpdateTaskStatusesOrder(
  data: BulkTaskStatusesOrderDto
) {
  try {
    await fetch(`${baseUrl}/task-statuses/bulk-order`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-type': 'Application/json',
        Authorization: getAuthToken(),
      },
    })
  } catch (error) {
    console.log(error)
  }
  revalidateTag('kanban')
}

export async function bulkUpdateTasksOrder(data: BulkTasksOrderDto) {
  try {
    await fetch(`${baseUrl}/tasks/bulk-order`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-type': 'Application/json',
        Authorization: getAuthToken(),
      },
    })
  } catch (error) {
    console.log(error)
  }
  revalidateTag('kanban')
}

export async function sleep(ms: number) {
  console.log('sleep fired')
  return await new Promise((resolve) => setTimeout(resolve, ms))
}
