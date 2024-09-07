import { type NextRequest, NextResponse } from 'next/server'
import {
  createSession,
  deleteSession,
  isValidSession,
  refreshToken,
} from './lib/sessions'

export default async function middleware(req: NextRequest) {
  const currPath = req.nextUrl.pathname

  console.log('middleware running ', currPath)
  const isDashboard = currPath.startsWith('/dashboard')
  const cookie = req.cookies.get('accessToken')?.value
  const signInUrl = new URL('/signin', req.nextUrl)
  const newHeaders = new Headers(req.headers)

  if (cookie) {
    if (currPath.startsWith('/sign')) {
      return NextResponse.redirect(new URL('/dashboard', req.nextUrl))
    }

    if (!isValidSession(cookie)) {
      try {
        const data = await refreshToken()
        const response = setAuthorizationHeader(newHeaders, data.accessToken)
        createSession(
          {
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
          },
          response
        )
        return response
      } catch (error) {
        console.log(error)
        const response = NextResponse.redirect(signInUrl)
        deleteSession(response)
        return response
      }
    }

    return setAuthorizationHeader(newHeaders, cookie)
  }

  if (isDashboard) {
    return NextResponse.redirect(signInUrl)
  }
}

function setAuthorizationHeader(headers: Headers, token: string) {
  headers.set('Authorization', `Bearer ${token}`)

  return NextResponse.next({
    request: {
      // New request headers
      headers: headers,
    },
  })
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
