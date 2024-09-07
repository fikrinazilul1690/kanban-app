'use client'
import LoadingButton from '@mui/lab/LoadingButton'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Alert from '@mui/material/Alert'
import { useFormState, useFormStatus } from 'react-dom'
import { signup } from './actions'
import { useState } from 'react'

export function SignUpForm() {
  const [state, action] = useFormState(signup, undefined)
  const [open, setOpen] = useState(true)
  return (
    <>
      {!!state?.message && open && (
        <Alert
          severity={state.success ? 'success' : 'error'}
          variant="standard"
          onClose={() => setOpen(false)}
        >
          <strong>{state.message}</strong>
        </Alert>
      )}
      <Box component="form" action={action} sx={{ mt: 1 }} noValidate>
        <TextField
          margin="normal"
          required
          fullWidth
          id="name"
          label="Name"
          name="name"
          variant="outlined"
          type="text"
          error={state?.errors ? !!state.errors['name'] : false}
          helperText={
            state?.errors
              ? state.errors['name']?.map((val, idx) => (
                <span key={idx}>{val}</span>
              ))
              : undefined
          }
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email"
          name="email"
          variant="outlined"
          type="email"
          error={state?.errors ? !!state.errors['email'] : false}
          helperText={
            state?.errors
              ? state.errors['email']?.map((val, idx) => (
                <span key={idx}>{val}</span>
              ))
              : undefined
          }
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="password"
          label="Password"
          name="password"
          variant="outlined"
          type="password"
          error={
            state?.errors
              ? !!(
                state.errors!['password'] || state.errors!['confirmPassword']
              )
              : false
          }
          helperText={
            state?.errors
              ? state.errors['password']?.map((val, idx) => (
                <span key={idx}>{val}</span>
              ))
              : undefined
          }
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="confirmPassword"
          label="Confirm Password"
          name="confirmPassword"
          variant="outlined"
          type="password"
          error={
            state?.errors
              ? !!(
                state.errors!['password'] || state.errors!['confirmPassword']
              )
              : false
          }
          helperText={
            state?.errors
              ? state.errors['confirmPassword']?.map((val, idx) => (
                <span key={idx}>{val}</span>
              ))
              : undefined
          }
        />
        <SignUpButton />
      </Box>
    </>
  )
}

export function SignUpButton() {
  const { pending } = useFormStatus()
  return (
    <LoadingButton
      sx={{ mt: 3, mb: 2 }}
      variant="contained"
      type="submit"
      fullWidth
      loading={pending}
    >
      Sign Up
    </LoadingButton>
  )
}
