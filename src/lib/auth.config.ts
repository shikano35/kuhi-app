import type { NextAuthConfig } from 'next-auth';

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: '/auth/login',
    signOut: '/auth/logout',
    error: '/auth/error',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAdminRoute = nextUrl.pathname.startsWith('/admin');
      const isContributeRoute = nextUrl.pathname.startsWith('/contribute');
      
      if (isAdminRoute) {
        if (!isLoggedIn) return false;
        return (auth?.user as { role?: string })?.role === 'admin';
      }
      
      if (isContributeRoute && !isLoggedIn) {
        return false;
      }
      
      return true;
    },
  },
  providers: [],
}; 