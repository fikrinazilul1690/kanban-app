import Box from '@mui/material/Box'
import { useRef, useState } from 'react'
import Picker from '@emoji-mart/react'
import IconButton from '@mui/material/IconButton'
import AddReactionOutlinedIcon from '@mui/icons-material/AddReactionOutlined'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputAdornment from '@mui/material/InputAdornment'
import { FormState } from '@/lib/definitions'
import FormHelperText from '@mui/material/FormHelperText'

type Props = {
  state: FormState
  emoji?: string
}

export function EmojiPicker({ state, emoji }: Props) {
  const [isShowPicker, setIsShowPicker] = useState(false)
  const [icon, setIcon] = useState(emoji ?? '')
  const inputRef = useRef<HTMLInputElement | null>(null)
  const emojiRef = useRef<boolean>(false)
  const error = state?.errors ? !!state.errors['icon'] : false

  const selectEmoji = (e: { native: string }) => {
    emojiRef.current = false
    setIcon(e.native)
  }

  return (
    <Box component={'div'} sx={{ position: 'relative', width: 'max-content' }}>
      <FormControl variant="outlined" margin="normal">
        <InputLabel htmlFor="outlined-adornment-password">Icon</InputLabel>
        <OutlinedInput
          id="icon"
          name="icon"
          value={icon}
          autoComplete="off"
          onChange={(e) => {
            const value = e.target.value
            if (value === '') {
              setIcon('')
            }
          }}
          inputRef={inputRef}
          onFocus={() => setIsShowPicker(true)}
          onBlur={() => {
            if (!emojiRef.current) {
              setIsShowPicker(false)
            }
          }}
          label={'Icon'}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                onClick={() => {
                  if (document.activeElement === inputRef.current) {
                    inputRef.current?.blur()
                    return
                  }
                  inputRef.current?.focus()
                }}
                onMouseDown={(e) => e.preventDefault()}
                size="large"
                edge="end"
              >
                <AddReactionOutlinedIcon />
              </IconButton>
            </InputAdornment>
          }
          error={error}
        />
        {!!state?.errors && (
          <FormHelperText error={error}>
            {state?.errors
              ? state.errors['icon']?.map((val, idx) => (
                <span key={idx}>{val}</span>
              ))
              : undefined}
          </FormHelperText>
        )}
      </FormControl>
      <Box
        component={'div'}
        onMouseEnter={() => {
          emojiRef.current = true
          inputRef.current?.focus()
        }}
        onMouseLeave={() => {
          if (document.activeElement === inputRef.current) {
            emojiRef.current = false
            return
          }
          setIsShowPicker(false)
        }}
        sx={{
          display: isShowPicker ? 'block' : 'none',
          position: 'absolute',
          top: '100%',
          zIndex: '9999',
        }}
      >
        <Picker theme="light" showPreview={false} onEmojiSelect={selectEmoji} />
      </Box>
    </Box>
  )
}
