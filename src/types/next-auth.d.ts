import { DefaultSession, DefaultUser } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      role?: string;
      bio?: string;
      emailNotifications?: boolean;
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    role?: string;
    bio?: string;
    emailNotifications?: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: string;
    bio?: string;
    emailNotifications?: boolean;
  }
}
