'use client'
import { Project } from '@/lib/definitions'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import { deleteProject } from './action'
import { useFormState, useFormStatus } from 'react-dom'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import LoadingButton from '@mui/lab/LoadingButton'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'

type Props = {
  project: Project
}

export function DeleteForm({ project }: Props) {
  const router = useRouter()
  const deleteAction = deleteProject.bind(null, project.id)
  const [state, action] = useFormState(deleteAction, undefined)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!!state?.message) {
      setOpen(true)
    }
  }, [state])

  return (
    <Container maxWidth="xl" sx={{ pt: 4 }}>
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
            <AlertTitle>Delete Failed!</AlertTitle>
            {state.message}
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
        }}
      >
        <Typography variant="h4" component="h1">
          Delete {project.title} project ?
        </Typography>
        <Typography variant="body1" component={'p'}>
          All project data will be lost permanently!
        </Typography>
      </Box>
      <Box
        sx={{ display: 'flex', justifyContent: 'end', gap: 2, width: '100%' }}
        component={'form'}
        action={action}
      >
        <Button
          variant="contained"
          onClick={(e) => {
            e.preventDefault()
            router.push('/dashboard')
          }}
        >
          Cancel
        </Button>
        <DeleteButton />
      </Box>
    </Container>
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
