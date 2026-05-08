'use client';

import { useCreateBlockNote } from '@blocknote/react';
import { BlockNoteView } from '@blocknote/mantine';
import { noteSchema } from './noteSchema';
import '@blocknote/core/fonts/inter.css';
import '@blocknote/mantine/style.css';

export function NoteRenderer({ blocks }: { blocks: unknown[] }) {
  const editor = useCreateBlockNote({
    schema: noteSchema,
    initialContent:
      Array.isArray(blocks) && blocks.length > 0
        ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (blocks as any)
        : undefined,
  });

  return (
    <BlockNoteView
      editor={editor}
      editable={false}
      theme="dark"
      slashMenu={false}
      sideMenu={false}
      formattingToolbar={false}
      linkToolbar={false}
      filePanel={false}
      tableHandles={false}
    />
  );
}
