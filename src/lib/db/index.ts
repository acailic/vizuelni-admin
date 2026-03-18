// Re-export prisma client
export { default as prisma, prisma as prismaClient } from './prisma';

// Re-export CRUD functions
export * from './charts';

// Repository implementations
export { PrismaChartRepository } from './chart-repository-prisma';
export { DemoChartRepository, isDemoMode } from './chart-repository-demo';

// Repository factory with demo mode support
import { ChartRepository } from '@vizualni/charts';
import { PrismaChartRepository } from './chart-repository-prisma';
import { DemoChartRepository, isDemoMode } from './chart-repository-demo';

let repositoryInstance: ChartRepository | null = null;

export function getChartRepository(): ChartRepository {
  if (!repositoryInstance) {
    repositoryInstance = isDemoMode()
      ? new DemoChartRepository()
      : new PrismaChartRepository();
  }
  return repositoryInstance;
}

export function setChartRepository(repository: ChartRepository | null): void {
  repositoryInstance = repository;
}
