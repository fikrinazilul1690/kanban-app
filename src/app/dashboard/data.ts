import 'server-only'
import { baseUrl } from '@/lib/constans'
import {
  ApiResponse,
  Project,
  Projects,
  TaskStatus,
  TaskStatuses,
  TaskWithStatus,
  User,
} from '@/lib/definitions'
import { deleteSession, getUserId } from '@/lib/sessions'
import { getAuthToken } from '@/lib/auth'
import { notFound } from 'next/navigation'

export async function getProjects(): Promise<ApiResponse<Projects>> {
  const res = await fetch(`${baseUrl}/projects?userId=${getUserId()}`, {
    headers: {
      Authorization: getAuthToken(),
    },
    next: {
      tags: ['projects'],
    },
  })
  if (!res.ok) {
    throw new Error(`failed to get projects (code: ${res.status})`)
  }
  await new Promise((resolve) => setTimeout(resolve, 3000))
  return res.json()
}

export async function getTask(
  id: string,
  slug?: string
): Promise<ApiResponse<TaskWithStatus>> {
  const params = new URLSearchParams()
  if (!!slug) {
    params.set('projectSlug', slug)
  }
  console.log(params.toString())
  const res = await fetch(`${baseUrl}/tasks/${id}?${params.toString()}`, {
    headers: {
      Authorization: getAuthToken(),
    },
  })
  if (!res.ok) {
    switch (res.status) {
      case 404:
        notFound()

      default:
        throw new Error(`failed to get task by id: ${id} (code: ${res.status})`)
    }
  }
  return res.json()
}

export async function getStatus(
  id: string,
  slug?: string
): Promise<ApiResponse<TaskStatus>> {
  const params = new URLSearchParams()
  if (!!slug) {
    params.set('projectSlug', slug)
  }
  console.log(params.toString())
  const res = await fetch(
    `${baseUrl}/task-statuses/${id}?${params.toString()}`,
    {
      headers: {
        Authorization: getAuthToken(),
      },
    }
  )
  if (!res.ok) {
    switch (res.status) {
      case 404:
        notFound()

      default:
        throw new Error(
          `failed to get task status by id: ${id} (code: ${res.status})`
        )
    }
  }
  return res.json()
}

export async function getUser(): Promise<ApiResponse<User>> {
  const res = await fetch(`${baseUrl}/users/me`, {
    headers: {
      Authorization: getAuthToken(),
    },
  })

  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      deleteSession()
    }
    throw new Error(`failed to get user (code: ${res.status})`)
  }

  return res.json()
}

export async function getProjectBySlug(
  slug: string
): Promise<ApiResponse<Project>> {
  console.log('get project by slug: ', slug)
  const res = await fetch(`${baseUrl}/projects/by-slug?slug=${slug}`, {
    headers: {
      Authorization: getAuthToken(),
    },
    cache: 'force-cache',
    next: {
      tags: ['projects'],
    },
  })
  if (!res.ok) {
    switch (res.status) {
      case 404:
        notFound()

      default:
        throw new Error(
          `failed to get project by slug: ${slug} (code: ${res.status})`
        )
    }
  }

  return res.json()
}

export async function getBoard(
  projectId: string
): Promise<ApiResponse<TaskStatuses>> {
  const res = await fetch(`${baseUrl}/task-statuses?projectId=${projectId}`, {
    headers: {
      Authorization: getAuthToken(),
    },
    next: {
      tags: ['kanban'],
    },
  })

  if (!res.ok) {
    throw new Error(
      `failed to get board for projectId: ${projectId} (code: ${res.status})`
    )
  }

  return res.json()
}

export async function getUserAndProjects(): Promise<{
  user: User
  projects: Projects
}> {
  const [{ data: user }, { data: projects }] = await Promise.all([
    getUser(),
    getProjects(),
  ])

  return { user, projects }
}
