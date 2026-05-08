import { BlockNoteSchema, defaultBlockSpecs } from '@blocknote/core';
import { withMultiColumn } from '@blocknote/xl-multi-column';

export const noteSchema = withMultiColumn(
  BlockNoteSchema.create({
    blockSpecs: { ...defaultBlockSpecs },
  })
);
