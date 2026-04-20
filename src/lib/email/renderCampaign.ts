// Minimal markdown → HTML converter for campaign emails.
// Keep this simple: only the basics (headings, bold, italic, links, lists, paragraphs).

function esc(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[c] as string);
}

export function markdownToHtml(md: string, contact?: { name?: string }): string {
  const name = contact?.name || 'amig@';
  // Replace {name} token with the recipient's name
  let txt = md.replace(/\{\s*(name|nombre)\s*\}/gi, esc(name));

  const lines = txt.split('\n');
  const html: string[] = [];
  let inList = false;
  let paragraph: string[] = [];

  const flushParagraph = () => {
    if (paragraph.length) {
      const raw = paragraph.join(' ').trim();
      if (raw) {
        html.push(`<p style="margin:0 0 16px 0;line-height:1.6;">${inlineFormat(raw)}</p>`);
      }
      paragraph = [];
    }
  };

  const inlineFormat = (s: string): string => {
    return s
      // bold
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      // italic
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      // links [text](url)
      .replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        '<a href="$2" style="color:#22d3ee;text-decoration:underline;">$1</a>'
      );
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) {
      flushParagraph();
      if (inList) {
        html.push('</ul>');
        inList = false;
      }
      continue;
    }

    const heading = line.match(/^(#{1,3})\s+(.+)$/);
    if (heading) {
      flushParagraph();
      if (inList) { html.push('</ul>'); inList = false; }
      const level = heading[1].length;
      const size = level === 1 ? 22 : level === 2 ? 18 : 16;
      html.push(`<h${level} style="margin:24px 0 12px 0;color:#fff;font-size:${size}px;">${inlineFormat(heading[2])}</h${level}>`);
      continue;
    }

    const li = line.match(/^[-*]\s+(.+)$/);
    if (li) {
      flushParagraph();
      if (!inList) {
        html.push('<ul style="margin:0 0 16px 0;padding-left:22px;line-height:1.6;">');
        inList = true;
      }
      html.push(`<li style="margin:6px 0;">${inlineFormat(li[1])}</li>`);
      continue;
    }

    if (inList) { html.push('</ul>'); inList = false; }
    paragraph.push(line);
  }

  flushParagraph();
  if (inList) html.push('</ul>');

  return html.join('\n');
}

export function renderCampaignHtml(params: {
  subject: string;
  bodyMarkdown: string;
  contact?: { name?: string };
}): string {
  const bodyHtml = markdownToHtml(params.bodyMarkdown, params.contact);
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0A0A0A;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0A0A0A;">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#111;border:1px solid #333;border-radius:12px;">
          <tr>
            <td style="padding:32px 32px 16px;border-bottom:1px solid #333;">
              <div style="font-size:24px;font-weight:700;color:#fff;letter-spacing:-0.02em;">avsolem.</div>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;color:#e5e7eb;font-size:15px;">
              ${bodyHtml}
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px;border-top:1px solid #333;color:#666;font-size:12px;line-height:1.6;text-align:center;">
              Enviado desde <a href="https://avsolem.com" style="color:#22d3ee;">avsolem.com</a><br>
              Recibiste esto porque dejaste tus datos en mi formulario de contacto.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`.trim();
}
