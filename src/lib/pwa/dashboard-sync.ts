/**
 * @file dashboard-sync.ts
 * @description Offline dashboard sync manager
 */

export interface Dashboard {
  id: string;
  name: string;
  charts: any[];
  savedAt: string;
  synced: boolean;
}

export class DashboardSyncManager {
  private dbName = 'vizuelni-admin-offline';
  private dbVersion = 1;

  async saveOffline(dashboard: Dashboard): Promise<void> {
    const db = await this.openDB();
    const tx = db.transaction('dashboards', 'readwrite');
    const store = tx.objectStore('dashboards');

    await store.put({
      ...dashboard,
      savedAt: new Date().toISOString(),
      synced: false,
    });
  }

  async getOfflineDashboards(): Promise<Dashboard[]> {
    const db = await this.openDB();
    const tx = db.transaction('dashboards', 'readonly');
    const store = tx.objectStore('dashboards');

    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result as Dashboard[]);
    });
  }

  async syncWhenOnline(): Promise<void> {
    if (navigator.onLine) {
      const dashboards = await this.getOfflineDashboards();
      const unsynced = dashboards.filter((d) => !d.synced);

      for (const dashboard of unsynced) {
        await this.syncDashboard(dashboard);
      }
    }
  }

  private async syncDashboard(dashboard: Dashboard): Promise<void> {
    console.log('[DashboardSync] Syncing:', dashboard.id);
  }

  private async openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (_event) => {
        const db = request.result;

        if (!db.objectStoreNames.contains('dashboards')) {
          db.createObjectStore('dashboards', { keyPath: 'id' });
        }
      };
    });
  }
}

export const dashboardSyncManager = new DashboardSyncManager();
