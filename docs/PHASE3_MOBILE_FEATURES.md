# Phase 3 Mobile Features: Dashboard Builder

> Detailed feature map for mobile-first dashboard capabilities
> Created: 2026-03-17

---

## Table of Contents

1. [Vision & Goals](#vision--goals)
2. [Touch-Optimized Dashboard Editor](#touch-optimized-dashboard-editor)
3. [Mobile Dashboard Templates](#mobile-dashboard-templates)
4. [Responsive Chart Components](#responsive-chart-components)
5. [Offline Support (PWA)](#offline-support-pwa)
6. [Mobile Sharing & Export](#mobile-sharing--export)
7. [Implementation Phases](#implementation-phases)

---

## Vision & Goals

### Vision

Enable citizens and government officials to create, edit, and share dashboards on mobile devices with touch-optimized interfaces that work offline.

### Goals

1. **Touch-First Design**: All interactions optimized for touch
2. **Offline Capable**: Full PWA support with offline dashboards
3. **Performance**: Fast loading on mobile networks
4. **Responsive**: Seamless experience across device sizes

---

## Touch-Optimized Dashboard Editor

### Core Features

1. **Drag-and-drop chart placement**
   - Touch-friendly drag handles
   - Visual drop zones
   - Haptic feedback (where supported)

2. **Pinch-to-resize chart cards**
   - Gesture recognition
   - Snap-to-grid functionality
   - Minimum size constraints

3. **Swipe gestures for navigation**
   - Swipe between chart pages
   - Swipe to delete charts
   - Pull-to-refresh data

4. **Bottom sheet for configuration**
   - Slide-up panels
   - Large touch targets (44px minimum)
   - Stepper workflows

### Components

```typescript
// src/components/dashboard/mobile/MobileDashboardEditor.tsx
import { TouchDragContext } from './TouchDragContext';
import { BottomSheetConfig } from './BottomSheetConfig';

export function MobileDashboardEditor() {
  const [charts, setCharts] = useState<Chart[]>([]);
  const [selectedChart, setSelectedChart] = useState<string | null>(null);

  return (
    <Box>
      <TouchDragContext onDrop={handleDrop}>
        <DashboardGrid charts={charts} />
      </TouchDragContext>

      {selectedChart && (
        <BottomSheetConfig
          chartId={selectedChart}
          onClose={() => setSelectedChart(null)}
        />
      )}
    </Box>
  );
}
```

### Gesture Handling

```typescript
// src/components/dashboard/mobile/GestureHandler.tsx
export function useGestures(config: GestureConfig) {
  const [gesture, setGesture] = useState<Gesture | null>(null);

  // Tap detection
  const handleTap = (e: TouchEvent) => {
    if (e.touches.length === 1) {
      config.onTap?.(e);
    }
  };

  // Long press detection
  const handleLongPress = (e: TouchEvent) => {
    const timer = setTimeout(() => {
      config.onLongPress?.(e);
    }, 500);

    return () => clearTimeout(timer);
  };

  // Pinch detection
  const handlePinch = (e: TouchEvent) => {
    if (e.touches.length === 2) {
      const distance = getDistance(e.touches[0], e.touches[1]);
      config.onPinch?.(distance);
    }
  };

  return { gesture, handlers: { handleTap, handleLongPress, handlePinch } };
}
```

---

## Mobile Dashboard Templates

### Pre-built Templates

#### 1. Regional Overview

- Single-column layout
- Scrollable cards
- KPI + Chart + Map combination

#### 2. KPI Dashboard

- 2-column grid
- Large metrics
- Sparklines for trends

#### 3. Comparison View

- Horizontal scroll
- Side-by-side charts
- Swipe to compare

#### 4. Timeline View

- Vertical timeline
- Event-based layout
- Date navigation

### Template Structure

```typescript
// src/lib/dashboard/mobile-templates.ts
export const mobileDashboardTemplates = [
  {
    id: 'regional-overview',
    name: 'Преглед региона',
    nameEn: 'Regional Overview',
    layout: 'single-column',
    charts: [
      { type: 'kpi-card', span: 1 },
      { type: 'bar-chart', span: 1 },
      { type: 'map', span: 1 },
      { type: 'table', span: 1 },
    ],
  },
  {
    id: 'kpi-dashboard',
    name: 'KPI Контролна табла',
    nameEn: 'KPI Dashboard',
    layout: 'grid-2',
    charts: [
      { type: 'big-number', span: 1 },
      { type: 'sparkline', span: 1 },
      { type: 'big-number', span: 1 },
      { type: 'sparkline', span: 1 },
    ],
  },
  {
    id: 'comparison',
    name: 'Упоредни преглед',
    nameEn: 'Comparison View',
    layout: 'horizontal-scroll',
    charts: [
      { type: 'column-chart', span: 1 },
      { type: 'column-chart', span: 1 },
    ],
  },
];
```

---

## Responsive Chart Components

### Mobile Optimizations

1. **Simplified tooltips**
   - Tap to show (instead of hover)
   - Larger text
   - Close button

2. **Collapsible legends**
   - Expandable by default
   - Scrollable if many items
   - Tap to highlight series

3. **Horizontal scroll for tables**
   - Touch scrolling
   - Sticky first column
   - Column resize handles

4. **Touch-friendly filters**
   - Bottom sheet presentation
   - Large checkboxes
   - Clear all button

### Component Implementation

```typescript
// src/components/charts/mobile/MobileChartContainer.tsx
export function MobileChartContainer({ children, config }: Props) {
  const [tooltipData, setTooltipData] = useState(null);

  return (
    <Box position="relative">
      {children({
        onTouchStart: (e) => handleTouch(e),
        onTouchMove: (e) => handleTouchMove(e),
      })}

      {tooltipData && (
        <MobileTooltip
          data={tooltipData}
          onClose={() => setTooltipData(null)}
        />
      )}

      <MobileLegend items={config.legend} />
    </Box>
  );
}

// src/components/charts/mobile/MobileTooltip.tsx
export function MobileTooltip({ data, onClose }: Props) {
  return (
    <Box
      position="absolute"
      bottom={0}
      left={0}
      right={0}
      bg="white"
      p={4}
      borderTopRadius="lg"
      shadow="lg"
    >
      <Flex justify="space-between" mb={2}>
        <Text fontWeight="bold">{data.label}</Text>
        <IconButton icon={<CloseIcon />} onClick={onClose} size="sm" />
      </Flex>
      <Text>{data.value}</Text>
    </Box>
  );
}
```

---

## Offline Support (PWA)

### Service Worker

```javascript
// public/sw.js
const CACHE_NAME = 'vizualni-admin-v1';
const OFFLINE_URLS = ['/', '/dashboard', '/offline', '/manifest.json'];

// Install event - cache essential resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(OFFLINE_URLS);
    })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match('/offline');
      })
    );
  }

  // Cache dashboard data
  if (event.request.url.includes('/api/dashboard/')) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          return (
            response ||
            fetch(event.request).then((networkResponse) => {
              cache.put(event.request, networkResponse.clone());
              return networkResponse;
            })
          );
        });
      })
    );
  }
});

// Background sync
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-dashboards') {
    event.waitUntil(syncDashboards());
  }
});

async function syncDashboards() {
  // Sync offline changes when online
  const pendingChanges = await getPendingChanges();
  for (const change of pendingChanges) {
    await fetch('/api/dashboard/sync', {
      method: 'POST',
      body: JSON.stringify(change),
    });
  }
}
```

### Offline Dashboard Manager

```typescript
// src/lib/pwa/dashboard-sync.ts
export class DashboardSyncManager {
  private dbName = 'vizualni-admin-offline';
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

    return await store.getAll();
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

  private async openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event) => {
        const db = request.result;

        if (!db.objectStoreNames.contains('dashboards')) {
          db.createObjectStore('dashboards', { keyPath: 'id' });
        }

        if (!db.objectStoreNames.contains('pending-changes')) {
          db.createObjectStore('pending-changes', {
            keyPath: 'id',
            autoIncrement: true,
          });
        }
      };
    });
  }
}
```

---

## Mobile Sharing & Export

### Share Dashboard as Image

```typescript
// src/lib/mobile/share.ts
export async function shareDashboardAsImage(
  dashboardId: string
): Promise<void> {
  const element = document.getElementById(`dashboard-${dashboardId}`);

  if (!element) return;

  // Use html2canvas to capture dashboard
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
  });

  canvas.toBlob(async (blob) => {
    if (navigator.share) {
      // Use native sharing if available
      const file = new File([blob], 'dashboard.png', { type: 'image/png' });

      await navigator.share({
        title: 'My Dashboard',
        files: [file],
      });
    } else {
      // Fallback: download image
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'dashboard.png';
      a.click();
      URL.revokeObjectURL(url);
    }
  });
}
```

### QR Code Generation

```typescript
// src/lib/mobile/qr-code.ts
import QRCode from 'qrcode';

export async function generateDashboardQR(
  dashboardId: string
): Promise<string> {
  const url = `${window.location.origin}/dashboard/${dashboardId}`;
  const qrDataUrl = await QRCode.toDataURL(url, {
    width: 300,
    margin: 2,
  });

  return qrDataUrl;
}
```

---

## Mobile-First Design System

### Design Tokens

```typescript
// src/styles/mobile-tokens.ts
export const mobileDesignTokens = {
  touch: {
    minTargetSize: 44, // Apple HIG
    tapDelay: 100, // ms
    longPressDelay: 500, // ms
    swipeThreshold: 50, // px
  },

  spacing: {
    screenPadding: 16,
    cardGap: 12,
    sectionGap: 24,
    listItemPadding: 16,
  },

  typography: {
    minBodySize: 16, // Prevents iOS zoom
    headingSizes: {
      h1: 28,
      h2: 24,
      h3: 20,
      h4: 18,
    },
  },

  breakpoints: {
    mobile: '0-767px',
    tablet: '768-1023px',
    desktop: '1024px+',
  },

  animation: {
    transitionDuration: '200ms',
    springStiffness: 300,
    springDamping: 30,
  },
};
```

---

## Implementation Phases

### Phase 1: Foundation (Months 19-21)

**Week 1-4: Touch Infrastructure**

- Create mobile dashboard components
- Implement touch gesture handlers
- Build bottom sheet component

**Week 5-8: Responsive Charts**

- Create mobile chart containers
- Implement tap-tooltips
- Build collapsible legends

### Phase 2: PWA (Months 22-24)

**Week 9-12: Offline Support**

- Implement service worker
- Create IndexedDB storage
- Build sync manager

**Week 13-16: Sharing**

- Implement image export
- Add QR code generation
- Build native share integration

### Phase 3: Polish (Months 25-27)

**Week 17-20: Templates**

- Create mobile templates
- Build template selector
- Optimize for performance

**Week 21-24: Testing & Optimization**

- Test on various devices
- Optimize loading times
- Improve touch responsiveness

---

## Testing Strategy

### Device Testing

- iOS Safari (iPhone)
- Android Chrome
- iPad Safari
- Android tablets

### Performance Testing

- Lighthouse mobile audits
- Network throttling tests
- Memory usage profiling
- Battery impact testing

### Usability Testing

- Touch target sizes
- Gesture discoverability
- Navigation flow
- Offline experience

---

## Next Steps

1. ✅ Create mobile features document
2. ⏳ Create mobile dashboard components
3. ⏳ Create mobile chart components
4. ⏳ Create PWA infrastructure
5. ⏳ Create mobile design tokens
