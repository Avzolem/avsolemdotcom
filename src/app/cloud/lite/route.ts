import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getFilesByUser } from '@/lib/mongodb/models/CloudFile';

// Route Handler for legacy browsers - returns raw HTML
const CLOUD_USER_ID = 'cloud_owner';

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

const liteStyles = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: Arial, sans-serif;
    font-size: 14px;
    line-height: 1.4;
    background: #1a1a2e;
    color: #eee;
    padding: 10px;
  }
  .container { max-width: 480px; margin: 0 auto; }
  .header { padding: 10px 0; border-bottom: 1px solid #333; margin-bottom: 15px; }
  .header h1 { font-size: 18px; color: #60a5fa; }
  .empty { text-align: center; color: #888; padding: 40px 20px; }
  .file-item {
    background: #252540;
    border: 1px solid #333;
    padding: 10px;
    margin-bottom: 8px;
    overflow: hidden;
  }
  .file-item:after { content: ""; display: table; clear: both; }
  .file-icon { float: left; font-size: 24px; margin-right: 10px; width: 32px; text-align: center; }
  .file-info { overflow: hidden; }
  .file-name { font-weight: bold; color: #fff; }
  .file-meta { font-size: 12px; color: #888; margin-top: 2px; }
  .btn-play {
    float: right;
    background: #3b82f6;
    color: #fff;
    text-decoration: none;
    padding: 6px 12px;
    font-size: 12px;
  }
  .btn {
    display: inline-block;
    background: #3b82f6;
    color: #fff;
    text-decoration: none;
    padding: 10px 20px;
  }
  .footer { margin-top: 20px; padding-top: 10px; border-top: 1px solid #333; text-align: center; }
  .footer a { color: #60a5fa; text-decoration: none; font-size: 12px; }
`;

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const isAuthenticated = cookieStore.get('cloud_auth')?.value === 'authenticated';

  if (!isAuthenticated) {
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=320">
  <title>Cloud Lite - Login</title>
  <style>${liteStyles}</style>
</head>
<body>
  <div class="container">
    <h1>Cloud Storage</h1>
    <p>Inicia sesion para ver tus archivos.</p>
    <p style="margin-top:20px">
      <a href="/cloud" class="btn">Iniciar Sesion</a>
    </p>
    <p style="margin-top:20px;font-size:12px;color:#888">
      Nota: El login requiere un navegador moderno.<br>
      Usa tu telefono o PC para iniciar sesion.
    </p>
  </div>
</body>
</html>`;

    return new NextResponse(html, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }

  // Get files
  const { files } = await getFilesByUser(CLOUD_USER_ID, { limit: 100 });

  const fileListHtml = files.length === 0
    ? '<p class="empty">No hay archivos. Sube archivos desde la version completa.</p>'
    : files.map(file => `
        <div class="file-item">
          <div class="file-icon">${file.cloudinaryResourceType === 'video' ? '🎬' : '📄'}</div>
          <div class="file-info">
            <div class="file-name">${file.name}</div>
            <div class="file-meta">
              ${formatBytes(file.size)}${file.duration ? ` - ${formatDuration(file.duration)}` : ''}
            </div>
          </div>
          ${file.cloudinaryResourceType === 'video' ? `<a href="/cloud/lite/stream/${file._id}" class="btn-play">▶ Ver</a>` : ''}
        </div>
      `).join('');

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=320">
  <title>Cloud Lite</title>
  <style>${liteStyles}</style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Cloud Lite</h1>
    </div>
    ${fileListHtml}
    <div class="footer">
      <a href="/">← avsolem.com</a>
    </div>
  </div>
</body>
</html>`;

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
