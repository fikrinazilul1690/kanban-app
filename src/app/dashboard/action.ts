'use server'

import { baseUrl } from '@/lib/constans'
import { deleteSession } from '@/lib/sessions'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const endpoint = `${baseUrl}/auth/revoke`

export async function logout() {
  const res = await fetch(endpoint, {
    method: 'POST',
    body: JSON.stringify({
      refreshToken: cookies().get('refreshToken')?.value,
    }),
    headers: {
      'Content-type': 'Application/json',
    },
  })
  if (res.ok) {
    console.log('token revoked')
  }

  deleteSession()
  redirect('/signin')
}
