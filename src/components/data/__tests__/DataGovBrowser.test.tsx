import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { DataGovBrowser } from '../DataGovBrowser';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(() => new URLSearchParams()),
}));

// Mock next/link
jest.mock('next/link', () => {
  return function MockLink({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) {
    return <a href={href}>{children}</a>;
  };
});

// Mock ChartRenderer to avoid d3 import issues
jest.mock('@/components/charts/ChartRenderer', () => ({
  ChartRenderer: function MockChartRenderer() {
    return <div data-testid='mock-chart-renderer'>Chart</div>;
  },
}));

// Mock the hooks that fetch data
jest.mock('@/hooks/useDataset', () => ({
  useDatasetList: jest.fn(() => ({
    data: { data: [], total: 0 },
    isLoading: false,
    isError: false,
    error: null,
  })),
  useDataset: jest.fn(() => ({
    data: null,
    isLoading: false,
    isError: false,
  })),
  useResourceData: jest.fn(() => ({
    data: null,
    isLoading: false,
    isError: false,
  })),
  useBrowseFacets: jest.fn(() => ({
    data: {
      organizations: [],
      topics: [],
      formats: [],
      frequencies: [],
    },
    isLoading: false,
  })),
}));

// Mock useSearch hook
jest.mock('@/lib/hooks/useSearch', () => ({
  useSearch: jest.fn(() => ({
    setSearchParams: jest.fn(),
  })),
}));

// Mock priority datasets
jest.mock('@/lib/priority-datasets', () => ({
  PRIORITY_DATASET_PRESETS: [],
}));

// Mock data-gov-api utilities
jest.mock('@/lib/data-gov-api', () => ({
  buildPreviewRows: jest.fn(() => []),
  findPreviewableResource: jest.fn(() => null),
  isPreviewableFormat: jest.fn(() => false),
}));

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('DataGovBrowser', () => {
  beforeEach(() => {
    localStorageMock.clear();
    jest.clearAllMocks();
    cleanup();
  });

  afterEach(() => {
    cleanup();
  });

  describe('CatalogStatusBar integration', () => {
    it('shows CatalogStatusBar at the top of the content area', () => {
      render(<DataGovBrowser locale='sr-Cyrl' />);

      // CatalogStatusBar should show the source label
      expect(screen.getByText(/Извор:/)).toBeInTheDocument();
      // Should show data.gov.rs as the source
      expect(screen.getByText('data.gov.rs')).toBeInTheDocument();
    });

    it('shows CatalogStatusBar in English locale', () => {
      render(<DataGovBrowser locale='en' />);

      expect(screen.getByText(/Source:/)).toBeInTheDocument();
      expect(screen.getByText('data.gov.rs')).toBeInTheDocument();
    });

    it('shows CatalogStatusBar in Serbian Latin locale', () => {
      render(<DataGovBrowser locale='sr-Latn' />);

      expect(screen.getByText(/Izvor:/)).toBeInTheDocument();
      expect(screen.getByText('data.gov.rs')).toBeInTheDocument();
    });
  });

  describe('DataSourceSwitcher integration', () => {
    it('shows DataSourceSwitcher in the sidebar area', () => {
      render(<DataGovBrowser locale='sr-Cyrl' />);

      // DataSourceSwitcher should show the data source label
      expect(screen.getByText('Извор података')).toBeInTheDocument();
      // Should show the two options - use getAllByText since the text appears in multiple places
      const officialOptions = screen.getAllByText('Званични каталог');
      expect(officialOptions.length).toBeGreaterThan(0);
      expect(screen.getByText('Демо скупови')).toBeInTheDocument();
    });

    it('shows DataSourceSwitcher in English locale', () => {
      render(<DataGovBrowser locale='en' />);

      expect(screen.getByText('Data source')).toBeInTheDocument();
      const officialOptions = screen.getAllByText('Official catalog');
      expect(officialOptions.length).toBeGreaterThan(0);
      expect(screen.getByText('Demo datasets')).toBeInTheDocument();
    });

    it('shows DataSourceSwitcher in Serbian Latin locale', () => {
      render(<DataGovBrowser locale='sr-Latn' />);

      expect(screen.getByText('Izvor podataka')).toBeInTheDocument();
      const officialOptions = screen.getAllByText('Zvanični katalog');
      expect(officialOptions.length).toBeGreaterThan(0);
      expect(screen.getByText('Demo skupovi')).toBeInTheDocument();
    });
  });

  describe('ErrorFallbackBanner integration', () => {
    it('does not show ErrorFallbackBanner in default connecting status', () => {
      render(<DataGovBrowser locale='sr-Cyrl' />);

      // Should not show fallback banner when not in fallback mode
      expect(
        screen.queryByText('Званични каталог није доступан')
      ).not.toBeInTheDocument();
    });

    it('does not show ErrorFallbackBanner in English locale when not in fallback', () => {
      render(<DataGovBrowser locale='en' />);

      expect(
        screen.queryByText('Official catalog unavailable')
      ).not.toBeInTheDocument();
    });
  });

  describe('DataSourceProvider wrapper', () => {
    it('wraps content in DataSourceProvider', () => {
      // If the component renders without errors, it means the provider is working
      const { container } = render(<DataGovBrowser locale='sr-Cyrl' />);

      // The component should render without throwing "useDataSource must be used within a DataSourceProvider"
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('CatalogStatusBar has proper ARIA attributes', () => {
      render(<DataGovBrowser locale='sr-Cyrl' />);

      // CatalogStatusBar should have role="status"
      const statusBar = screen.getByRole('status', { name: /Извор/ });
      expect(statusBar).toBeInTheDocument();
    });

    it('DataSourceSwitcher has proper ARIA attributes', () => {
      render(<DataGovBrowser locale='sr-Cyrl' />);

      // DataSourceSwitcher should have role="radiogroup"
      const radioGroup = screen.getByRole('radiogroup', {
        name: 'Извор података',
      });
      expect(radioGroup).toBeInTheDocument();
    });
  });

  describe('Component structure', () => {
    it('renders without errors', () => {
      const { container } = render(<DataGovBrowser locale='sr-Cyrl' />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders in English locale without errors', () => {
      const { container } = render(<DataGovBrowser locale='en' />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders in Serbian Latin locale without errors', () => {
      const { container } = render(<DataGovBrowser locale='sr-Latn' />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('shows connecting status by default', () => {
      render(<DataGovBrowser locale='sr-Cyrl' />);
      expect(screen.getByText('Повезивање...')).toBeInTheDocument();
    });

    it('shows connecting status in English', () => {
      render(<DataGovBrowser locale='en' />);
      expect(screen.getByText('Connecting...')).toBeInTheDocument();
    });
  });
});
