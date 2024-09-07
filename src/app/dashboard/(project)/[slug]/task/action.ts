'use server'
import { getAuthToken } from '@/lib/auth'
import { baseUrl } from '@/lib/constans'
import { ApiResponseError, FieldError, FormState } from '@/lib/definitions'
import { redirect } from 'next/navigation'

const endpoint = `${baseUrl}/tasks`

export async function createTask(
  projectSlug: string,
  projectId: string,
  statusId: string | undefined,
  state: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      body: JSON.stringify({
        ...Object.fromEntries(formData),
        projectId,
        statusId,
      }),
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

  redirect(`/dashboard/${projectSlug}`)
}
