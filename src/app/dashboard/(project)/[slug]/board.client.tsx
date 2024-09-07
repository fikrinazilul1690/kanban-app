'use client'
import { Project, TaskStatuses } from '@/lib/definitions'
import Box from '@mui/material/Box'
import {
  closestCenter,
  CollisionDetection,
  defaultDropAnimationSideEffects,
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  DropAnimation,
  getFirstCollision,
  MeasuringStrategy,
  MouseSensor,
  pointerWithin,
  rectIntersection,
  UniqueIdentifier,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import {
  startTransition,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useOptimistic,
  useRef,
  useState,
} from 'react'
import { DroppableContainer, Container } from './droppable-container'
import { SortableTask } from './sortable-task'
import { TaskCard } from './sortable-task'
import dynamic from 'next/dynamic'
import { bulkUpdateTasksOrder, bulkUpdateTaskStatusesOrder } from './actions'

type Props = {
  sections: TaskStatuses
  project: Project
}

const Overlay = dynamic(() => import('./overlay'), { ssr: false })

const dropAnimation: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: '0.5',
      },
    },
  }),
}

export function BoardClient({ sections: statuses, project }: Props) {
  const [optimisticSections, setOptimisticSections] = useOptimistic<
    TaskStatuses,
    TaskStatuses
  >(statuses, (sections, newSections: TaskStatuses) => {
    return newSections
  })

  const [clonedSections, setClonedSections] = useState(optimisticSections)

  const containers = useMemo(
    () => clonedSections.map((section) => section.slug),
    [clonedSections]
  )

  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null)
  const lastOverId = useRef<UniqueIdentifier | null>(null)
  const recentlyMovedToNewContainer = useRef(false)
  console.log(recentlyMovedToNewContainer.current)

  const isSortingContainer = activeId
    ? containers.includes(activeId as string)
    : false

  const collisionDetectionStrategy: CollisionDetection = useCallback(
    (args) => {
      if (
        activeId &&
        !!clonedSections.find((section) => section.slug === activeId)
      ) {
        return closestCenter({
          ...args,
          droppableContainers: args.droppableContainers.filter((container) =>
            clonedSections.find((section) => section.slug === container.id)
          ),
        })
      }

      // Start by finding any intersecting droppable
      const pointerIntersections = pointerWithin(args)
      const intersections =
        pointerIntersections.length > 0
          ? pointerIntersections
          : rectIntersection(args)
      let overId = getFirstCollision(intersections, 'id')

      if (overId != null) {
        const container = clonedSections.find(
          (section) => section.slug === overId
        )
        if (container) {
          const containerTasks = container.tasks

          // If a container is matched and it contains items (columns 'A', 'B', 'C')
          if (containerTasks.length > 0) {
            // Return the closest droppable within that container
            overId = closestCenter({
              ...args,
              droppableContainers: args.droppableContainers.filter(
                (container) =>
                  container.id !== overId &&
                  containerTasks.find((task) => task.id === container.id)
              ),
            })[0]?.id
          }
        }

        lastOverId.current = overId

        return [{ id: overId }]
      }

      // When a draggable item moves to a new container, the layout may shift
      // and the `overId` may become `null`. We manually set the cached `lastOverId`
      // to the id of the draggable item that was moved to the new container, otherwise
      // the previous `overId` will be returned which can cause items to incorrectly shift positions
      if (recentlyMovedToNewContainer.current) {
        lastOverId.current = activeId
      }

      // If no droppable is matched, return the last match
      return lastOverId.current ? [{ id: lastOverId.current }] : []
    },
    [activeId, clonedSections]
  )

  const sensors = useSensors(useSensor(MouseSensor))

  const findContainer = (id: UniqueIdentifier) => {
    return clonedSections.find((section) => {
      if (section.slug === id) {
        return section
      }
      return section.tasks.some((task) => task.id === id)
    })
  }
  const dndId = useId()

  useEffect(() => {
    setClonedSections(optimisticSections)
    requestAnimationFrame(() => {
      recentlyMovedToNewContainer.current = false
    })
  }, [optimisticSections])

  return (
    <DndContext
      id={dndId}
      sensors={sensors}
      collisionDetection={collisionDetectionStrategy}
      measuring={{
        droppable: {
          strategy: MeasuringStrategy.Always,
        },
      }}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDragStart={onDragStart}
      onDragCancel={onDragCancel}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          overflowX: 'auto',
          justifyContent: 'flex-start',
          gap: 3,
        }}
      >
        <SortableContext
          items={containers}
          strategy={horizontalListSortingStrategy}
        >
          {clonedSections.map((section) => {
            return (
              <DroppableContainer
                key={section.slug}
                status={section}
                id={section.slug}
                tasks={section.tasks}
                projectSlug={project.slug}
              >
                <SortableContext
                  items={section.tasks}
                  strategy={verticalListSortingStrategy}
                >
                  {section.tasks.map((task) => {
                    return (
                      <SortableTask
                        disabled={isSortingContainer}
                        key={task.id}
                        id={task.id}
                        subject={task.subject}
                        isClosed={section.isClosed}
                      />
                    )
                  })}
                </SortableContext>
              </DroppableContainer>
            )
          })}
        </SortableContext>
      </Box>
      {
        <Overlay>
          <DragOverlay dropAnimation={dropAnimation}>
            {renderOverlay(activeId)}
          </DragOverlay>
        </Overlay>
      }
    </DndContext>
  )
  function onDragStart({ active }: DragStartEvent) {
    setActiveId(active.id)
  }

  function onDragEnd({ active, over }: DragEndEvent) {
    if (
      clonedSections.find((section) => section.slug === active.id) &&
      over?.id
    ) {
      const activeIndex = clonedSections.findIndex(
        (section) => section.slug === active.id
      )
      const overIndex = clonedSections.findIndex(
        (section) => section.slug === over.id
      )

      const orders = clonedSections.map((status) => status.order)

      const newData = arrayMove(clonedSections, activeIndex, overIndex).map(
        (status, index) => ({ ...status, order: orders[index] })
      )

      if (active.id === over.id) {
        console.log('no changes')
        return
      }

      startTransition(async () => {
        console.log('swap container')
        setOptimisticSections(newData)
        await bulkUpdateTaskStatusesOrder({
          projectId: project.id,
          bulkTaskStatuses: newData.map((status) => ({
            order: status.order,
            statusId: status.id,
          })),
        })
      })
    }

    const activeContainer = findContainer(active.id)

    if (!activeContainer) {
      setActiveId(null)
      return
    }

    const overId = over?.id

    if (overId == null) {
      setActiveId(null)
      return
    }

    const overContainer = findContainer(overId)

    if (overContainer) {
      const activeTasks = activeContainer.tasks
      const overTasks = overContainer.tasks
      const activeIndex = activeTasks.findIndex((task) => task.id === active.id)
      const overIndex = overTasks.findIndex((task) => task.id === overId)

      if (overId === active.id && !recentlyMovedToNewContainer.current) {
        return
      }

      if (overId === active.id && recentlyMovedToNewContainer.current) {
        startTransition(async () => {
          setOptimisticSections(clonedSections)
          await bulkUpdateTasksOrder({
            projectId: project.id,
            statusId: overContainer.id,
            bulkTasks: overTasks.map((task) => task.id),
          })
        })
      }

      if (activeIndex !== overIndex) {
        const tasks = arrayMove(overContainer.tasks, activeIndex, overIndex)
        const newSections = clonedSections.map((section) => {
          if (section.slug === overContainer.slug) {
            return {
              ...section,
              tasks,
            }
          }
          return section
        })
        startTransition(async () => {
          console.log('swap tasks drag end')
          setOptimisticSections(newSections)
          await bulkUpdateTasksOrder({
            projectId: project.id,
            statusId: overContainer.id,
            bulkTasks: tasks.map((task) => task.id),
          })
        })
      }
    }

    setActiveId(null)
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event
    const overId = over?.id
    if (
      overId == null ||
      clonedSections.find((section) => section.slug === active.id)
    ) {
      return
    }

    const overContainer = findContainer(overId)
    const activeContainer = findContainer(active.id)

    if (!overContainer || !activeContainer) {
      return
    }

    if (activeContainer.slug !== overContainer.slug) {
      const activeTasks = activeContainer.tasks.slice()
      const overTasks = overContainer.tasks.slice()
      const overIndex = overTasks.findIndex((task) => task.id === overId)
      const activeIndex = activeTasks.findIndex((task) => task.id === active.id)

      let newIndex: number

      if (clonedSections.find((section) => section.slug === overId)) {
        newIndex = overTasks.length + 1
      } else {
        const isBelowOverItem =
          over &&
          active.rect.current.translated &&
          active.rect.current.translated.top > over.rect.top + over.rect.height

        const modifier = isBelowOverItem ? 1 : 0

        newIndex = overIndex >= 0 ? overIndex + modifier : overTasks.length + 1
      }

      const newSections = clonedSections.map((section) => {
        if (activeContainer.slug === section.slug) {
          return {
            ...section,
            tasks: activeContainer.tasks.filter(
              (task) => task.id !== active.id
            ),
          }
        }

        if (overContainer.slug === section.slug) {
          return {
            ...section,
            tasks: [
              ...section.tasks.slice(0, newIndex),
              activeTasks[activeIndex],
              ...overTasks.slice(newIndex, overTasks.length),
            ],
          }
        }

        return section
      })

      recentlyMovedToNewContainer.current = true
      setClonedSections(newSections)
    }
  }

  function onDragCancel() {
    setActiveId(null)
    setClonedSections(optimisticSections)
    recentlyMovedToNewContainer.current = false
  }

  function renderOverlay(id: UniqueIdentifier | null) {
    if (!id) {
      return null
    }
    const activeContainer = findContainer(id)
    if (!activeContainer) {
      return null
    }
    const task = activeContainer.tasks.find((task) => task.id === id)
    if (!task) {
      return (
        <Container status={activeContainer} projectSlug={project.slug}>
          {activeContainer.tasks.map((item) => (
            <TaskCard id={item.id} key={item.id} value={item.subject} />
          ))}
        </Container>
      )
    }
    return <TaskCard id={task.id} value={task.subject} dragOverlay />
  }
}
