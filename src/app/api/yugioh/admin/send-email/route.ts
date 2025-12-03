import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { getUsersCollection, YugiohUser } from '@/lib/mongodb/models/User';
import { Resend } from 'resend';

// Get admin emails from environment variable (comma-separated)
function getAdminEmails(): string[] {
  const adminEmails = process.env.YUGIOH_ADMIN_EMAILS || '';
  return adminEmails.split(',').map(email => email.trim().toLowerCase()).filter(Boolean);
}

function isAdminEmail(email: string): boolean {
  const adminEmails = getAdminEmails();
  return adminEmails.includes(email.toLowerCase());
}

// Simple markdown to HTML converter
function markdownToHtml(markdown: string, userName?: string): string {
  let html = markdown
    // Replace {nombre} with actual user name
    .replace(/\{nombre\}/gi, userName || 'Usuario')
    // Headers
    .replace(/^### (.*$)/gim, '<h3 style="color: #FFD700; margin: 20px 0 10px 0;">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 style="color: #FFD700; margin: 25px 0 12px 0;">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 style="color: #FFD700; margin: 30px 0 15px 0;">$1</h1>')
    // Bold
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" style="color: #FFD700; text-decoration: underline;">$1</a>')
    // Unordered lists
    .replace(/^- (.*$)/gim, '<li style="margin: 5px 0;">$1</li>')
    // Line breaks
    .replace(/\n\n/gim, '</p><p style="margin: 15px 0; line-height: 1.6;">')
    .replace(/\n/gim, '<br />');

  // Wrap list items
  html = html.replace(/(<li.*<\/li>)+/g, '<ul style="margin: 15px 0; padding-left: 25px;">$&</ul>');

  return html;
}

function generateEmailTemplate(content: string, userName?: string): string {
  const htmlContent = markdownToHtml(content, userName);

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #0A0A0A; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0A0A0A;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width: 600px;">
          <!-- Header -->
          <tr>
            <td align="center" style="padding-bottom: 30px;">
              <img src="https://avsolem.com/images/yugioh-logo.svg" alt="Yu-Gi-Oh! Manager" width="200" style="max-width: 200px;">
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%); border: 2px solid #333; border-radius: 16px; padding: 40px;">
              <div style="color: rgba(255, 255, 255, 0.9); font-size: 16px; line-height: 1.7;">
                <p style="margin: 0 0 15px 0; line-height: 1.6;">
                  ${htmlContent}
                </p>
              </div>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top: 30px;">
              <p style="color: rgba(255, 255, 255, 0.5); font-size: 12px; margin: 0;">
                Yu-Gi-Oh! Manager by <a href="https://avsolem.com" style="color: #FFD700;">avsolem.com</a>
              </p>
              <p style="color: rgba(255, 255, 255, 0.3); font-size: 11px; margin: 10px 0 0 0;">
                Si no deseas recibir mas emails, puedes desactivar la suscripcion desde tu perfil.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    if (!isAdminEmail(session.user.email)) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 403 }
      );
    }

    const { subject, content, target } = await request.json();

    if (!subject || !content) {
      return NextResponse.json(
        { error: 'Asunto y contenido son requeridos' },
        { status: 400 }
      );
    }

    // Check Resend API key
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: 'Configuracion de Resend no disponible. Agrega RESEND_API_KEY al .env' },
        { status: 500 }
      );
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    // Get users based on target
    const collection = await getUsersCollection();
    let users: YugiohUser[];

    if (target === 'newsletter') {
      users = await collection.find({ newsletterSubscribed: true }).toArray();
    } else {
      users = await collection.find({}).toArray();
    }

    if (users.length === 0) {
      return NextResponse.json(
        { error: 'No hay usuarios para enviar emails' },
        { status: 400 }
      );
    }

    // Get from address (use verified domain or default)
    const fromAddress = process.env.RESEND_FROM || 'Yu-Gi-Oh! Manager <onboarding@resend.dev>';

    // Send emails
    let sentCount = 0;
    const errors: string[] = [];

    for (const user of users) {
      try {
        const htmlContent = generateEmailTemplate(content, user.name);

        const { error } = await resend.emails.send({
          from: fromAddress,
          to: user.email,
          subject: subject,
          html: htmlContent,
        });

        if (error) {
          console.error(`Error sending email to ${user.email}:`, error);
          errors.push(user.email);
        } else {
          sentCount++;
        }
      } catch (err) {
        console.error(`Error sending email to ${user.email}:`, err);
        errors.push(user.email);
      }
    }

    return NextResponse.json({
      success: true,
      sentCount,
      totalUsers: users.length,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error('Error sending emails:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
