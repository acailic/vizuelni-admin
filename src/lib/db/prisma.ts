import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * Check if we're in demo mode (no database)
 */
export function isDemoMode(): boolean {
  if (process.env.DEMO_MODE === 'true') return true;
  if (!process.env.DATABASE_URL) return true;
  if (process.env.BUILD_MODE === 'static') return true;
  return false;
}

/**
 * Prisma client - only instantiated when DATABASE_URL is available
 * In demo mode, this will be undefined and should not be used
 */
export const prisma = isDemoMode()
  ? (undefined as unknown as PrismaClient)
  : (globalForPrisma.prisma ??
    new PrismaClient({
      log:
        process.env.NODE_ENV === 'development'
          ? ['query', 'error', 'warn']
          : ['error'],
    }));

if (process.env.NODE_ENV !== 'production' && !isDemoMode()) {
  globalForPrisma.prisma = prisma;
}

export default prisma;
