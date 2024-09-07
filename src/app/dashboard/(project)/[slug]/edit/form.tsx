'use client'
import LoadingButton from '@mui/lab/LoadingButton'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Alert from '@mui/material/Alert'
import { editProject } from './actions'
import { useState } from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import { EmojiPicker } from '../../emoji-picker'
import { Project } from '@/lib/definitions'
import Snackbar from '@mui/material/Snackbar'

type Props = {
  project: Project
}

export function EditProjectForm({ project }: Props) {
  const edit = editProject.bind(null, project.id)
  const [state, action] = useFormState(edit, undefined)
  const [open, setOpen] = useState(true)
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
            flexDirection: 'row-reverse',
          }}
        >
          <EmojiPicker state={state} emoji={project.icon} />
          <TextField
            margin="normal"
            required
            fullWidth
            id="title"
            label="Title"
            name="title"
            variant="outlined"
            type="text"
            defaultValue={project.title}
            error={state?.errors ? !!state.errors['title'] : false}
            helperText={
              state?.errors
                ? state.errors['title']?.map((val, idx) => (
                    <span key={idx}>{val}</span>
                  ))
                : undefined
            }
          />
        </Box>
        <TextField
          margin="normal"
          fullWidth
          multiline
          id="description"
          label="Description"
          name="description"
          variant="outlined"
          type="text"
          defaultValue={project.description}
          error={state?.errors ? !!state.errors['text'] : false}
          helperText={
            state?.errors
              ? state.errors['text']?.map((val, idx) => (
                  <span key={idx}>{val}</span>
                ))
              : undefined
          }
        />
        <Submit />
      </Box>
    </>
  )
}

export function Submit() {
  const { pending } = useFormStatus()

  return (
    <LoadingButton
      sx={{ mt: 3, mb: 2 }}
      variant="contained"
      type="submit"
      fullWidth
      loading={pending}
    >
      Submit
    </LoadingButton>
  )
}
