import type { DefaultSession, DefaultUser } from 'next-auth';
import 'next-auth';
import 'next-auth/jwt';
import type { UserRole } from '@/types/auth';

declare module 'next-auth' {
  interface Session {
    user?: DefaultSession['user'] & {
      id: string;
      role?: UserRole;
    };
  }

  interface User extends DefaultUser {
    role?: UserRole;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    role?: UserRole;
  }
}
