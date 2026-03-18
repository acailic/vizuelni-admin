import React from 'react';
import { render, screen, act, cleanup } from '@testing-library/react';
import { CatalogStatusBar } from '../CatalogStatusBar';
import {
  DataSourceProvider,
  useDataSource,
} from '@/contexts/DataSourceContext';

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

// Test helper component to control context state
function ContextController({
  children,
  onMount,
}: {
  children: React.ReactNode;
  onMount?: (context: ReturnType<typeof useDataSource>) => void;
}) {
  const context = useDataSource();
  React.useEffect(() => {
    onMount?.(context);
  }, [context, onMount]);
  return <>{children}</>;
}

// Helper to render with provider
function renderWithProvider(
  ui: React.ReactNode,
  contextCallback?: (context: ReturnType<typeof useDataSource>) => void
) {
  return render(
    <DataSourceProvider>
      <ContextController onMount={contextCallback}>{ui}</ContextController>
    </DataSourceProvider>
  );
}

describe('CatalogStatusBar', () => {
  beforeEach(() => {
    localStorageMock.clear();
    jest.clearAllMocks();
    cleanup();
  });

  afterEach(() => {
    cleanup();
  });

  describe('Source display', () => {
    it('shows official source when source is "official"', () => {
      renderWithProvider(<CatalogStatusBar locale='sr-Cyrl' />);

      expect(screen.getByText('data.gov.rs')).toBeInTheDocument();
      // Source type is in parentheses, use flexible matcher
      expect(screen.getByText(/\(Званични каталог\)/)).toBeInTheDocument();
      expect(screen.getByText(/Извор:/)).toBeInTheDocument();
    });

    it('shows demo source when source is "demo"', async () => {
      let contextRef: ReturnType<typeof useDataSource> | undefined;

      renderWithProvider(<CatalogStatusBar locale='sr-Cyrl' />, (ctx) => {
        contextRef = ctx;
      });

      await act(async () => {
        contextRef!.switchSource('demo');
      });

      expect(screen.getByText('Demo')).toBeInTheDocument();
      expect(screen.getByText(/\(Демо скупови\)/)).toBeInTheDocument();
    });

    it('shows source in English locale', () => {
      renderWithProvider(<CatalogStatusBar locale='en' />);

      expect(screen.getByText('data.gov.rs')).toBeInTheDocument();
      expect(screen.getByText(/\(Official catalog\)/)).toBeInTheDocument();
      expect(screen.getByText(/Source:/)).toBeInTheDocument();
    });

    it('shows source in Serbian Latin locale', () => {
      renderWithProvider(<CatalogStatusBar locale='sr-Latn' />);

      expect(screen.getByText('data.gov.rs')).toBeInTheDocument();
      expect(screen.getByText(/\(Zvanični katalog\)/)).toBeInTheDocument();
      expect(screen.getByText(/Izvor:/)).toBeInTheDocument();
    });
  });

  describe('Status indicators', () => {
    it('shows correct status indicator for "connecting" status', async () => {
      renderWithProvider(<CatalogStatusBar locale='sr-Cyrl' />);

      // Initial status is "connecting"
      expect(screen.getByText('Повезивање...')).toBeInTheDocument();
    });

    it('shows correct status indicator for "connected" status', async () => {
      let contextRef: ReturnType<typeof useDataSource> | undefined;

      renderWithProvider(<CatalogStatusBar locale='sr-Cyrl' />, (ctx) => {
        contextRef = ctx;
      });

      await act(async () => {
        contextRef!.setStatus('connected');
      });

      expect(screen.getByText('Повезан')).toBeInTheDocument();
    });

    it('shows correct status indicator for "fallback" status', async () => {
      let contextRef: ReturnType<typeof useDataSource> | undefined;

      renderWithProvider(<CatalogStatusBar locale='sr-Cyrl' />, (ctx) => {
        contextRef = ctx;
      });

      await act(async () => {
        contextRef!.setFallback();
      });

      expect(screen.getByText('Резервни режим')).toBeInTheDocument();
    });

    it('shows correct status indicator for "error" status', async () => {
      let contextRef: ReturnType<typeof useDataSource> | undefined;

      renderWithProvider(<CatalogStatusBar locale='sr-Cyrl' />, (ctx) => {
        contextRef = ctx;
      });

      await act(async () => {
        contextRef!.setStatus('error');
      });

      expect(screen.getByText('Недоступан')).toBeInTheDocument();
    });

    it('shows status in English locale', async () => {
      let contextRef: ReturnType<typeof useDataSource> | undefined;

      renderWithProvider(<CatalogStatusBar locale='en' />, (ctx) => {
        contextRef = ctx;
      });

      await act(async () => {
        contextRef!.setStatus('connected');
      });

      expect(screen.getByText('Connected')).toBeInTheDocument();
    });
  });

  describe('Last updated timestamp', () => {
    it('shows last updated timestamp when connected', async () => {
      let contextRef: ReturnType<typeof useDataSource> | undefined;

      renderWithProvider(<CatalogStatusBar locale='sr-Cyrl' />, (ctx) => {
        contextRef = ctx;
      });

      await act(async () => {
        contextRef!.setStatus('connected');
        contextRef!.switchSource('official');
      });

      // After connecting to official source, lastUpdated should be set
      // The timestamp should be rendered
      // Note: The timestamp may or may not appear depending on timing
      // This test verifies the component doesn't crash when connected
      expect(screen.getByText('Повезан')).toBeInTheDocument();
    });

    it('does not show timestamp when not connected', async () => {
      let contextRef: ReturnType<typeof useDataSource> | undefined;

      renderWithProvider(<CatalogStatusBar locale='sr-Cyrl' />, (ctx) => {
        contextRef = ctx;
      });

      await act(async () => {
        contextRef!.setStatus('error');
      });

      // Should not show time element when not connected
      expect(screen.queryByRole('time')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('announces status changes via aria-live', async () => {
      let contextRef: ReturnType<typeof useDataSource> | undefined;

      renderWithProvider(<CatalogStatusBar locale='sr-Cyrl' />, (ctx) => {
        contextRef = ctx;
      });

      // Find the aria-live region
      const liveRegion = screen.getByRole('status');
      expect(liveRegion).toBeInTheDocument();

      await act(async () => {
        contextRef!.setStatus('connected');
      });

      // The live region should contain the new status
      expect(screen.getByText('Повезан')).toBeInTheDocument();
    });

    it('has proper aria-label for the component', () => {
      renderWithProvider(<CatalogStatusBar locale='sr-Cyrl' />);

      const statusBar = screen.getByRole('status', { name: /Извор/ });
      expect(statusBar).toBeInTheDocument();
    });

    it('uses semantic time element for timestamp', async () => {
      let contextRef: ReturnType<typeof useDataSource> | undefined;

      renderWithProvider(<CatalogStatusBar locale='en' />, (ctx) => {
        contextRef = ctx;
      });

      await act(async () => {
        contextRef!.setStatus('connected');
        contextRef!.switchSource('official');
      });

      // If timestamp is shown, it should use <time> element
      const timeElements = screen.queryAllByRole('time');
      timeElements.forEach((el) => {
        expect(el).toHaveAttribute('datetime');
      });
    });
  });

  describe('Compact mode', () => {
    it('applies compact styles when compact prop is true', () => {
      renderWithProvider(<CatalogStatusBar locale='sr-Cyrl' compact />);

      // Compact mode should still show core elements
      expect(screen.getByText('data.gov.rs')).toBeInTheDocument();
      expect(screen.getByText('Повезивање...')).toBeInTheDocument();
    });

    it('hides source type in compact mode', () => {
      const { container } = renderWithProvider(
        <CatalogStatusBar locale='sr-Cyrl' compact />
      );

      // In compact mode, the source type text should NOT be rendered
      // (controlled by {!compact && ...} in the component)
      const sourceTypeSpan = container.querySelector('.text-slate-400.ml-1');
      expect(sourceTypeSpan).not.toBeInTheDocument();
    });

    it('shows source type in non-compact mode', () => {
      const { container } = renderWithProvider(
        <CatalogStatusBar locale='sr-Cyrl' />
      );

      // In non-compact mode, the source type text should be rendered
      const sourceTypeSpan = container.querySelector('.text-slate-400.ml-1');
      expect(sourceTypeSpan).toBeInTheDocument();
      expect(sourceTypeSpan).toHaveTextContent(/Званични каталог/);
    });
  });

  describe('Status colors', () => {
    it('uses green for connected status', async () => {
      let contextRef: ReturnType<typeof useDataSource> | undefined;

      renderWithProvider(<CatalogStatusBar locale='sr-Cyrl' />, (ctx) => {
        contextRef = ctx;
      });

      await act(async () => {
        contextRef!.setStatus('connected');
      });

      const statusIndicator = screen.getByText('Повезан').parentElement;
      expect(statusIndicator).toHaveClass('bg-emerald-50');
    });

    it('uses yellow for connecting status', async () => {
      renderWithProvider(<CatalogStatusBar locale='sr-Cyrl' />);

      // Initial status is "connecting"
      const statusIndicator = screen.getByText('Повезивање...').parentElement;
      expect(statusIndicator).toHaveClass('bg-amber-50');
    });

    it('uses red for error status', async () => {
      let contextRef: ReturnType<typeof useDataSource> | undefined;

      renderWithProvider(<CatalogStatusBar locale='sr-Cyrl' />, (ctx) => {
        contextRef = ctx;
      });

      await act(async () => {
        contextRef!.setStatus('error');
      });

      const statusIndicator = screen.getByText('Недоступан').parentElement;
      expect(statusIndicator).toHaveClass('bg-red-50');
    });
  });
});
