#!/usr/bin/env node
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { MongoClient } from 'mongodb';
import { readFileSync, existsSync } from 'node:fs';
import { join, basename, extname } from 'node:path';
import { randomBytes } from 'node:crypto';

const root = '/home/avsolem/avsolemdotcom';
for (const f of ['.env', '.env.local']) {
  const p = join(root, f);
  if (!existsSync(p)) continue;
  for (const line of readFileSync(p, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, '');
  }
}

const NOTION = process.env.NOTION_API_KEY;
if (!NOTION) { console.error('Missing NOTION_API_KEY'); process.exit(1); }

const ARGS = Object.fromEntries(process.argv.slice(2).map(a => {
  const [k, ...v] = a.split('='); return [k.replace(/^--/, ''), v.join('=')];
}));
const PAGE_ID = ARGS.page;
const SLUG = ARGS.slug;
const TITLE = ARGS.title || '';
if (!PAGE_ID || !SLUG) {
  console.error('Usage: node scripts/notion-migrate.mjs --page=<id> --slug=<slug> [--title=<title>]');
  process.exit(1);
}

const NV = '2022-06-28';
async function notionFetch(path) {
  const res = await fetch(`https://api.notion.com${path}`, {
    headers: { Authorization: `Bearer ${NOTION}`, 'Notion-Version': NV },
  });
  if (!res.ok) throw new Error(`Notion ${path}: ${res.status} ${await res.text()}`);
  return res.json();
}

async function getAllChildren(blockId) {
  const out = [];
  let cursor;
  do {
    const url = `/v1/blocks/${blockId}/children?page_size=100${cursor ? `&start_cursor=${cursor}` : ''}`;
    const res = await notionFetch(url);
    out.push(...res.results);
    cursor = res.has_more ? res.next_cursor : null;
  } while (cursor);
  for (const b of out) {
    if (b.has_children) {
      try { b.__children = await getAllChildren(b.id); }
      catch (e) { console.warn(`  ! children of ${b.id}: ${e.message}`); b.__children = []; }
    }
  }
  return out;
}

const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId: process.env.R2_ACCESS_KEY_ID, secretAccessKey: process.env.R2_SECRET_ACCESS_KEY },
});
const BUCKET = process.env.R2_BUCKET;

async function uploadToR2(buf, filename, contentType) {
  const safe = filename.replace(/[^\w.\-]+/g, '_').slice(0, 80);
  const id = randomBytes(8).toString('hex');
  const key = `note/${id}-${safe}`;
  await r2.send(new PutObjectCommand({ Bucket: BUCKET, Key: key, Body: buf, ContentType: contentType }));
  return key;
}

async function downloadAndUpload(notionUrl, fallbackName) {
  const res = await fetch(notionUrl);
  if (!res.ok) throw new Error(`download ${res.status}`);
  const ct = res.headers.get('content-type') || 'application/octet-stream';
  const buf = Buffer.from(await res.arrayBuffer());
  let name = fallbackName;
  if (!name) {
    const u = new URL(notionUrl);
    name = basename(decodeURIComponent(u.pathname));
  }
  if (!extname(name)) {
    const ext = ct.includes('jpeg') ? '.jpg' : ct.includes('png') ? '.png' : ct.includes('webp') ? '.webp'
      : ct.includes('mp4') ? '.mp4' : ct.includes('webm') ? '.webm'
      : ct.includes('mp3') ? '.mp3' : ct.includes('wav') ? '.wav'
      : ct.includes('pdf') ? '.pdf' : '.bin';
    name += ext;
  }
  const key = await uploadToR2(buf, name, ct);
  return { key, size: buf.length, name, ct };
}

const newId = () => randomBytes(8).toString('hex');

