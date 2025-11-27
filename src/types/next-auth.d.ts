import { DefaultSession, DefaultUser } from 'next-auth';
import { JWT, DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
      newsletterSubscribed?: boolean;
      language?: 'es' | 'en';
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    id: string;
    newsletterSubscribed?: boolean;
    language?: 'es' | 'en';
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id: string;
    newsletterSubscribed?: boolean;
    language?: 'es' | 'en';
  }
}
