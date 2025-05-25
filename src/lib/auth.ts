import { DrizzleAdapter } from '@auth/drizzle-adapter';
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import {
  accounts,
  db,
  sessions,
  users,
  verificationTokens,
} from '../../drizzle/schema';
import { eq } from 'drizzle-orm';

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
        token.role = user.role;
      }

      if (!token.role && token.userId) {
        try {
          const dbUser = await db
            .select()
            .from(users)
            .where(eq(users.id, token.userId as string))
            .limit(1)
            .then((rows) => rows[0]);

          if (dbUser) {
            token.role = dbUser.role;
          }
        } catch (error) {
          console.error('Error fetching user role:', error);
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.userId as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
});
