import { NextRequest, NextResponse } from 'next/server';
import { isDashboardAuthenticated } from '@/lib/auth/dashboard';
import { listContacts } from '@/lib/mongodb/models/Contact';
import { listCampaigns } from '@/lib/mongodb/models/Campaign';
import { listNotePages } from '@/lib/mongodb/models/NotePage';
import { getSubscriberCount } from '@/lib/mongodb/models/Newsletter';
import { listAllToolboxItems } from '@/lib/mongodb/models/ToolboxItem';
import { getR2BucketUsage, isR2Configured } from '@/lib/r2';
import { getPosts } from '@/utils/utils';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  if (!isDashboardAuthenticated(request)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const [contacts, campaigns, notes, subscribers, toolbox, r2Usage] = await Promise.all([
    listContacts().catch(() => []),
    listCampaigns().catch(() => []),
    listNotePages().catch(() => []),
    getSubscriberCount().catch(() => 0),
    listAllToolboxItems().catch(() => []),
    isR2Configured() ? getR2BucketUsage().catch(() => null) : Promise.resolve(null),
  ]);

  const posts = getPosts(['src', 'app', 'blog', 'posts']);
  const projects = getPosts(['src', 'app', 'work', 'projects']);

  const contactsToday = contacts.filter(
    (c) => new Date(c.createdAt as unknown as string).getTime() >= todayStart.getTime()
  ).length;

  const campaignsSent = campaigns.filter((c) => c.status === 'sent').length;
  const campaignsDraft = campaigns.filter((c) => c.status === 'draft').length;

  const notesProtected = notes.filter((n) => Boolean(n.passwordHash)).length;
  const notesEnabled = notes.filter((n) => n.enabled).length;

  const toolboxEnabled = toolbox.filter((t) => t.enabled).length;

  const recentContacts = [...contacts]
    .sort(
      (a, b) =>
        new Date(b.createdAt as unknown as string).getTime() -
        new Date(a.createdAt as unknown as string).getTime()
    )
    .slice(0, 5)
    .map((c) => ({
      name: c.name,
      email: c.email,
      createdAt: c.createdAt,
    }));

  return NextResponse.json({
    contacts: { total: contacts.length, today: contactsToday },
    newsletter: { subscribers },
    campaigns: { total: campaigns.length, sent: campaignsSent, draft: campaignsDraft },
    notes: { total: notes.length, enabled: notesEnabled, protected: notesProtected },
    posts: { total: posts.length },
    projects: { total: projects.length },
    toolbox: { total: toolbox.length, enabled: toolboxEnabled },
    r2: r2Usage
      ? { bytes: r2Usage.bytes, objects: r2Usage.objects, freeBytes: 10 * 1e9 }
      : null,
    recentContacts,
  });
}
