import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getFileById } from '@/lib/mongodb/models/CloudFile';
import { generateSignedStreamUrl } from '@/lib/cloudinary/config';

// Route Handler for legacy browsers - returns raw HTML
const CLOUD_USER_ID = 'cloud_owner';

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
  .header { padding: 10px 0; margin-bottom: 10px; }
  .back { color: #60a5fa; text-decoration: none; font-size: 14px; }
  .title { font-size: 16px; color: #fff; margin-bottom: 15px; word-wrap: break-word; }
  .video-container { background: #000; margin-bottom: 15px; }
  video { display: block; max-width: 100%; background: #000; }
  .download { text-align: center; margin: 15px 0; }
  .btn {
    display: inline-block;
    background: #3b82f6;
    color: #fff;
    text-decoration: none;
    padding: 10px 20px;
  }
  .note { text-align: center; font-size: 12px; color: #888; margin-top: 15px; }
`;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ fileId: string }> }
) {
  const { fileId } = await params;
  const cookieStore = await cookies();
  const isAuthenticated = cookieStore.get('cloud_auth')?.value === 'authenticated';

  if (!isAuthenticated) {
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=320">
  <title>Cloud Lite - Error</title>
  <style>${liteStyles}</style>
</head>
<body>
  <div class="container">
    <h1>Acceso Denegado</h1>
    <p>Debes iniciar sesion para ver este video.</p>
    <p style="margin-top:20px">
      <a href="/cloud/lite" class="btn">Volver</a>
    </p>
  </div>
</body>
</html>`;

    return new NextResponse(html, {
      status: 401,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }

  const file = await getFileById(fileId, CLOUD_USER_ID);

  if (!file) {
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=320">
  <title>Cloud Lite - Error</title>
  <style>${liteStyles}</style>
</head>
<body>
  <div class="container">
    <h1>Video no encontrado</h1>
    <p>El video no existe o no tienes acceso.</p>
    <p style="margin-top:20px">
      <a href="/cloud/lite" class="btn">Volver</a>
    </p>
  </div>
</body>
</html>`;

    return new NextResponse(html, {
      status: 404,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }

  const videoUrl = generateSignedStreamUrl(file.cloudinaryPublicId, {
    resourceType: 'video',
    format: 'mp4',
  });

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=320">
  <title>${file.name} - Cloud Lite</title>
  <style>${liteStyles}</style>
</head>
<body>
  <div class="container">
    <div class="header">
      <a href="/cloud/lite" class="back">← Volver</a>
    </div>
    <h2 class="title">${file.name}</h2>
    <div class="video-container">
      <video controls width="100%" preload="metadata" playsinline>
        <source src="${videoUrl}" type="video/mp4">
        Tu navegador no soporta video HTML5.
        <br>
        <a href="${videoUrl}">Descargar video</a>
      </video>
    </div>
    <div class="download">
      <a href="${videoUrl}" class="btn">Descargar MP4</a>
    </div>
    <p class="note">Si el video no carga, prueba descargarlo.</p>
  </div>
</body>
</html>`;

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
