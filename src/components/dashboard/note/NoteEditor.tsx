'use client';

import { useEffect, useRef } from 'react';
import { useCreateBlockNote } from '@blocknote/react';
import { BlockNoteView } from '@blocknote/mantine';
import { multiColumnDropCursor } from '@blocknote/xl-multi-column';
import { noteSchema } from '@/components/note/noteSchema';
import '@blocknote/core/fonts/inter.css';
import '@blocknote/mantine/style.css';
import '@/components/note/notePaletteNotion.css';

// Suppress known BlockNote multi-column drag errors in dev (BlockNote 0.50 bug — surfaces only as
// overlay noise; the editor keeps working after the throw).
if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
  const SUPPRESSED = /Block with ID [a-f0-9]+ not found|getBlock.*not found/i;
  window.addEventListener(
    'error',
    (e) => {
      if (e.message && SUPPRESSED.test(e.message)) {
        e.stopImmediatePropagation();
        e.preventDefault();
      }
    },
    true
  );
  window.addEventListener(
    'unhandledrejection',
    (e) => {
      const msg = e.reason?.message || String(e.reason || '');
      if (SUPPRESSED.test(msg)) {
        e.stopImmediatePropagation();
        e.preventDefault();
      }
    },
    true
  );
}

async function uploadFileToR2(file: File): Promise<string> {
  const presign = await fetch('/api/dashboard/n/upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      filename: file.name,
      contentType: file.type || 'application/octet-stream',
      size: file.size,
    }),
  });
  if (!presign.ok) {
    const data = await presign.json().catch(() => ({}));
    throw new Error(data?.error || 'Error firmando upload');
  }
  const { uploadUrl, key } = (await presign.json()) as { uploadUrl: string; key: string };

  const put = await fetch(uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': file.type || 'application/octet-stream' },
    body: file,
  });
  if (!put.ok) {
    throw new Error(`R2 upload falló: ${put.status}`);
  }

  return `/api/n/media/${key}`;
}

export interface NoteEditorProps {
  initialBlocks: unknown[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: (blocks: any[]) => void;
}

export function NoteEditor({ initialBlocks, onChange }: NoteEditorProps) {
  const editor = useCreateBlockNote({
    schema: noteSchema,
    initialContent:
      Array.isArray(initialBlocks) && initialBlocks.length > 0
        ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (initialBlocks as any)
        : undefined,
    uploadFile: uploadFileToR2,
    dropCursor: multiColumnDropCursor,
  });

  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  return (
    <div className="note-editor">
      <BlockNoteView
        editor={editor}
        theme="dark"
        onChange={() => {
          onChangeRef.current(editor.document);
        }}
      />
    </div>
  );
}
