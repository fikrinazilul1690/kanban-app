'use client'
import LoadingButton from '@mui/lab/LoadingButton'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Alert from '@mui/material/Alert'
import { useEffect, useRef, useState } from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import Button from '@mui/material/Button'
import { useRouter, useSearchParams } from 'next/navigation'
import { createTask } from './action'
import { Project } from '@/lib/definitions'
import dynamic from 'next/dynamic'
import FormHelperText from '@mui/material/FormHelperText'
import Skeleton from '@mui/material/Skeleton'
import Snackbar from '@mui/material/Snackbar'

type Props = {
  modal?: boolean
  project: Project
}

const Editor = dynamic(() => import('@/app/dashboard/editor'), {
  ssr: false,
  loading: () => (
    <Skeleton
      sx={{
        width: '100%',
        minWidth: '635px',
        margin: 0,
        height: '100px',
        WebkitTransform: 'none',
      }}
    />
  ),
})

export function CreateTaskForm({ modal, project }: Props) {
  const router = useRouter()
  const ref = useRef<HTMLFormElement>(null)
  const searchParams = useSearchParams()
  const statusId = searchParams.get('statusId')
  const createAction = createTask.bind(
    null,
    project.slug,
    project.id,
    statusId ?? undefined
  )
  const [state, action] = useFormState(createAction, undefined)
  const [open, setOpen] = useState(false)
  const [description, setDescription] = useState<string | undefined>(undefined)
  console.log(description)

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
        ref={ref}
        component="form"
        action={(formData) => {
          if (!!description) {
            formData.set('description', description)
          }
          action(formData)
        }}
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
          id="subject"
          label="Subject"
          name="subject"
          variant="outlined"
          type="text"
          error={state?.errors ? !!state.errors['subject'] : false}
          helperText={
            state?.errors
              ? state.errors['subject']?.map((val, idx) => (
                  <span key={idx}>{val}</span>
                ))
              : undefined
          }
        />

        <Box marginTop={'16px'} marginBottom={'8px'}>
          <Editor
            modal={modal}
            container={() => ref.current}
            onBlur={setDescription}
          />
          {!!state?.errors && (
            <FormHelperText
              sx={{
                marginX: '14px',
                marginTop: '3px',
              }}
              error={state?.errors ? !!state.errors['description'] : false}
            >
              {state?.errors
                ? state.errors['description']?.map((val, idx) => (
                    <span key={idx}>{val}</span>
                  ))
                : undefined}
            </FormHelperText>
          )}
        </Box>
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

export function Submit({ modal }: Omit<Props, 'project'>) {
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
