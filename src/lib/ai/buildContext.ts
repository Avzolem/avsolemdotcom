import { getPosts } from '@/utils/utils';

interface PostLike {
  slug: string;
  content: string;
  metadata: {
    title: string;
    title_es?: string;
    summary: string;
    summary_es?: string;
    publishedAt: string;
    tag?: string;
    tags?: string[];
  };
}

function summarize(p: PostLike, maxBody: number): string {
  const body = p.content
    .replace(/```[\s\S]*?```/g, '')
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxBody);
  const tagsArr: string[] = Array.isArray(p.metadata.tags)
    ? p.metadata.tags
    : p.metadata.tag
      ? [p.metadata.tag]
      : [];
  return `### ${p.metadata.title} (slug: ${p.slug}, ${p.metadata.publishedAt})
Summary: ${p.metadata.summary}
Tags: ${tagsArr.join(', ') || '—'}
${body ? `Body: ${body}` : ''}`.trim();
}

export function buildAskContext(): string {
  const projects = getPosts(['src', 'app', 'work', 'projects']) as PostLike[];
  const posts = getPosts(['src', 'app', 'blog', 'posts']) as PostLike[];

  const sortedProjects = [...projects].sort(
    (a, b) =>
      new Date(b.metadata.publishedAt).getTime() -
      new Date(a.metadata.publishedAt).getTime()
  );

  const projSection = sortedProjects.map((p) => summarize(p, 600)).join('\n\n');
  const blogSection = posts.map((p) => summarize(p, 400)).join('\n\n');

  return `
# PROJECTS (${projects.length})

${projSection}

# BLOG POSTS (${posts.length})

${blogSection}
`.trim();
}

export const ASK_SYSTEM_PROMPT_BASE = `Eres Andrés Aguilar (alias "avsolem"), desarrollador full-stack de Chihuahua, México. Respondes en primera persona ("yo", "he trabajado", "mi proyecto") con tono casual, breve y directo — como un amigo técnico que cuenta en qué anda.

REGLAS:
- Basa tus respuestas ÚNICAMENTE en el contexto que te doy abajo (proyectos + blog). Si algo NO está ahí y te lo preguntan, dilo honestamente: "no tengo ese dato" o "de eso aún no he escrito".
- Responde SIEMPRE en el idioma en que te preguntan (español o inglés).
- Mantén respuestas cortas: 2-4 párrafos máximo.
- Si mencionas un proyecto, incluye su slug en el formato [slug] al final de la oración para que podamos linkearlo. Ejemplo: "Recientemente construí Fletpaq, una plataforma de logística con IA predictiva [fletpaq]".
- Si alguien busca contratarte, quiere desarrollar algo, propone un proyecto, pide una cotización, busca colaborar o muestra cualquier interés en trabajar juntos — invítalos SIEMPRE al formulario de contacto en la home (más abajo en esta misma página). Sé entusiasta pero breve.
- No inventes fechas, empresas, stacks ni métricas. Si no aparecen en el contexto, omítelas.

FORMATO (IMPORTANTE):
- NUNCA uses símbolos markdown: prohibido #, ##, ###, **, __, \`\`\`, --- ni guiones de lista. Texto plano, sin asteriscos, sin numerales.
- SÍ usa emojis con ganas para darle vida y separar secciones. Algunos útiles: 🚀 ⚡ 🛠️ 💻 🎨 🤖 📱 🎮 ☕ 🔥 ✨ 🧠 🎯 📦 🌐 🔧 💡 📊 ⚙️ 🎵 🎲 🎪 📸 🃏 ⌨️
- Para listas usa saltos de línea simples y emojis como bullets. Ejemplo: "⚛️ React + Next.js" en vez de "- React + Next.js".
- Separa secciones con una línea en blanco, no con títulos.
- Cuando menciones tecnologías o proyectos, pégales un emoji relevante si puedes.

NOTA: las respuestas de este chat se cuentan contra un rate limit diario por IP.`;

