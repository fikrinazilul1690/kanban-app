import { Tasks, TaskStatus } from '@/lib/definitions'
import {
  AnimateLayoutChanges,
  defaultAnimateLayoutChanges,
  useSortable,
} from '@dnd-kit/sortable'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import DeleteIcon from '@mui/icons-material/Delete'
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined'
import { CSS } from '@dnd-kit/utilities'
import { forwardRef, memo } from 'react'
import Link from 'next/link'

type Props = ContainerProps & {
  disabled?: boolean
  id: string
  tasks: Tasks
  projectSlug: string
}

const animateLayoutChanges: AnimateLayoutChanges = (args) =>
  defaultAnimateLayoutChanges({ ...args, wasDragging: true })

export function DroppableContainer({
  children,
  disabled,
  id,
  tasks,
  style,
  status,
  projectSlug,
  ...props
}: Props) {
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    transition,
    transform,
  } = useSortable({
    id,
    data: {
      type: 'container',
      children: tasks,
    },
    animateLayoutChanges,
  })

  return (
    <Container
      projectSlug={projectSlug}
      ref={disabled ? undefined : setNodeRef}
      style={{
        ...style,
        transition,
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.5 : undefined,
      }}
      status={status}
      {...props}
      handleProps={{
        ...attributes,
        ...listeners,
      }}
    >
      {children}
    </Container>
  )
}

type ContainerProps = {
  children: React.ReactNode
  handleProps?: React.HTMLAttributes<any>
  style?: React.CSSProperties
  status: TaskStatus
  projectSlug: string
}

export const Container = memo(
  forwardRef<HTMLElement, ContainerProps>(
    ({ children, style, status, handleProps, projectSlug }, ref) => {
      return (
        <Box
          sx={{
            width: '275px',
            padding: '10px',
            marginRight: '10px',
            height: '570px',
            overflowY: 'auto',
            flexShrink: 0,
            ...style,
          }}
          ref={ref}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '10px',
            }}
          >
            <Typography
              sx={{
                flexGrow: 1,
                fontWeight: 700,
                color: status.color,
              }}
            >
              {status.name}
            </Typography>
            <IconButton
              size="small"
              sx={{
                color: 'gray',
                '&:hover': { color: 'green' },
              }}
              LinkComponent={Link}
              href={`${projectSlug}/task?statusId=${status.id}`}
            >
              <AddOutlinedIcon />
            </IconButton>
            <IconButton
              size="small"
              sx={{
                color: 'gray',
                '&:hover': { color: 'orange' },
              }}
              LinkComponent={Link}
              href={`${projectSlug}/status/${status.id}/edit`}
            >
              <BorderColorOutlinedIcon />
            </IconButton>
            <IconButton
              size="small"
              sx={{
                color: 'gray',
                '&:hover': { color: 'red' },
              }}
              LinkComponent={Link}
              href={`${projectSlug}/status/${status.id}/delete`}
            >
              <DeleteIcon />
            </IconButton>
            <Box
              component={IconButton}
              sx={{ cursor: 'grab' }}
              size="small"
              {...handleProps}
            >
              <DragIndicatorIcon />
            </Box>
          </Box>
          {children}
        </Box>
      )
    }
  )
)