function richTextToBN(rich) {
  if (!rich || !Array.isArray(rich) || rich.length === 0) return [];
  return rich.map(r => {
    if (r.type === 'text') {
      const styles = {};
      if (r.annotations?.bold) styles.bold = true;
      if (r.annotations?.italic) styles.italic = true;
      if (r.annotations?.underline) styles.underline = true;
      if (r.annotations?.strikethrough) styles.strike = true;
      if (r.annotations?.code) styles.code = true;
      if (r.annotations?.color && r.annotations.color !== 'default') {
        const c = r.annotations.color.replace(/_background$/, '');
        if (r.annotations.color.endsWith('_background')) styles.backgroundColor = c;
        else styles.textColor = c;
      }
      const text = r.plain_text || r.text?.content || '';
      if (r.text?.link?.url) {
        return { type: 'link', href: r.text.link.url, content: [{ type: 'text', text, styles }] };
      }
      return { type: 'text', text, styles };
    }
    return { type: 'text', text: r.plain_text || '', styles: {} };
  }).filter(c => (c.text && c.text.length > 0) || (c.content && c.content.length > 0));
}

const counts = { images: 0, videos: 0, audio: 0, files: 0, columns: 0, codeBlocks: 0, tables: 0, failed: 0, unknownTypes: new Set() };

function placeholder(text) {
  return { id: newId(), type: 'paragraph', props: {}, content: [{ type: 'text', text, styles: { italic: true } }], children: [] };
}

