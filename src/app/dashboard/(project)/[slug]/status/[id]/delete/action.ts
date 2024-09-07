'use server'
import { getAuthToken } from '@/lib/auth'
import { baseUrl } from '@/lib/constans'
import { ApiResponseError, FieldError, FormState } from '@/lib/definitions'
import { revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'

const endpoint = `${baseUrl}/task-statuses`

export async function deleteStatus(
  projectSlug: string,
  statusId: string,
  state: FormState,
  formData: FormData
): Promise<FormState> {
  const params = new URLSearchParams()
  const moveTo = formData.get('moveTo')
  if (!!moveTo) {
    params.set('moveTo', moveTo.toString())
  }
  try {
    const res = await fetch(`${endpoint}/${statusId}?${params}`, {
      method: 'DELETE',
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
      let message: undefined | string

      error.details.forEach((val) => {
        const errFields = errState[val.field]
        if (val.field === 'moveTo') {
          message = val.message
        }
        if (errFields) {
          errFields.push(val.message)
          return
        }
        errState[val.field] = [val.message]
      })

      return {
        success: res.ok,
        errors: errState,
        message,
      }
    }
  } catch (error) {
    console.log(error)
  }
  revalidateTag('projects')
  redirect(`/dashboard/${projectSlug}`)
}
