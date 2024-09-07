'use client'
import LoadingButton from '@mui/lab/LoadingButton'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Alert from '@mui/material/Alert'
import { useEffect, useRef, useState } from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import Button from '@mui/material/Button'
import { useRouter } from 'next/navigation'
import { editStatus } from './action'
import { TaskStatus } from '@/lib/definitions'
import { MuiColorInput } from 'mui-color-input'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import Snackbar from '@mui/material/Snackbar'

type Props = {
  modal?: boolean
  projectSlug: string
  status: TaskStatus
}

export function EditStatusForm({ modal, status, projectSlug }: Props) {
  const router = useRouter()
  const [isClosed, setIsClosed] = useState(status.isClosed)
  const containerRef = useRef<HTMLElement | null>(null)
  const editAction = editStatus.bind(null, projectSlug, status.id, isClosed)
  const [state, action] = useFormState(editAction, undefined)
  const [open, setOpen] = useState(false)
  const [color, setColor] = useState(status.color)

  useEffect(() => {
    if (!!state) {
      setOpen(true)
    }
  }, [state])

  return (
    <>
      {!!state?.message && (
        <Snackbar
          open={open}
          autoHideDuration={3000}
          onClose={(_e, reason) => {
            if (reason === 'clickaway') {
              return
            }
            setOpen(false)
          }}
          sx={{ zIndex: 1000 }}
          anchorOrigin={{
            horizontal: 'center',
            vertical: 'top',
          }}
        >
          <Alert
            severity={state.success ? 'success' : 'error'}
            variant="standard"
            onClose={() => setOpen(false)}
          >
            {state.message}
          </Alert>
        </Snackbar>
      )}
      <Box
        component="form"
        action={action}
        ref={containerRef}
        sx={{
          mt: 1,
          width: '100%',
          minWidth: '400px',
        }}
        noValidate
      >
        <TextField
          margin="normal"
          required
          fullWidth
          id="name"
          label="Name"
          name="name"
          variant="outlined"
          type="text"
          defaultValue={status.name}
          error={state?.errors ? !!state.errors['name'] : false}
          helperText={
            state?.errors
              ? state.errors['name']?.map((val, idx) => (
                  <span key={idx}>{val}</span>
                ))
              : undefined
          }
        />
        <MuiColorInput
          format="hex"
          value={color}
          onChange={(value) => setColor(value)}
          fullWidth
          label="Color"
          margin="normal"
          name="color"
          error={state?.errors ? !!state.errors['color'] : false}
          helperText={
            state?.errors
              ? state.errors['color']?.map((val, idx) => (
                  <span key={idx}>{val}</span>
                ))
              : undefined
          }
          PopoverProps={{
            container: () => containerRef.current,
          }}
        />
        <FormControlLabel
          control={
            <Switch
              size="medium"
              checked={isClosed}
              onChange={(e) => setIsClosed(e.target.checked)}
            />
          }
          labelPlacement="start"
          label="Closed"
        />
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            width: '100%',
            justifyContent: 'end',
            alignItems: 'center',
          }}
        >
          {!modal && (
            <Button
              sx={{ mt: 3, mb: 2 }}
              onClick={(e) => {
                e.preventDefault()
                console.log(window.history.length)
                if (window.history.length > 2) {
                  router.back()
                  return
                }
                router.push(`/dashboard/${projectSlug}`)
              }}
            >
              Cancel
            </Button>
          )}
          <Submit modal={modal} />
        </Box>
      </Box>
    </>
  )
}

export function Submit({ modal }: Omit<Props, 'status' | 'projectSlug'>) {
  const { pending } = useFormStatus()

  return (
    <LoadingButton
      sx={{ mt: 3, mb: 2 }}
      variant="contained"
      type="submit"
      fullWidth={modal}
      loading={pending}
    >
      Submit
    </LoadingButton>
  )
}
