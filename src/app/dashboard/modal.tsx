'use client'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import Box from '@mui/material/Box'
import { useRouter } from 'next/navigation'
import { type ElementRef, ReactNode, useRef, useEffect } from 'react'

export function Modal({ children }: { children: ReactNode }) {
  const router = useRouter()
  const dialogRef = useRef<ElementRef<'dialog'>>(null)

  useEffect(() => {
    if (!dialogRef.current?.open) {
      dialogRef.current?.showModal()
    }
  }, [])

  return (
    <Box
      id="modal-child"
      component="div"
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999,
      }}
    >
      <Box
        component="dialog"
        sx={{ borderRadius: 5, overflow: 'visible' }}
        ref={dialogRef}
        onClose={() => router.back()}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'end',
            alignItems: 'center',
          }}
        >
          <IconButton onClick={() => dialogRef.current?.close()}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            width: '100%',
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  )
}
