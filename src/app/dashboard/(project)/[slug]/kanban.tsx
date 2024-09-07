import Divider from '@mui/material/Divider'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { getBoard } from '../../data'
import { BoardClient } from './board.client'
import { Project } from '@/lib/definitions'
import Link from 'next/link'

type Props = {
  project: Project
}

export default async function Kanban({ project }: Props) {
  const { data: sections } = await getBoard(project.id)
  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <Button LinkComponent={Link} href={`/dashboard/${project.slug}/status`}>
          Add section
        </Button>
        <Typography variant="body2" fontWeight="700">
          {sections.length} Sections
        </Typography>
      </Box>
      <Divider sx={{ margin: '10px 0' }} />
      <BoardClient sections={sections} project={project} />
    </>
  )
}
