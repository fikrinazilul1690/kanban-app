'use client'

import { Project } from '@/lib/definitions'
import Box from '@mui/material/Box'
import LoadingButton from '@mui/lab/LoadingButton'
import Typography from '@mui/material/Typography'
import { useFormState, useFormStatus } from 'react-dom'
import { useEffect, useState } from 'react'
import { deleteProject } from '@/app/dashboard/(project)/[slug]/delete/action'
import Alert from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'
import AlertTitle from '@mui/material/AlertTitle'

type Props = {
  project: Project
}

export function DeleteForm({ project }: Props) {
  const deleteAction = deleteProject.bind(null, project.id)
  const [state, action] = useFormState(deleteAction, undefined)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!!state?.message) {
      setOpen(true)
    }
  }, [state])

  return (
    <Box p={4}>
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
          alignItems: 'center',
          gap: 3,
          pb: 4,
          px: 3,
        }}
      >
        <Typography variant="h4" component="h1">
          Delete project &quot;{project.title}&quot; ?
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
        <DeleteButton />
      </Box>
    </Box>
  )
}

function DeleteButton() {
  const { pending } = useFormStatus()
  return (
    <LoadingButton type="submit" color="error" loading={pending}>
      Delete
    </LoadingButton>
  )
}