async function notionBlockToBN(b) {
  const t = b.type;
  switch (t) {
    case 'paragraph':
      return { id: newId(), type: 'paragraph', props: {}, content: richTextToBN(b.paragraph.rich_text), children: [] };
    case 'heading_1':
      return { id: newId(), type: 'heading', props: { level: 1 }, content: richTextToBN(b.heading_1.rich_text), children: [] };
    case 'heading_2':
      return { id: newId(), type: 'heading', props: { level: 2 }, content: richTextToBN(b.heading_2.rich_text), children: [] };
    case 'heading_3':
      return { id: newId(), type: 'heading', props: { level: 3 }, content: richTextToBN(b.heading_3.rich_text), children: [] };
    case 'bulleted_list_item':
      return { id: newId(), type: 'bulletListItem', props: {}, content: richTextToBN(b.bulleted_list_item.rich_text), children: [] };
    case 'numbered_list_item':
      return { id: newId(), type: 'numberedListItem', props: {}, content: richTextToBN(b.numbered_list_item.rich_text), children: [] };
    case 'to_do':
      return { id: newId(), type: 'checkListItem', props: { checked: !!b.to_do.checked }, content: richTextToBN(b.to_do.rich_text), children: [] };
    case 'quote':
      return { id: newId(), type: 'quote', props: {}, content: richTextToBN(b.quote.rich_text), children: [] };
    case 'callout': {
      const icon = b.callout.icon?.emoji || '💡';
      return { id: newId(), type: 'paragraph', props: {}, content: [{ type: 'text', text: `${icon} `, styles: {} }, ...richTextToBN(b.callout.rich_text)], children: [] };
    }
    case 'divider':
      return { id: newId(), type: 'paragraph', props: {}, content: [{ type: 'text', text: '———', styles: {} }], children: [] };
    case 'code': {
      counts.codeBlocks++;
      const text = (b.code.rich_text || []).map(r => r.plain_text || '').join('');
      const lang = b.code.language || 'text';
      return { id: newId(), type: 'codeBlock', props: { language: lang }, content: [{ type: 'text', text, styles: {} }], children: [] };
    }
    case 'image': {
      const url = b.image?.file?.url || b.image?.external?.url;
      if (!url) return placeholder('imagen sin URL');
      try {
        process.stdout.write('  📷 ');
        const { key, size } = await downloadAndUpload(url);
        counts.images++;
        process.stdout.write(`${(size/1024).toFixed(0)}KB → ${key}\n`);
        const cap = (b.image?.caption || []).map(r => r.plain_text || '').join('');
        return { id: newId(), type: 'image', props: { url: `/api/n/media/${key}`, caption: cap, previewWidth: 512, name: '' }, children: [] };
      } catch (e) { counts.failed++; return placeholder(`imagen falló: ${e.message}`); }
    }
    case 'video': {
      const url = b.video?.file?.url || b.video?.external?.url;
      if (!url) return placeholder('video sin URL');
      if (b.video?.external?.url) {
        return { id: newId(), type: 'paragraph', props: {}, content: [{ type: 'link', href: url, content: [{ type: 'text', text: `[Video externo: ${url}]`, styles: {} }] }], children: [] };
      }
      try {
        process.stdout.write('  🎬 ');
        const { key, size, name } = await downloadAndUpload(url);
        counts.videos++;
        process.stdout.write(`${(size/1024/1024).toFixed(1)}MB → ${key}\n`);
        return { id: newId(), type: 'video', props: { url: `/api/n/media/${key}`, caption: '', previewWidth: 512, name: name || '' }, children: [] };
      } catch (e) { counts.failed++; return placeholder(`video falló: ${e.message}`); }
    }
    case 'audio': {
      const url = b.audio?.file?.url || b.audio?.external?.url;
      if (!url) return placeholder('audio sin URL');
      if (b.audio?.external?.url) return placeholder(`audio externo: ${url}`);
      try {
        process.stdout.write('  🔊 ');
        const { key, size, name } = await downloadAndUpload(url);
        counts.audio++;
        process.stdout.write(`${(size/1024).toFixed(0)}KB → ${key}\n`);
        return { id: newId(), type: 'audio', props: { url: `/api/n/media/${key}`, caption: '', name: name || '' }, children: [] };
      } catch (e) { counts.failed++; return placeholder(`audio falló: ${e.message}`); }
    }
    case 'file':
    case 'pdf': {
      const data = b[t];
      const url = data?.file?.url || data?.external?.url;
      if (!url) return placeholder(`${t} sin URL`);
      if (data?.external?.url) return placeholder(`${t} externo: ${url}`);
      try {
        process.stdout.write(`  📎 `);
        const { key, size, name } = await downloadAndUpload(url, data?.name);
        counts.files++;
        process.stdout.write(`${(size/1024).toFixed(0)}KB → ${key}\n`);
        return { id: newId(), type: 'file', props: { url: `/api/n/media/${key}`, caption: '', name: name || '' }, children: [] };
      } catch (e) { counts.failed++; return placeholder(`${t} falló: ${e.message}`); }
    }
    case 'column_list': {
      counts.columns++;
      return { id: newId(), type: 'columnList', props: {}, children: [] };
    }
    case 'column':
      return { id: newId(), type: 'column', props: { width: 1 }, children: [] };
    case 'toggle':
      return { id: newId(), type: 'heading', props: { level: 3, isToggleable: true }, content: richTextToBN(b.toggle.rich_text), children: [] };
    case 'bookmark':
    case 'embed':
    case 'link_preview': {
      const url = b[t]?.url || '';
      const captionRich = b[t]?.caption || [];
      const caption = captionRich.map(r => r.plain_text || '').join('') || url;
      return { id: newId(), type: 'paragraph', props: {}, content: [{ type: 'link', href: url, content: [{ type: 'text', text: caption, styles: {} }] }], children: [] };
    }
    case 'link_to_page': {
      const target = b.link_to_page?.page_id || b.link_to_page?.database_id;
      return placeholder(`Link a página: ${target}`);
    }
    case 'child_page':
      return placeholder(`Sub-página: ${b.child_page.title}`);
    case 'child_database':
      return placeholder(`Base de datos: ${b.child_database?.title || 'sin título'}`);
    case 'synced_block':
      return null;
    case 'breadcrumb':
    case 'table_of_contents':
      return null;
    case 'table': {
      counts.tables++;
      return { id: newId(), type: 'table', props: {}, content: { type: 'tableContent', rows: [] }, children: [] };
    }
    case 'equation':
      return placeholder(`[ecuación: ${b.equation?.expression || ''}]`);
    case 'unsupported':
      return placeholder('[bloque no soportado por Notion API]');
    default:
      counts.unknownTypes.add(t);
      return placeholder(`[${t}: tipo desconocido]`);
  }
}

