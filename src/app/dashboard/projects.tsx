import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import Typography from '@mui/material/Typography'
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined'
import AddIcon from '@mui/icons-material/Add'
import { getProjects } from './data'
import Link from 'next/link'
import { Suspense } from 'react'
import Skeleton from '@mui/material/Skeleton'
import ListItem from '@mui/material/ListItem'
import { ProjectLink } from './project-link'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'

type Props = {
  sidebarWidth?: number
}

export function ProjectsContainer() {
  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        gap: 3,
      }}
    >
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="h5" fontWeight="700">
          Your Projects
        </Typography>
        <IconButton LinkComponent={Link} href="/dashboard/create">
          <AddBoxOutlinedIcon fontSize="medium" />
        </IconButton>
      </Box>
      <Suspense fallback={<ProjectsSkeleton />}>
        <Projects divider={true} />
      </Suspense>
    </Box>
  )
}

export function ProjectsSkeleton({ sidebarWidth }: Props) {
  return (
    <List
      disablePadding
      sx={{
        width: sidebarWidth ?? '100%',
        ...(!sidebarWidth && {
          overflowY: 'auto',
          borderColor: 'whitesmoke',
          borderWidth: 1,
          borderRadius: 2,
          padding: 2,
          backgroundColor: '#f9fafb',
          maxHeight: '70vh',
        }),
      }}
    >
      {[...Array(5)].map((_val, idx) => (
        <ListItem key={idx}>
          <Skeleton variant="rounded" height={'31px'} width="100%" />
        </ListItem>
      ))}
    </List>
  )
}

export async function Projects({
  divider,
  sidebarWidth,
}: Props & { divider?: boolean }) {
  const { data: projects } = await getProjects()
  if (projects.length === 0)
    return !sidebarWidth ? (
      <Card
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: 'whitesmoke',
        }}
      >
        <CardContent
          sx={{
            textAlign: 'center',
          }}
        >
          <Typography variant="h5" color="text.secondary" component="div">
            No Project yet.
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            Do you want to create one ?
          </Typography>
        </CardContent>
        <CardActions>
          <Button
            startIcon={<AddIcon />}
            LinkComponent={Link}
            href="/dashboard/create"
            size="small"
            variant="contained"
          >
            Create
          </Button>
        </CardActions>
      </Card>
    ) : (
      <Box
        sx={{
          p: 5,
        }}
      >
        <Typography variant="h5" color="white" component="div">
          No Project yet.
        </Typography>
      </Box>
    )
  return (
    <List
      disablePadding
      sx={{
        width: sidebarWidth ?? '100%',
        ...(!sidebarWidth && {
          overflowY: 'auto',
          borderColor: 'whitesmoke',
          borderWidth: 1,
          borderRadius: 2,
          padding: 2,
          backgroundColor: '#f9fafb',
          maxHeight: '70vh',
        }),
      }}
    >
      {projects.map((project, index) => (
        <ListItem key={index} divider={divider}>
          <ProjectLink project={project} />
        </ListItem>
      ))}
    </List>
  )
}
