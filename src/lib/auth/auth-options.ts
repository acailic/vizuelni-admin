import type { NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';
import prisma from '@/lib/db/prisma';
import { normalizeUserRole } from '@/types/auth';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),

  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID ?? '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? '',
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),
    // Email/password credentials provider
    CredentialsProvider({
      name: 'Email',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'name@example.com',
        },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Find user by email
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        // Verify password using bcrypt
        if (user && user.password) {
          const isValid = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (isValid) {
            return {
              id: user.id,
              email: user.email,
              name: user.name,
              image: user.image,
              role: normalizeUserRole(user.role),
            };
          }
        }

        return null;
      },
    }),
  ],

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  pages: {
    signIn: '/login',
    error: '/login',
  },

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Add user info to token on initial sign in
      if (user) {
        token.id = user.id;
        token.role = normalizeUserRole(user.role);
      }

      // Update token if session is updated
      if (trigger === 'update' && session?.user) {
        token.name = session.user.name ?? token.name;
        token.email = session.user.email ?? token.email;
        token.picture = session.user.image ?? token.picture;
        token.role = normalizeUserRole(session.user.role);
      }

      return token;
    },
    async session({ session, token }) {
      // Add id and role from token to session
      if (session.user && typeof token.id === 'string') {
        session.user.id = token.id;
        session.user.role = normalizeUserRole(token.role);
      }
      return session;
    },
    async signIn({ user, account }) {
      // For OAuth providers, ensure user has a role
      if (account?.provider !== 'credentials' && user.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        // If user doesn't exist yet, they'll be created by PrismaAdapter
        // with default role 'USER'
        if (dbUser) {
          user.role = normalizeUserRole(dbUser.role);
        }
      }
      return true;
    },
  },

  events: {
    async signIn({ user, isNewUser }) {
      // Log sign in for security audit
      if (process.env.NODE_ENV === 'development') {
        process.stdout.write(
          `[AUTH] User signed in: ${user.email} (new: ${isNewUser})\n`
        );
      }
    },
  },

  debug: process.env.NODE_ENV === 'development',
};

export default authOptions;
