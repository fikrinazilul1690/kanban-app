'use client'
import { TaskStatuses } from '@/lib/definitions'
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import { useRef } from 'react'

type Props = {
  statuses: TaskStatuses
  defaultValue?: string
  fullWidth?: boolean
  labelId?: string
  id?: string
  name?: string
  label?: string
}

export function SelectStatusClient({
  statuses,
  defaultValue,
  fullWidth,
  label,
  labelId,
  ...props
}: Props) {
  const ref = useRef<HTMLElement | null>(null)
  return (
    <Box component={'div'} ref={ref}>
      <FormControl fullWidth={fullWidth} margin="normal">
        <InputLabel id={labelId}>{label}</InputLabel>
        <Select
          {...props}
          label={label}
          defaultValue={defaultValue}
          fullWidth={fullWidth}
          MenuProps={{
            container: () => ref.current,
          }}
        >
          {statuses.map((status) => (
            <MenuItem key={status.id} value={status.id}>
              {status.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  )
}
