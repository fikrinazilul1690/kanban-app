import { DraggableSyntheticListeners } from '@dnd-kit/core'
import { useSortable } from '@dnd-kit/sortable'
import { CSS, Transform } from '@dnd-kit/utilities'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import { forwardRef, memo, useEffect, useState } from 'react'
import { keyframes } from '@emotion/react'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

type Props = {
  subject: string
  disabled?: boolean
  id: string
  isClosed: boolean
}

export function SortableTask({ subject, disabled, id, isClosed }: Props) {
  const { setNodeRef, listeners, isDragging, transform, transition } =
    useSortable({
      id: id,
    })
  const mounted = useMountStatus()
  const mountedWhileDragging = isDragging && !mounted

  return (
    <TaskCard
      id={id}
      ref={disabled ? undefined : setNodeRef}
      value={subject}
      dragging={isDragging}
      transition={transition}
      transform={transform}
      listeners={listeners}
      fadeIn={mountedWhileDragging}
      isClosed={isClosed}
    />
  )
}

type TaskProps = {
  id: string
  dragOverlay?: boolean
  dragging?: boolean
  transform?: Transform | null
  listeners?: DraggableSyntheticListeners
  transition?: string | null
  value: React.ReactNode
  fadeIn?: boolean
  isClosed?: boolean
}

const fadeInFrames = keyframes`
  from {
   opacity: 0;
  }
  to {
    opacity: 1;
  }
`

export const TaskCard = memo(
  forwardRef<HTMLElement, TaskProps>(
    (
      {
        id,
        dragOverlay,
        dragging,
        listeners,
        transition,
        transform,
        value,
        fadeIn,
        isClosed,
      },
      ref
    ) => {
      const pathname = usePathname()
      return (
        <Box ref={ref}>
          <Card
            sx={{
              padding: '10px',
              marginBottom: '10px',
              transition,
              opacity: dragging ? 0.5 : undefined,
              transform: CSS.Translate.toString(transform ?? null),
              animation: fadeIn ? `${fadeInFrames} 500ms ease` : undefined,
              zIndex: dragOverlay ? 999 : undefined,
              cursor: dragOverlay ? 'grab' : 'pointer',
              flexDirection: 'row',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              textDecoration: 'none',
            }}
            component={Link}
            href={`${pathname}/task/${id}`}
          >
            <Typography
              sx={{
                textDecoration: isClosed ? 'line-through' : undefined,
                opacity: isClosed ? 0.7 : undefined,
              }}
            >
              {value}
            </Typography>
            <Box
              component={IconButton}
              sx={{ cursor: 'grab' }}
              size="small"
              {...listeners}
            >
              <DragIndicatorIcon />
            </Box>
          </Card>
        </Box>
      )
    }
  )
)

function useMountStatus() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => setIsMounted(true), 500)

    return () => clearTimeout(timeout)
  }, [])

  return isMounted
}
