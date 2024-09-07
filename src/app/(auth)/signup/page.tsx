import Button from '@mui/material/Button'
import Link from 'next/link'
import { SignUpForm } from './form'
import Typography from '@mui/material/Typography'

export default function SignUpPage() {
  return (
    <>
      <Typography variant="h3" component="h1" sx={{ mb: 2 }}>
        Sign Up
      </Typography>
      <SignUpForm />
      <Button
        LinkComponent={Link}
        sx={{
          textTransform: 'none',
        }}
        href="/signin"
      >
        Already have an account? Sign In
      </Button>
    </>
  )
}
