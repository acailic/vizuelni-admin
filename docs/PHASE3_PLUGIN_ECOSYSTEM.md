# Phase 3 Plugin Ecosystem: Marketplace & Development

> Detailed feature map for plugin system and marketplace
> Created: 2026-03-17

---

## Table of Contents

1. [Vision & Goals](#vision--goals)
2. [Plugin System Architecture](#plugin-system-architecture)
3. [Plugin Types](#plugin-types)
4. [Plugin Development Kit](#plugin-development-kit)
5. [Plugin Marketplace](#plugin-marketplace)
6. [Security & Sandboxing](#security--sandboxing)
7. [Implementation Phases](#implementation-phases)

---

## Vision & Goals

### Vision

Create a vibrant ecosystem where third-party developers can create, share, and monetize custom chart types, data connectors, and dashboard widgets.

### Goals

1. **Extensibility**: Allow anyone to extend platform capabilities
2. **Quality**: Maintain high standards through review process
3. **Monetization**: Enable developers to earn from plugins
4. **Security**: Ensure plugins are safe and sandboxed

---

## Plugin System Architecture

### Core Interfaces

```typescript
// packages/core/src/types/plugin.ts

/**
 * Base plugin interface that all plugins must implement
 */
export interface BasePlugin {
  metadata: PluginMetadata;
  register(registry: PluginRegistry): void | Promise<void>;
  initialize?(config?: any): Promise<void>;
  dispose?(): void | Promise<void>;
}

/**
 * Plugin metadata for identification and display
 */
export interface PluginMetadata {
  id: string; // unique identifier (e.g., "com.example.my-chart")
  name: string; // display name
  version: string; // semver
  description: string;
  author: PluginAuthor;
  category: PluginCategory;
  tags: string[];
  homepage?: string;
  repository?: string;
  license: string;
  minCoreVersion: string;
  maxCoreVersion?: string;
  peerDependencies?: Record<string, string>;
  icon?: string; // URL or base64
  screenshots?: string[]; // URLs to screenshots
  price?: number; // 0 for free
  currency?: 'EUR' | 'USD';
}

export type PluginCategory =
  | 'chart' // Custom visualization types
  | 'connector' // Data source integrations
  | 'transform' // Data transformation functions
  | 'theme' // Custom styling and colors
  | 'widget'; // Dashboard widgets

export interface PluginAuthor {
  name: string;
  email?: string;
  url?: string;
  organization?: string;
}

/**
 * Plugin registry for managing installed plugins
 */
export interface PluginRegistry {
  registerChartType(config: ChartPluginConfig): void;
  registerConnector(config: ConnectorPluginConfig): void;
  registerTransform(config: TransformPluginConfig): void;
  registerTheme(config: ThemePluginConfig): void;
  registerWidget(config: WidgetPluginConfig): void;

  getChartType(type: string): ChartPluginConfig | undefined;
  getConnector(id: string): ConnectorPluginConfig | undefined;
  getTransform(id: string): TransformPluginConfig | undefined;

  getAllCharts(): ChartPluginConfig[];
  getAllConnectors(): ConnectorPluginConfig[];
}
```

### Plugin Loader

```typescript
// packages/core/src/PluginLoader.ts

export class PluginLoader {
  private registry: PluginRegistry;
  private loadedPlugins: Map<string, BasePlugin> = new Map();

  /**
   * Load a plugin from a URL or npm package
   */
  async loadPlugin(source: string): Promise<BasePlugin> {
    // Load plugin module
    const module = await import(source);
    const PluginClass = module.default;

    // Instantiate plugin
    const plugin = new PluginClass();

    // Validate metadata
    this.validateMetadata(plugin.metadata);

    // Register plugin
    await plugin.register(this.registry);

    // Initialize plugin
    if (plugin.initialize) {
      await plugin.initialize();
    }

    // Track loaded plugin
    this.loadedPlugins.set(plugin.metadata.id, plugin);

    return plugin;
  }

  /**
   * Unload a plugin
   */
  async unloadPlugin(pluginId: string): Promise<void> {
    const plugin = this.loadedPlugins.get(pluginId);

    if (plugin) {
      if (plugin.dispose) {
        await plugin.dispose();
      }

      this.loadedPlugins.delete(pluginId);
    }
  }

  /**
   * Get all loaded plugins
   */
  getLoadedPlugins(): BasePlugin[] {
    return Array.from(this.loadedPlugins.values());
  }

  private validateMetadata(metadata: PluginMetadata): void {
    // Validate required fields
    // Check version compatibility
    // Verify dependencies
  }
}
```

---

## Plugin Types

### 1. Chart Plugins

```typescript
// packages/core/src/types/plugin.ts

export interface ChartPluginConfig {
  type: string; // Unique chart type identifier
  name: string; // Display name
  component: React.ComponentType<any>; // Chart component
  configSchema: JSONSchema; // Configuration schema
  icon: React.ComponentType; // Icon component
  defaultProps?: any; // Default configuration
  supports?: {
    animation?: boolean;
    interaction?: boolean;
    export?: boolean;
  };
}

// Example: Custom Radar Chart Plugin
export class RadarChartPlugin implements BasePlugin {
  metadata = {
    id: 'com.vizualni.radar-chart',
    name: 'Radar Chart',
    version: '1.0.0',
    category: 'chart',
    // ... other metadata
  };

  register(registry: PluginRegistry) {
    registry.registerChartType({
      type: 'radar',
      name: 'Radar Chart',
      component: RadarChartComponent,
      configSchema: radarChartSchema,
      icon: RadarIcon,
    });
  }
}
```

### 2. Data Connector Plugins

```typescript
export interface ConnectorPluginConfig {
  id: string;
  name: string;
  type: 'rest' | 'graphql' | 'database' | 'file';
  component: React.ComponentType<ConnectorProps>;
  configSchema: JSONSchema;
  client: DataSourceClient;
}

// Example: PostgreSQL Connector
export class PostgreSQLConnectorPlugin implements BasePlugin {
  metadata = {
    id: 'com.vizualni.postgresql-connector',
    name: 'PostgreSQL Connector',
    version: '1.0.0',
    category: 'connector',
    // ...
  };

  register(registry: PluginRegistry) {
    registry.registerConnector({
      id: 'postgresql',
      name: 'PostgreSQL',
      type: 'database',
      component: PostgreSQLConfig,
      configSchema: postgresqlSchema,
      client: PostgreSQLClient,
    });
  }
}
```

### 3. Transform Plugins

```typescript
export interface TransformPluginConfig {
  id: string;
  name: string;
  transform: (data: any[], config: any) => any[];
  configSchema?: JSONSchema;
  component?: React.ComponentType<TransformConfigProps>;
}

// Example: Moving Average Transform
export class MovingAverageTransformPlugin implements BasePlugin {
  metadata = {
    id: 'com.vizualni.moving-average',
    name: 'Moving Average',
    version: '1.0.0',
    category: 'transform',
    // ...
  };

  register(registry: PluginRegistry) {
    registry.registerTransform({
      id: 'moving-average',
      name: 'Moving Average',
      transform: (data, config) => {
        const window = config.windowSize || 7;
        return calculateMovingAverage(data, window);
      },
      configSchema: {
        type: 'object',
        properties: {
          windowSize: { type: 'number', default: 7 },
        },
      },
    });
  }
}
```

---

## Plugin Development Kit

### CLI Tool

```bash
# Install CLI
npm install -g @vizualni/plugin-cli

# Create new plugin
vizualni plugin create my-chart-plugin

# Options:
# --type [chart|connector|transform|theme|widget]
# --template [basic|advanced]
# --typescript

# Development mode
cd my-chart-plugin
vizualni plugin dev

# Build plugin
vizualni plugin build

# Test plugin
vizualni plugin test

# Publish to marketplace
vizualni plugin publish
```

### Plugin Template Structure

```
my-chart-plugin/
├── package.json
├── tsconfig.json
├── src/
│   ├── index.ts              # Plugin entry point
│   ├── MyChart.tsx           # Chart component
│   ├── config.ts             # Configuration schema
│   └── types.ts              # TypeScript types
├── test/
│   └── MyChart.test.tsx
├── README.md
├── CHANGELOG.md
└── vizualni-plugin.json      # Plugin manifest
```

---

## Plugin Marketplace

### Marketplace Features

1. **Browse & Search**
   - Filter by category
   - Search by name/tags
   - Sort by popularity/rating

2. **Plugin Details**
   - Screenshots & demos
   - Documentation
   - Reviews & ratings
   - Version history

3. **Installation**
   - One-click install
   - Automatic updates
   - Version management

4. **Developer Portal**
   - Submit plugins
   - Analytics dashboard
   - Revenue tracking

### Marketplace API

```typescript
// src/app/api/marketplace/plugins/route.ts

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const query = searchParams.get('query');
  const sort = searchParams.get('sort') || 'popularity';

  const plugins = await prisma.plugin.findMany({
    where: {
      published: true,
      ...(category && { category }),
      ...(query && {
        OR: [
          { name: { contains: query } },
          { description: { contains: query } },
          { tags: { has: query } },
        ],
      }),
    },
    include: {
      author: true,
      stats: true,
    },
    orderBy: getSortOrder(sort),
  });

  return Response.json(plugins);
}
```

---

## Security & Sandboxing

### Plugin Permissions

```typescript
// packages/core/src/types/plugin.ts

export interface PluginPermissions {
  // Data access
  readData?: boolean;
  writeData?: boolean;

  // Network access
  network?: {
    domains?: string[]; // Allowed domains
    methods?: ('GET' | 'POST' | 'PUT' | 'DELETE')[];
  };

  // UI access
  ui?: {
    modals?: boolean;
    notifications?: boolean;
  };

  // Storage
  storage?: {
    localStorage?: boolean;
    indexedDB?: boolean;
  };
}
```

### Plugin Validation

```typescript
// packages/core/src/PluginValidator.ts

export class PluginValidator {
  async validatePlugin(plugin: BasePlugin): Promise<ValidationResult> {
    const errors: string[] = [];

    // Check metadata
    if (!this.isValidMetadata(plugin.metadata)) {
      errors.push('Invalid plugin metadata');
    }

    // Check permissions
    if (!this.arePermissionsValid(plugin.permissions)) {
      errors.push('Invalid or excessive permissions requested');
    }

    // Scan for malicious code
    if (await this.containsMaliciousCode(plugin)) {
      errors.push('Plugin contains suspicious code');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
```

---

## Implementation Phases

### Phase 1: Core System (Months 19-21)

**Week 1-4: Plugin Infrastructure**

- Create plugin types and interfaces
- Implement PluginRegistry
- Build PluginLoader

**Week 5-8: Basic Plugins**

- Create 3-5 example plugins
- Test plugin loading
- Document plugin API

### Phase 2: Marketplace (Months 22-24)

**Week 9-12: Marketplace Backend**

- Create database schema
- Build API endpoints
- Implement plugin submission

**Week 13-16: Marketplace UI**

- Build browse/search UI
- Create plugin detail pages
- Implement installation flow

### Phase 3: Developer Tools (Months 25-27)

**Week 17-20: CLI & Templates**

- Build plugin CLI
- Create starter templates
- Write documentation

**Week 21-24: Review & Launch**

- Plugin review process
- Security scanning
- Launch marketplace

---

## Success Metrics

| Metric              | Target       | Timeline |
| ------------------- | ------------ | -------- |
| Core plugins        | 10+          | Month 24 |
| Third-party plugins | 50+          | Month 36 |
| Plugin installs     | 1000+        | Month 36 |
| Developer signups   | 100+         | Month 36 |
| Revenue             | €5000+/month | Month 36 |

---

## Next Steps

1. ✅ Create plugin ecosystem document
2. ⏳ Create core plugin types
3. ⏳ Create plugin marketplace API
4. ⏳ Create plugin development CLI
5. ⏳ Create plugin template

---

_Document Version: 1.0_
_Last Updated: 2026-03-17_
