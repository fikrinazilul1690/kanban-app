'use client'
import { TaskStatus } from '@/lib/definitions'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import { deleteStatus } from './action'
import { useFormState, useFormStatus } from 'react-dom'
import { ReactNode, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import LoadingButton from '@mui/lab/LoadingButton'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'

type Props = {
  projectSlug: string
  status: TaskStatus
  renderInput: ReactNode
  modal?: boolean
}

export function DeleteStatusForm({
  projectSlug,
  status,
  renderInput,
  modal,
}: Props) {
  const router = useRouter()
  const deleteAction = deleteStatus.bind(null, projectSlug, status.id)
  const [state, action] = useFormState(deleteAction, undefined)
  const [open, setOpen] = useState(false)
  console.log(open)

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
            variant="standard"
            onClose={() => setOpen(false)}
          >
            <AlertTitle>Delete Failed!</AlertTitle>
            {state.message}
          </Alert>
        </Snackbar>
      )}
      <Box
        sx={{
          px: 3,
        }}
        component={'form'}
        action={action}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            alignItems: modal ? 'center' : undefined,
          }}
        >
          <Typography variant="h4" component="h1">
            Delete status board &quot;{status.name}&quot;
          </Typography>
          <Typography variant="body1" component={'p'}>
            All items with this value will be changed to
          </Typography>
        </Box>
        {renderInput}
        <Box
          sx={{ display: 'flex', justifyContent: 'end', gap: 2, width: '100%' }}
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
                router.push(`/dashboard/${projectSlug}`)
              }}
            >
              Cancel
            </Button>
          )}
          <DeleteButton />
        </Box>
      </Box>
    </>
  )
}

function DeleteButton() {
  const { pending } = useFormStatus()
  return (
    <LoadingButton
      type="submit"
      variant="outlined"
      color="error"
      loading={pending}
    >
      Delete
    </LoadingButton>
  )
}
