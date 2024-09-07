import 'server-only'
import { decodeJwt, JWTPayload } from 'jose'
import { cookies } from 'next/headers'
import { ApiResponse, ApiResponseError, Auth } from './definitions'
import { type NextResponse } from 'next/server'
import { baseUrl } from './constans'

const endpoint = `${baseUrl}/auth/refresh-token`

export function decode(str: string): JWTPayload {
  return decodeJwt(str)
}

export function getUserId() {
  const cookie = verifySession()
  if (!cookie) {
    return ''
  }
  return decode(cookie).sub ?? ''
}

export function createSession(
  data: {
    accessToken: string
    refreshToken: string
  },
  res?: NextResponse
) {
  const expires = new Date((decode(data.refreshToken).exp ?? 0) * 1000)
  if (res) {
    return createSessionMiddleware(res, expires, data)
  }
  return createSessionFunc(data)
}

function createSessionFunc({
  accessToken,
  refreshToken,
}: {
  accessToken: string
  refreshToken: string
}) {
  const expires = new Date((decode(refreshToken).exp ?? 0) * 1000)
  cookies().set('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    expires,
  })

  cookies().set('accessToken', accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    expires,
  })
}

function createSessionMiddleware(
  res: NextResponse,
  expires: Date,
  {
    accessToken,
    refreshToken,
  }: {
    accessToken: string
    refreshToken: string
  }
) {
  res.cookies.set('accessToken', accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    expires,
  })
  res.cookies.set('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    expires,
  })
}

export function verifySession() {
  const cookie = cookies().get('accessToken')?.value
  if (!cookie) {
    return undefined
  }

  return cookie
}

export function isValidSession(cookie: string): boolean {
  const claims = decode(cookie)
  const expInSecond = (claims.exp ?? 0) * 1000
  const now = new Date()
  const isValid = expInSecond >= now.getTime()

  return isValid
}

export function deleteSession(res?: NextResponse) {
  if (res) {
    return deletSessionMiddleware(res)
  }
  return deleteSessionFunc()
}

function deleteSessionFunc() {
  cookies().delete('accessToken')
  cookies().delete('refreshToken')
}

function deletSessionMiddleware(res: NextResponse) {
  res.cookies.delete('refreshToken')
  res.cookies.delete('accessToken')
}

export async function refreshToken() {
  const res = await fetch(endpoint, {
    method: 'POST',
    body: JSON.stringify({
      refreshToken: cookies().get('refreshToken')?.value,
    }),
    headers: {
      'Content-type': 'Application/json',
    },
  })
  if (!res.ok) {
    const { error } = (await res.json()) as ApiResponseError
    console.log(error)
    throw new Error('failed to refresh token')
  }
  // saveSession
  const { data } = (await res.json()) as ApiResponse<Auth>

  console.log('refresh token!!')

  return data
}
