'use client'
import Underline from '@tiptap/extension-underline'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import TextAlign from '@tiptap/extension-text-align'
import Placeholder from '@tiptap/extension-placeholder'
import StarterKit from '@tiptap/starter-kit'

import {
  MenuButtonBlockquote,
  MenuButtonBold,
  MenuButtonBulletedList,
  MenuButtonItalic,
  MenuButtonOrderedList,
  MenuButtonRedo,
  MenuButtonStrikethrough,
  MenuButtonSubscript,
  MenuButtonSuperscript,
  MenuButtonTaskList,
  MenuButtonUnderline,
  MenuButtonUndo,
  MenuControlsContainer,
  MenuDivider,
  MenuSelectHeading,
  MenuSelectTextAlign,
  RichTextEditor,
  RichTextReadOnly,
  RichTextEditorRef,
} from 'mui-tiptap'
import { Dispatch, SetStateAction, useMemo, useRef } from 'react'
import Box from '@mui/material/Box'
import { EditorOptions } from '@tiptap/react'

type Props = {
  content?: string | null
  name?: string
  modal?: boolean
  onBlur: Dispatch<SetStateAction<string | undefined>>
  container?: () => HTMLElement | null
}

type UseExtensionsOptions = {
  /** Placeholder hint to show in the text input area before a user types a message. */
  placeholder?: string
}

const CustomSubscript = Subscript.extend({
  excludes: 'superscript',
})
const CustomSuperscript = Superscript.extend({
  excludes: 'subscript',
})

export function useExtensions({
  placeholder,
}: UseExtensionsOptions = {}): EditorOptions['extensions'] {
  return useMemo(() => {
    return [
      StarterKit,
      CustomSubscript,
      CustomSuperscript,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Placeholder.configure({
        placeholder,
      }),
      Underline,
    ]
  }, [placeholder])
}

export default function Editor({ content, modal, onBlur, container }: Props) {
  const rteRef = useRef<RichTextEditorRef>(null)
  const extensions = useExtensions({ placeholder: 'Description' })
  console.log('container : ', container)

  return (
    <Box
      sx={{
        '& .ProseMirror': {
          '& ul, & ol': {
            padding: '0 1rem',
            margin: '1.25rem 1rem 1.25rem 0.4rem',
          },
        },
        maxHeight: modal ? '300px' : '600px',
        width: modal ? '700px' : undefined,
        overflowY: 'auto',
      }}
    >
      <RichTextEditor
        ref={rteRef}
        extensions={extensions}
        content={content}
        // Optionally include `renderControls` for a menu-bar atop the editor:
        renderControls={() => (
          <MenuControlsContainer>
            <MenuSelectHeading
              MenuProps={{
                container,
              }}
            />
            <MenuDivider />
            <MenuButtonBold />
            <MenuButtonItalic />
            <MenuButtonUnderline />
            <MenuButtonStrikethrough />
            <MenuButtonSubscript />
            <MenuButtonSuperscript />
            <MenuDivider />
            <MenuSelectTextAlign
              MenuProps={{
                container,
              }}
            />
            <MenuDivider />
            <MenuButtonOrderedList />
            <MenuButtonBulletedList />
            <MenuButtonTaskList />
            <MenuDivider />
            <MenuButtonBlockquote />
            <MenuDivider />
            <MenuButtonUndo />
            <MenuButtonRedo />
          </MenuControlsContainer>
        )}
        onBlur={(e) => {
          if (e.editor.getText() !== '') {
            onBlur(e.editor.getHTML())
            return
          }
          onBlur(undefined)
        }}
        RichTextFieldProps={{
          variant: 'outlined',
        }}
      />
    </Box>
  )
}

export function ReadOnlyEditor({ content }: Pick<Props, 'content'>) {
  const extensions = useExtensions()
  return (
    <Box
      sx={{
        '& .ProseMirror': {
          '& ul, & ol': {
            padding: '0 1rem',
            margin: '1.25rem 1rem 1.25rem 0.4rem',
          },
        },
      }}
    >
      <RichTextReadOnly content={content} extensions={extensions} />
    </Box>
  )
}
