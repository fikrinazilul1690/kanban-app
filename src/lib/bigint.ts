import { UniqueIdentifier } from '@dnd-kit/core'

export function isBigInt(id: UniqueIdentifier): boolean {
  try {
    const data = BigInt(id)
    return true
  } catch (error) {
    return false
  }
}
