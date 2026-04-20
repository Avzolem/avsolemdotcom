import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { isDashboardAuthenticated } from '@/lib/auth/dashboard';
import { getCampaignById, updateCampaign } from '@/lib/mongodb/models/Campaign';
import { listContacts } from '@/lib/mongodb/models/Contact';
import { renderCampaignHtml } from '@/lib/email/renderCampaign';

const BATCH_SIZE = 5;
const BATCH_DELAY_MS = 1100; // stay under Resend's 2 req/sec

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isDashboardAuthenticated(request)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const { id } = await params;
  const campaign = await getCampaignById(id);
  if (!campaign) {
    return NextResponse.json({ error: 'Campaña no encontrada' }, { status: 404 });
  }
  if (campaign.status === 'sending') {
    return NextResponse.json({ error: 'Ya se está enviando' }, { status: 409 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'RESEND_API_KEY no configurado' }, { status: 500 });
  }

  const contacts = await listContacts();
  if (contacts.length === 0) {
    return NextResponse.json({ error: 'Sin contactos para enviar' }, { status: 400 });
  }

  await updateCampaign(id, { status: 'sending' });

  const resend = new Resend(apiKey);
  const from = process.env.RESEND_FROM || 'Avsolem <contact@avsolem.com>';

  let success = 0;
  let failure = 0;
  const failures: Array<{ email: string; error: string }> = [];

  for (let i = 0; i < contacts.length; i += BATCH_SIZE) {
    const batch = contacts.slice(i, i + BATCH_SIZE);
    const results = await Promise.all(
      batch.map(async (c) => {
        try {
          const html = renderCampaignHtml({
            subject: campaign.subject,
            bodyMarkdown: campaign.body,
            contact: { name: c.name },
          });
          const res = await resend.emails.send({
            from,
            to: c.email,
            subject: campaign.subject,
            html,
          });
          if (res.error) {
            return { email: c.email, ok: false, error: String(res.error.message || res.error) };
          }
          return { email: c.email, ok: true };
        } catch (err) {
          return { email: c.email, ok: false, error: (err as Error).message };
        }
      })
    );
    for (const r of results) {
      if (r.ok) success++;
      else {
        failure++;
        failures.push({ email: r.email, error: r.error || 'unknown' });
      }
    }
    if (i + BATCH_SIZE < contacts.length) {
      await sleep(BATCH_DELAY_MS);
    }
  }

  const finalStatus = failure === 0 ? 'sent' : success === 0 ? 'failed' : 'sent';
  await updateCampaign(id, {
    status: finalStatus,
    sentAt: new Date(),
    recipientsCount: contacts.length,
    successCount: success,
    failureCount: failure,
    failures,
  });

  return NextResponse.json({
    ok: true,
    total: contacts.length,
    success,
    failure,
    failures,
  });
}
