import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined'
import DeleteIcon from '@mui/icons-material/Delete'
import Link from 'next/link'
import { getProjectBySlug } from '@/app/dashboard/data'
import Typography from '@mui/material/Typography'

export default async function DetailProjectPage({
  params,
}: {
  params: { slug: string }
}) {
  console.log('render detail project')
  const { data: project } = await getProjectBySlug(params.slug)
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
        <IconButton
          LinkComponent={Link}
          href={`${params.slug}/edit`}
          size="large"
        >
          <EditNoteOutlinedIcon />
        </IconButton>
        <IconButton
          color="error"
          LinkComponent={Link}
          href={`${params.slug}/delete`}
          size="large"
        >
          <DeleteIcon />
        </IconButton>
      </Box>
      <Box sx={{ padding: '10px 50px' }}>
        <Box>
          <Typography variant="h3" fontWeight="700">
            {project.icon}
          </Typography>
          <Typography
            sx={{
              fontSize: '2rem',
              fontWeight: '700',
            }}
          >
            {project.title}
          </Typography>
          {project.description && (
            <Typography
              sx={{
                pl: 1,
                fontSize: '0.8rem',
                whiteSpace: 'pre-line',
              }}
            >
              {project.description}
            </Typography>
          )}
        </Box>
      </Box>
    </>
  )
}