async function flatten(blocks) {
  const out = [];
  for (const b of blocks) {
    const bn = await notionBlockToBN(b);

    if (bn && bn.type === 'table' && b.__children) {
      const rows = [];
      for (const child of b.__children) {
        if (child.type === 'table_row') {
          const cellsRich = (child.table_row.cells || []).map(cell => richTextToBN(cell));
          rows.push({ cells: cellsRich });
        }
      }
      bn.content = { type: 'tableContent', rows };
      out.push(bn);
      continue;
    }

    if (bn && bn.type === 'columnList' && b.__children) {
      for (const colChild of b.__children) {
        if (colChild.type === 'column') {
          const colBn = { id: newId(), type: 'column', props: { width: 1 }, children: [] };
          if (colChild.__children) {
            colBn.children = await flatten(colChild.__children);
          }
          bn.children.push(colBn);
        }
      }
      out.push(bn);
      continue;
    }

    if (b.type === 'synced_block' && b.__children) {
      const sub = await flatten(b.__children);
      out.push(...sub);
      continue;
    }

    if (bn && b.type === 'toggle' && b.__children) {
      bn.children = await flatten(b.__children);
      out.push(bn);
      continue;
    }

    if (bn && (b.type === 'bulleted_list_item' || b.type === 'numbered_list_item' || b.type === 'to_do') && b.__children) {
      bn.children = await flatten(b.__children);
      out.push(bn);
      continue;
    }

    if (bn && (b.type === 'callout' || b.type === 'quote') && b.__children) {
      out.push(bn);
      const sub = await flatten(b.__children);
      out.push(...sub);
      continue;
    }

    if (bn) out.push(bn);
  }
  return out;
}

console.log(`Fetching page ${PAGE_ID}...`);
const meta = await notionFetch(`/v1/pages/${PAGE_ID}`);
const titleProp = Object.values(meta.properties || {}).find(p => p.type === 'title');
const notionTitle = titleProp?.title?.map(t => t.plain_text).join('') || 'Sin título';
const finalTitle = TITLE || notionTitle;
console.log(`Title: ${finalTitle}\nSlug:  ${SLUG}\n`);

console.log('Fetching blocks (recursive)...');
const tree = await getAllChildren(PAGE_ID);
console.log(`Got ${tree.length} top-level blocks\n`);

console.log('Processing blocks (downloads + R2 uploads)...');
const blocks = await flatten(tree);

console.log(`\n──────────────`);
console.log(`Generated ${blocks.length} BlockNote blocks`);
console.log(`Media: ${counts.images} img · ${counts.videos} vid · ${counts.audio} audio · ${counts.files} file · ${counts.failed} fallidos`);
console.log(`Estructura: ${counts.columns} columnList · ${counts.codeBlocks} code · ${counts.tables} tablas`);
if (counts.unknownTypes.size > 0) {
  console.log(`Unknown types: ${[...counts.unknownTypes].join(', ')}`);
}

const mongo = new MongoClient(process.env.MONGODB_URI);
await mongo.connect();
const db = mongo.db('yugioh');
const col = db.collection('note_pages');
const existing = await col.findOne({ slug: SLUG });
if (existing) {
  console.log(`\n! slug "${SLUG}" already exists, updating...`);
  await col.updateOne({ slug: SLUG }, { $set: { title: finalTitle, blocks, updatedAt: new Date() } });
} else {
  const order = await col.countDocuments();
  await col.insertOne({
    slug: SLUG, title: finalTitle, blocks, enabled: false, order,
    createdAt: new Date(), updatedAt: new Date(),
  });
  console.log(`\n✓ Created note_pages/${SLUG}`);
}
await mongo.close();

console.log(`\nListo. http://localhost:3000/n/${SLUG}`);
