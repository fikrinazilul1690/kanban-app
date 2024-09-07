import { ReactNode } from 'react'
import { createPortal } from 'react-dom'

type Props = {
  children: ReactNode
}

export default function Overlay({ children }: Props) {
  return createPortal(children, document.body)
}
