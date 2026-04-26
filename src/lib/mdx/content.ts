import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export type ContentKind = 'blog' | 'project';

export interface ContentItem {
  slug: string;
  kind: ContentKind;
  frontmatter: Record<string, unknown>;
  body: string;
  updatedAt: string;
}

function dirFor(kind: ContentKind): string[] {
  return kind === 'blog'
    ? ['src', 'app', 'blog', 'posts']
    : ['src', 'app', 'work', 'projects'];
}

function slugPath(kind: ContentKind, slug: string): string {
  return path.join(/*turbopackIgnore: true*/ process.cwd(), ...dirFor(kind), `${slug}.mdx`);
}

const SLUG_RE = /^[a-z0-9][a-z0-9-]*[a-z0-9]$/;

export function isValidSlug(slug: string): boolean {
  return SLUG_RE.test(slug) && slug.length <= 80;
}

export function listContent(kind: ContentKind): ContentItem[] {
  const dir = path.join(/*turbopackIgnore: true*/ process.cwd(), ...dirFor(kind));
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.mdx'))
    .map((file) => readContent(kind, file.replace(/\.mdx$/, '')))
    .filter((x): x is ContentItem => x !== null)
    .sort((a, b) => {
      const aD = String(a.frontmatter.publishedAt ?? '');
      const bD = String(b.frontmatter.publishedAt ?? '');
      return bD.localeCompare(aD);
    });
}

export function readContent(kind: ContentKind, slug: string): ContentItem | null {
  if (!isValidSlug(slug)) return null;
  const full = slugPath(kind, slug);
  if (!fs.existsSync(full)) return null;
  const raw = fs.readFileSync(full, 'utf8');
  const { data, content } = matter(raw);
  const stat = fs.statSync(full);
  return {
    slug,
    kind,
    frontmatter: data,
    body: content,
    updatedAt: stat.mtime.toISOString(),
  };
}

export function writeContent(
  kind: ContentKind,
  slug: string,
  frontmatter: Record<string, unknown>,
  body: string
): ContentItem {
  if (!isValidSlug(slug)) {
    throw new Error(`Invalid slug: ${slug}`);
  }
  const full = slugPath(kind, slug);
  const dir = path.dirname(full);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const serialized = matter.stringify(body.trim() + '\n', frontmatter);
  fs.writeFileSync(full, serialized, 'utf8');
  return readContent(kind, slug)!;
}

export function deleteContent(kind: ContentKind, slug: string): boolean {
  if (!isValidSlug(slug)) return false;
  const full = slugPath(kind, slug);
  if (!fs.existsSync(full)) return false;
  fs.unlinkSync(full);
  return true;
}
