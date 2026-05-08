import { notFound } from 'next/navigation';
import { findNotePageBySlug } from '@/lib/mongodb/models/NotePage';
import { isNoteAuthedServer } from '@/lib/auth/note-server';
import { NoteRenderer } from '@/components/note/NoteRenderer';
import { NotePasswordForm } from '../NotePasswordForm';

export const dynamic = 'force-dynamic';

export default async function NoteSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  if (!(await isNoteAuthedServer())) {
    return <NotePasswordForm />;
  }

  const { slug } = await params;
  const page = await findNotePageBySlug(slug);

  if (!page || !page.enabled) {
    notFound();
  }

  return (
    <article className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-light text-gray-100 mb-10">{page.title}</h1>
      <div className="note-content">
        <NoteRenderer blocks={page.blocks} />
      </div>
    </article>
  );
}
