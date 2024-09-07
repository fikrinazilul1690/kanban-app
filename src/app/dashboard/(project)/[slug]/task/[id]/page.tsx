import { getTask } from '@/app/dashboard/data'
import { isBigInt } from '@/lib/bigint'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'
import dynamic from 'next/dynamic'
import { notFound } from 'next/navigation'
import { MenuAction } from './menu'

const ReadOnlyEditor = dynamic(
  async () => (await import('@/app/dashboard/editor')).ReadOnlyEditor,
  {
    ssr: false,
    loading: () => (
      <Skeleton
        sx={{
          width: '100%',
          height: '50vh',
          WebkitTransform: 'none',
        }}
      />
    ),
  }
)

export default async function DetailTask({
  params,
}: {
  params: { slug: string; id: string }
}) {
  const { slug, id } = params
  if (!isBigInt(id)) {
    notFound()
  }
  const { data: task } = await getTask(id, slug)

  return (
    <Container maxWidth={'xl'}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'start',
          marginY: 3,
        }}
      >
        <Box>
          <Typography
            variant="body1"
            fontWeight={500}
            component={'span'}
            color={task.status.color}
          >
            {task.status.name}
          </Typography>
          <Typography variant="h2" fontWeight={700} component={'h1'}>
            {task.subject}
          </Typography>
        </Box>
        <MenuAction taskId={id} />
      </Box>
      <Typography variant="body1" color="text.secondary" component={'h2'}>
        Description :
      </Typography>
      <ReadOnlyEditor content={task.description ?? 'No Description'} />
    </Container>
  )
}
