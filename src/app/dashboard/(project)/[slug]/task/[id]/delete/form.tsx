'use client'
import { Task } from '@/lib/definitions'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { deleteTask } from './action'
import { useFormState, useFormStatus } from 'react-dom'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import LoadingButton from '@mui/lab/LoadingButton'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'

type Props = {
  projectSlug: string
  task: Task
  modal?: boolean
}

export function DeleteTaskForm({ task, modal, projectSlug }: Props) {
  const router = useRouter()
  const deleteAction = deleteTask.bind(null, task.id, projectSlug)
  const [state, action] = useFormState(deleteAction, undefined)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!!state?.message) {
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
            onClose={() => setOpen(false)}
          >
            Delete Failed!
            <br />
            <strong>{state.message}</strong>
          </Alert>
        </Snackbar>
      )}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          pb: 4,
          px: 3,
          alignItems: modal ? 'center' : undefined,
        }}
      >
        <Typography variant="h4" component="h1">
          Delete task &quot;{task.subject}&quot;
        </Typography>
        <Typography variant="body1" component={'p'}>
          this task will be lost permanently!
        </Typography>
      </Box>
      <Box
        sx={{ display: 'flex', justifyContent: 'end', gap: 2, width: '100%' }}
        component={'form'}
        action={action}
      >
        {!modal && (
          <Button
            variant="contained"
            onClick={(e) => {
              e.preventDefault()
              console.log(window.history.length)
              if (window.history.length > 2) {
                router.back()
                return
              }
              router.push(`/dashboard/tasks/${task.id}`)
            }}
          >
            Cancel
          </Button>
        )}
        <DeleteButton modal={modal} />
      </Box>
    </>
  )
}

function DeleteButton({ modal }: Pick<Props, 'modal'>) {
  const { pending } = useFormStatus()
  return (
    <LoadingButton
      type="submit"
      variant={modal ? 'text' : 'outlined'}
      color="error"
      loading={pending}
    >
      Delete
    </LoadingButton>
  )
}
