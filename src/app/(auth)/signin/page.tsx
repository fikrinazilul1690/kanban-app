import Button from '@mui/material/Button'
import Link from 'next/link'
import { SignInForm } from './form'
import Typography from '@mui/material/Typography'

export default function SignInPage() {
  return (
    <>
      <Typography variant="h3" component="h1">
        Sign In
      </Typography>
      <SignInForm />
      <Button
        LinkComponent={Link}
        sx={{
          textTransform: 'none',
        }}
        href="/signup"
      >
        Don&apos;t have an account? Sign Up
      </Button>
    </>
  )
}
