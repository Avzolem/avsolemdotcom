import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { getUsersCollection, YugiohUser } from '@/lib/mongodb/models/User';

// Get admin emails from environment variable (comma-separated)
function getAdminEmails(): string[] {
  const adminEmails = process.env.YUGIOH_ADMIN_EMAILS || '';
  return adminEmails.split(',').map(email => email.trim().toLowerCase()).filter(Boolean);
}

function isAdminEmail(email: string): boolean {
  const adminEmails = getAdminEmails();
  return adminEmails.includes(email.toLowerCase());
}

export async function GET() {
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

    const collection = await getUsersCollection();
    const users = await collection.find({}).sort({ createdAt: -1 }).toArray();

    // Calculate stats
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const stats = {
      totalUsers: users.length,
      googleUsers: users.filter((u: YugiohUser) => u.provider === 'google').length,
      credentialsUsers: users.filter((u: YugiohUser) => u.provider === 'credentials').length,
      newsletterSubscribers: users.filter((u: YugiohUser) => u.newsletterSubscribed).length,
      usersThisMonth: users.filter((u: YugiohUser) => new Date(u.createdAt) > oneMonthAgo).length,
      usersThisWeek: users.filter((u: YugiohUser) => new Date(u.createdAt) > oneWeekAgo).length,
    };

    // Format users for response (exclude sensitive data)
    const formattedUsers = users.map((u: YugiohUser) => ({
      _id: u._id?.toString(),
      email: u.email,
      name: u.name,
      provider: u.provider,
      newsletterSubscribed: u.newsletterSubscribed,
      language: u.language,
      createdAt: u.createdAt,
    }));

    return NextResponse.json({
      stats,
      users: formattedUsers,
    });
  } catch (error) {
    console.error('Error fetching admin data:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
