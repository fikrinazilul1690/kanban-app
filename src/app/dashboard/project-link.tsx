'use client'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { Project } from '@/lib/definitions'
import Link from 'next/link'
import { useSelectedLayoutSegment } from 'next/navigation'

type Props = {
  project: Project
}

export function ProjectLink({ project }: Props) {
  const segment = useSelectedLayoutSegment()
  const isActive = segment === project.slug
  return (
    <Button
      component={Link}
      href={`/dashboard/${project.slug}`}
      sx={{
        textTransform: 'none',
        justifyContent: 'start',
      }}
      color={isActive ? 'secondary' : 'inherit'}
      variant={isActive ? 'contained' : undefined}
      fullWidth
    >
      <Typography
        variant="body2"
        fontWeight="700"
        sx={{
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {project.icon} {project.title}
      </Typography>
    </Button>
  )
}
