// Note: For static builds (GitHub Pages), Prisma client is mocked
// The actual PrismaClient is not available without the generated types
// For production with database, DATABASE_URL must be set

/**
 * Global Prisma client
 *
 * Only one instance of Prisma is kept across hot reloads to prevent
 * "FATAL: sorry, too many clients already" error.
 * @see https://github.com/prisma/prisma/issues/1983
 */

// Mock PrismaClient for static builds (no database)
class MockPrismaClient {
  config = {
    create: async () => ({}),
    update: async () => ({}),
    delete: async () => ({}),
    findMany: async () => [],
    findUnique: async () => null,
    findFirst: async () => null,
    upsert: async () => ({}),
  } as any;
  user = {
    create: async () => ({}),
    update: async () => ({}),
    delete: async () => ({}),
    findMany: async () => [],
    findUnique: async () => null,
    findFirst: async () => null,
    upsert: async () => ({}),
  } as any;
  palette = {
    create: async () => ({}),
    update: async () => ({}),
    delete: async () => ({}),
    findMany: async () => [],
    findUnique: async () => null,
    findFirst: async () => null,
    upsert: async () => ({}),
  } as any;
  configView = {
    create: async () => ({}),
    update: async () => ({}),
    delete: async () => ({}),
    findMany: async () => [],
    findUnique: async () => null,
    findFirst: async () => null,
    upsert: async () => ({}),
  } as any;
  $disconnect = async () => {};
  $connect = async () => {};
  $queryRaw = async <T = any>(
    _query: TemplateStringsArray,
    ..._values: any[]
  ): Promise<T> => [] as T;
}

// Check if we have a database connection available
export const hasDatabase = !!process.env.DATABASE_URL;

// Type for PrismaClient - use mock type since @prisma/client may not be installed
type PrismaClient = MockPrismaClient;
let prisma: PrismaClient;

const g = global as unknown as { prisma: PrismaClient | undefined };

/**
 * Create a Prisma client instance.
 * In production with DATABASE_URL, this will attempt to load the real PrismaClient.
 * Falls back to mock if Prisma is not available.
 */
async function createPrismaClient(): Promise<PrismaClient> {
  if (hasDatabase) {
    try {
      // Dynamic import to avoid bundling Prisma in static builds
      // The @ts-ignore is needed because @prisma/client may not be installed
      // @ts-ignore
      const { PrismaClient } = await import("@prisma/client");
      return new PrismaClient({
        log:
          process.env.NODE_ENV === "development"
            ? ["query", "error", "warn"]
            : ["error"],
      });
    } catch (error) {
      console.warn(
        "Failed to initialize PrismaClient, falling back to mock:",
        error
      );
      return new MockPrismaClient();
    }
  }
  return new MockPrismaClient();
}

// Synchronous initialization for compatibility
// In production with DATABASE_URL, this will use mock initially and log a warning
// The real client should be initialized via createPrismaClient() for async contexts
if (process.env.NODE_ENV === "production") {
  if (hasDatabase) {
    // Log warning: async initialization required for production database
    console.warn(
      "DATABASE_URL is set but PrismaClient requires async initialization. " +
        "Call createPrismaClient() for proper database connection."
    );
  }
  prisma = new MockPrismaClient();
} else {
  if (!g.prisma) {
    g.prisma = new MockPrismaClient();
  }
  prisma = g.prisma;
}

export { prisma, createPrismaClient };
