import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import {
  verifyPassword,
  upsertOAuthUser,
} from '@/lib/mongodb/models/User';
import { linkSubscriberToUser } from '@/lib/mongodb/models/Newsletter';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('MISSING_CREDENTIALS');
        }

        const user = await verifyPassword(credentials.email, credentials.password);

        if (!user) {
          throw new Error('INVALID_CREDENTIALS');
        }

        return {
          id: user._id?.toString() || '',
          email: user.email,
          name: user.name,
          image: user.image,
          newsletterSubscribed: user.newsletterSubscribed,
          language: user.language,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google' && profile?.email) {
        try {
          const dbUser = await upsertOAuthUser(
            profile.email,
            profile.name || user.name || 'Usuario',
            user.image || undefined,
            'google',
            account.providerAccountId
          );

          // Link newsletter subscription if exists
          if (dbUser._id) {
            await linkSubscriberToUser(profile.email, dbUser._id.toString());
          }

          user.id = dbUser._id?.toString() || '';
          user.newsletterSubscribed = dbUser.newsletterSubscribed;
          user.language = dbUser.language;
        } catch (error) {
          console.error('Error during OAuth sign in:', error);
          return false;
        }
      }

      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.newsletterSubscribed = user.newsletterSubscribed;
        token.language = user.language;
      }

      // Handle session update (e.g., when user updates preferences)
      if (trigger === 'update' && session) {
        token.newsletterSubscribed = session.newsletterSubscribed;
        token.language = session.language;
        token.name = session.name;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.newsletterSubscribed = token.newsletterSubscribed;
        session.user.language = token.language;
      }

      return session;
    },
  },
  pages: {
    signIn: '/yugioh', // Redirect to yugioh page, modal will handle login
    error: '/yugioh', // Redirect errors to yugioh page
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};
