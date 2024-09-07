'use client'
import LoadingButton from '@mui/lab/LoadingButton'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Alert from '@mui/material/Alert'
import { createProject } from './actions'
import { useEffect, useState } from 'react'
import { EmojiPicker } from '../emoji-picker'
import { useFormState, useFormStatus } from 'react-dom'
import Button from '@mui/material/Button'
import { useRouter } from 'next/navigation'
import Snackbar from '@mui/material/Snackbar'

type Props = {
  modal?: boolean
}

export function CreateProjectForm({ modal }: Props) {
  const router = useRouter()
  const [state, action] = useFormState(createProject, undefined)
  const [open, setOpen] = useState(false)

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
            variant="outlined"
            onClose={() => setOpen(false)}
          >
            <strong>{state.message}</strong>
          </Alert>
        </Snackbar>
      )}
      <Box
        component="form"
        action={action}
        sx={{ mt: 1, width: '100%' }}
        noValidate
      >
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            justifyContent: 'center',
            alignItems: 'start',
            flexDirection: modal ? 'row-reverse' : 'row',
          }}
        >
          <EmojiPicker state={state} />
          <TextField
            margin="normal"
            required
            fullWidth
            id="title"
            label="Title"
            name="title"
            variant="outlined"
            type="text"
            error={state?.errors ? !!state.errors['title'] : false}
            helperText={
              state?.errors
                ? state.errors['title']?.map((val, idx) => (
                    <span key={idx}>{val}</span>
                  ))
                : undefined
            }
          />
        </Box>{' '}
        <TextField
          margin="normal"
          fullWidth
          multiline
          id="description"
          label="Description"
          name="description"
          variant="outlined"
          type="text"
          error={state?.errors ? !!state.errors['description'] : false}
          helperText={
            state?.errors
              ? state.errors['description']?.map((val, idx) => (
                  <span key={idx}>{val}</span>
                ))
              : undefined
          }
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
                router.push('/dashboard')
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

export function Submit({ modal }: Props) {
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
