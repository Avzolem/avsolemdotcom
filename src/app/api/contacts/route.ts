import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createContact, countContactsByEmailToday } from '@/lib/mongodb/models/Contact';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function esc(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[c] as string);
}

function buildAdminEmail(data: {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  ip?: string;
  userAgent?: string;
}): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#0A0A0A;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0A0A0A;">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#111;border:1px solid #333;border-radius:12px;">
          <tr>
            <td style="padding:28px 32px;border-bottom:1px solid #333;">
              <h1 style="margin:0;color:#22d3ee;font-size:20px;">Nuevo contacto desde avsolem.com</h1>
              <p style="margin:6px 0 0;color:#888;font-size:13px;">${new Date().toLocaleString('es-MX', { timeZone: 'America/Chihuahua' })} (MST)</p>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 32px;color:#e5e7eb;font-size:14px;line-height:1.7;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr><td style="padding:6px 0;color:#888;width:110px;">Nombre</td><td style="padding:6px 0;color:#fff;font-weight:600;">${esc(data.name)}</td></tr>
                <tr><td style="padding:6px 0;color:#888;">Correo</td><td style="padding:6px 0;"><a href="mailto:${esc(data.email)}" style="color:#22d3ee;">${esc(data.email)}</a></td></tr>
                ${data.phone ? `<tr><td style="padding:6px 0;color:#888;">Celular</td><td style="padding:6px 0;"><a href="tel:${esc(data.phone)}" style="color:#22d3ee;">${esc(data.phone)}</a></td></tr>` : ''}
                ${data.company ? `<tr><td style="padding:6px 0;color:#888;">Empresa</td><td style="padding:6px 0;color:#fff;">${esc(data.company)}</td></tr>` : ''}
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 32px 24px;border-top:1px solid #333;color:#555;font-size:11px;line-height:1.5;">
              ${data.ip ? `IP: ${esc(data.ip)}<br>` : ''}${data.userAgent ? `UA: ${esc(data.userAgent.slice(0, 120))}` : ''}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`.trim();
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim() : '';
    const phone = typeof body.phone === 'string' ? body.phone.trim() : '';
    const company = typeof body.company === 'string' ? body.company.trim() : '';

    if (!name || name.length < 2 || name.length > 120) {
      return NextResponse.json({ error: 'Nombre inválido' }, { status: 400 });
    }
    if (!email || !EMAIL_RE.test(email) || email.length > 200) {
      return NextResponse.json({ error: 'Correo inválido' }, { status: 400 });
    }
    if (phone && phone.length > 40) {
      return NextResponse.json({ error: 'Celular inválido' }, { status: 400 });
    }
    if (company && company.length > 200) {
      return NextResponse.json({ error: 'Empresa inválida' }, { status: 400 });
    }

    // Per-email rate limit: max 3 submissions per 24h
    const recent = await countContactsByEmailToday(email);
    if (recent >= 3) {
      return NextResponse.json(
        { error: 'Demasiados envíos recientes. Intenta mañana.' },
        { status: 429 }
      );
    }

    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      request.headers.get('x-real-ip') ||
      undefined;
    const userAgent = request.headers.get('user-agent') || undefined;

    await createContact({ name, email, phone, company, ip, userAgent });

    // Fire notification email to admin (non-blocking failure)
    const adminEmail = process.env.CONTACT_NOTIFY_EMAIL;
    const resendKey = process.env.RESEND_API_KEY;
    if (adminEmail && resendKey) {
      try {
        const resend = new Resend(resendKey);
        const fromAddress = process.env.RESEND_FROM || 'Gestor de Contactos de Avsolem.com <contact@avsolem.com>';
        await resend.emails.send({
          from: fromAddress,
          to: adminEmail,
          subject: `[avsolem.com] Nuevo contacto: ${name}`,
          replyTo: email,
          html: buildAdminEmail({ name, email, phone, company, ip, userAgent }),
        });
      } catch (err) {
        // Don't fail the submission if email delivery fails — we already saved it.
        console.error('Contact notification failed:', err);
      }
    }

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error('Contact POST error:', err);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
