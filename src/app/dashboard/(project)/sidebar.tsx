import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined'
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined'
import { getUser } from '../data'
import { Suspense } from 'react'
import { Projects, ProjectsSkeleton } from '../projects'
import Link from 'next/link'
import { logout } from '../action'

export async function Sidebar() {
  const sidebarWidth = 250

  const { data: user } = await getUser()

  return (
    <Drawer
      variant="permanent"
      open={true}
      sx={{
        width: sidebarWidth,
        '& > div': { borderRight: 'none' },
      }}
      anchor="left"
    >
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          backgroundColor: '#2563eb',
          color: 'white',
          height: '100vh',
          overflowY: 'hidden',
        }}
      >
        <Box
          sx={{
            width: '90%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mt: 2,
          }}
        >
          <Typography
            component={Link}
            href="/dashboard"
            variant="body2"
            fontWeight="700"
            sx={{
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            {user.name}
          </Typography>
          <Box component={'form'} action={logout}>
            <IconButton type="submit">
              <LogoutOutlinedIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
        <Box
          sx={{
            width: '90%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mt: 5,
          }}
        >
          <Typography variant="body2" fontWeight="700">
            Projects
          </Typography>
          <IconButton LinkComponent={Link} href="/dashboard/create">
            <AddBoxOutlinedIcon fontSize="small" />
          </IconButton>
        </Box>
        <Suspense fallback={<ProjectsSkeleton sidebarWidth={sidebarWidth} />}>
          <Projects sidebarWidth={sidebarWidth} />
        </Suspense>
      </Box>
    </Drawer>
  )
}
