'use server'
import { getAuthToken } from '@/lib/auth'
import { baseUrl } from '@/lib/constans'
import { ApiResponseError, FieldError, FormState } from '@/lib/definitions'
import { revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'

const endpoint = `${baseUrl}/tasks`

export async function editTask(
  taskId: string,
  projectSlug: string,
  state: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const res = await fetch(`${endpoint}/${taskId}`, {
      method: 'PATCH',
      body: JSON.stringify(Object.fromEntries(formData)),
      headers: {
        'Content-type': 'Application/json',
        Authorization: getAuthToken(),
      },
    })
    if (!res.ok) {
      const { error } = (await res.json()) as ApiResponseError
      console.log(error)

      if (typeof error.details === 'string') {
        return {
          success: res.ok,
          message: error.details,
        }
      }

      const errState: FieldError = {}

      error.details.forEach((val) => {
        const errFields = errState[val.field]
        if (errFields) {
          errFields.push(val.message)
          return
        }
        errState[val.field] = [val.message]
      })

      return {
        success: res.ok,
        errors: errState,
      }
    }
  } catch (error) {
    console.log(error)
  }
  revalidateTag('projects')
  redirect(`/dashboard/${projectSlug}/task/${taskId}`)
}
