import { NextRequest, NextResponse } from 'next/server';
import { isDashboardAuthenticated } from '@/lib/auth/dashboard';
import { ContentKind, listContent, readContent, writeContent, deleteContent, isValidSlug } from '@/lib/mdx/content';

function parseKind(request: NextRequest): ContentKind | null {
  const kind = new URL(request.url).searchParams.get('kind');
  return kind === 'blog' || kind === 'project' ? kind : null;
}

export async function GET(request: NextRequest) {
  if (!isDashboardAuthenticated(request)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }
  const kind = parseKind(request);
  if (!kind) return NextResponse.json({ error: 'kind inválido (blog|project)' }, { status: 400 });

  const slug = new URL(request.url).searchParams.get('slug');
  if (slug) {
    const item = readContent(kind, slug);
    if (!item) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
    return NextResponse.json({ item });
  }
  return NextResponse.json({ items: listContent(kind) });
}

export async function POST(request: NextRequest) {
  if (!isDashboardAuthenticated(request)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }
  const kind = parseKind(request);
  if (!kind) return NextResponse.json({ error: 'kind inválido' }, { status: 400 });

  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'JSON inválido' }, { status: 400 });

  const slug = String(body.slug ?? '').trim();
  const frontmatter = (body.frontmatter && typeof body.frontmatter === 'object')
    ? (body.frontmatter as Record<string, unknown>)
    : {};
  const mdxBody = typeof body.body === 'string' ? body.body : '';

  if (!isValidSlug(slug)) {
    return NextResponse.json({ error: 'Slug inválido (usa lowercase, guiones, 2-80 chars)' }, { status: 400 });
  }
  if (!frontmatter.title) {
    return NextResponse.json({ error: 'title requerido en frontmatter' }, { status: 400 });
  }

  try {
    const item = writeContent(kind, slug, frontmatter, mdxBody);
    return NextResponse.json({ item }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!isDashboardAuthenticated(request)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }
  const kind = parseKind(request);
  if (!kind) return NextResponse.json({ error: 'kind inválido' }, { status: 400 });
  const slug = new URL(request.url).searchParams.get('slug');
  if (!slug) return NextResponse.json({ error: 'slug requerido' }, { status: 400 });
  const ok = deleteContent(kind, slug);
  if (!ok) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
  return NextResponse.json({ ok: true });
}
