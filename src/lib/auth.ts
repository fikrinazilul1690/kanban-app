import 'server-only'

import { headers } from 'next/headers'

export function getAuthToken(): string {
  return headers().get('Authorization') ?? ''
}
