export type FormState =
  | {
      success: boolean
      errors?: FieldError
      message?: string
    }
  | undefined

export type FieldError = {
  [key: string]: string[] | undefined
}

export type ApiResponseError = {
  statusCode: number
  status: string
  error: {
    message: string
    timestamp: string
    path: string
    details:
      | string
      | Array<{
          field: string
          message: string
        }>
  }
}

export type ApiResponse<T> = {
  statusCode: number
  status: string
  timestamp: string
  path: string
  data: T
}

export type User = {
  id: string
  name: string
  email: string
  createdAt: string
}

export type Auth = {
  accessToken: string
  refreshToken: string
  user: User
}

export type Project = {
  id: string
  icon: string
  title: string
  slug: string
  description: string | null
  createdAt: string
  updatedAt: string
}

export type Projects = Array<Project & { owner: User }>

export type TaskStatus = {
  id: string
  name: string
  slug: string
  order: number
  color: string
  isClosed: boolean
  projectId: string
}

export type TaskStatuses = Array<TaskStatus & { tasks: Task[] }>

export type Task = {
  id: string
  subject: string
  order: number
  description: string | null
  statusId: string
  projectId: string
  createdAt: string
  updatedAt: string
}

export type TaskWithStatus = Task & { status: TaskStatus }

export type Tasks = Array<Task>
