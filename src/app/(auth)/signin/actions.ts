'use server'
import { baseUrl } from '@/lib/constans'
import {
  ApiResponse,
  ApiResponseError,
  Auth,
  FieldError,
  FormState,
} from '@/lib/definitions'
import { createSession } from '@/lib/sessions'
import { redirect } from 'next/navigation'

const endpoint = `${baseUrl}/auth/signin`

export async function signin(
  state: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      body: JSON.stringify(Object.fromEntries(formData)),
      headers: {
        'Content-type': 'Application/json',
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
    // saveSession
    const { data } = (await res.json()) as ApiResponse<Auth>
    console.log('cookie set')
    createSession({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    })
  } catch (error) {
    console.log(error)
  }

  redirect('/dashboard')
}
