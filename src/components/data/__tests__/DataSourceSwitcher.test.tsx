import React from 'react';
import {
  render,
  screen,
  fireEvent,
  act,
  cleanup,
} from '@testing-library/react';
import { DataSourceSwitcher } from '../DataSourceSwitcher';
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

describe('DataSourceSwitcher', () => {
  beforeEach(() => {
    localStorageMock.clear();
    jest.clearAllMocks();
    cleanup();
  });

  afterEach(() => {
    cleanup();
  });

  describe('Display options', () => {
    it('shows both source options', () => {
      renderWithProvider(<DataSourceSwitcher locale='sr-Cyrl' />);

      expect(screen.getByText('Званични каталог')).toBeInTheDocument();
      expect(screen.getByText('Демо скупови')).toBeInTheDocument();
    });

    it('shows source options in English locale', () => {
      renderWithProvider(<DataSourceSwitcher locale='en' />);

      expect(screen.getByText('Official catalog')).toBeInTheDocument();
      expect(screen.getByText('Demo datasets')).toBeInTheDocument();
    });

    it('shows source options in Serbian Latin locale', () => {
      renderWithProvider(<DataSourceSwitcher locale='sr-Latn' />);

      expect(screen.getByText('Zvanični katalog')).toBeInTheDocument();
      expect(screen.getByText('Demo skupovi')).toBeInTheDocument();
    });
  });

  describe('Default selection', () => {
    it('official source selected by default', () => {
      renderWithProvider(<DataSourceSwitcher locale='sr-Cyrl' />);

      const officialOption = screen.getByRole('radio', {
        name: /Званични каталог/,
      });
      const demoOption = screen.getByRole('radio', { name: /Демо скупови/ });

      expect(officialOption).toHaveAttribute('aria-checked', 'true');
      expect(demoOption).toHaveAttribute('aria-checked', 'false');
    });
  });

  describe('Switching sources', () => {
    it('clicking demo option switches source', async () => {
      let contextRef: ReturnType<typeof useDataSource> | undefined;

      renderWithProvider(<DataSourceSwitcher locale='sr-Cyrl' />, (ctx) => {
        contextRef = ctx;
      });

      const demoOption = screen.getByRole('radio', { name: /Демо скупови/ });

      await act(async () => {
        fireEvent.click(demoOption);
      });

      // Check context was updated
      expect(contextRef!.source).toBe('demo');

      // Check visual state
      expect(demoOption).toHaveAttribute('aria-checked', 'true');
    });

    it('clicking official option switches back from demo', async () => {
      let contextRef: ReturnType<typeof useDataSource> | undefined;

      renderWithProvider(<DataSourceSwitcher locale='sr-Cyrl' />, (ctx) => {
        contextRef = ctx;
      });

      // First switch to demo
      await act(async () => {
        contextRef!.switchSource('demo');
      });

      // Now click official
      const officialOption = screen.getByRole('radio', {
        name: /Званични каталог/,
      });

      await act(async () => {
        fireEvent.click(officialOption);
      });

      expect(contextRef!.source).toBe('official');
      expect(officialOption).toHaveAttribute('aria-checked', 'true');
    });
  });

  describe('Keyboard accessibility', () => {
    it('has proper radiogroup role', () => {
      renderWithProvider(<DataSourceSwitcher locale='sr-Cyrl' />);

      const radioGroup = screen.getByRole('radiogroup', {
        name: /Извор података/,
      });
      expect(radioGroup).toBeInTheDocument();
    });

    it('selected option is focusable (tabIndex 0)', () => {
      renderWithProvider(<DataSourceSwitcher locale='sr-Cyrl' />);

      const officialOption = screen.getByRole('radio', {
        name: /Званични каталог/,
      });
      expect(officialOption).toHaveAttribute('tabIndex', '0');
    });

    it('unselected option has tabIndex -1', () => {
      renderWithProvider(<DataSourceSwitcher locale='sr-Cyrl' />);

      const demoOption = screen.getByRole('radio', { name: /Демо скупови/ });
      expect(demoOption).toHaveAttribute('tabIndex', '-1');
    });

    it('space key selects option', async () => {
      let contextRef: ReturnType<typeof useDataSource> | undefined;

      renderWithProvider(<DataSourceSwitcher locale='sr-Cyrl' />, (ctx) => {
        contextRef = ctx;
      });

      const demoOption = screen.getByRole('radio', { name: /Демо скупови/ });

      await act(async () => {
        fireEvent.keyDown(demoOption, { key: ' ' });
      });

      expect(contextRef!.source).toBe('demo');
    });

    it('enter key selects option', async () => {
      let contextRef: ReturnType<typeof useDataSource> | undefined;

      renderWithProvider(<DataSourceSwitcher locale='sr-Cyrl' />, (ctx) => {
        contextRef = ctx;
      });

      const demoOption = screen.getByRole('radio', { name: /Демо скупови/ });

      await act(async () => {
        fireEvent.keyDown(demoOption, { key: 'Enter' });
      });

      expect(contextRef!.source).toBe('demo');
    });

    it('arrow down key moves to next option', async () => {
      let contextRef: ReturnType<typeof useDataSource> | undefined;

      renderWithProvider(<DataSourceSwitcher locale='sr-Cyrl' />, (ctx) => {
        contextRef = ctx;
      });

      const officialOption = screen.getByRole('radio', {
        name: /Званични каталог/,
      });

      await act(async () => {
        fireEvent.keyDown(officialOption, { key: 'ArrowDown' });
      });

      expect(contextRef!.source).toBe('demo');
    });

    it('arrow right key moves to next option', async () => {
      let contextRef: ReturnType<typeof useDataSource> | undefined;

      renderWithProvider(<DataSourceSwitcher locale='sr-Cyrl' />, (ctx) => {
        contextRef = ctx;
      });

      const officialOption = screen.getByRole('radio', {
        name: /Званични каталог/,
      });

      await act(async () => {
        fireEvent.keyDown(officialOption, { key: 'ArrowRight' });
      });

      expect(contextRef!.source).toBe('demo');
    });

    it('arrow up key moves to previous option', async () => {
      let contextRef: ReturnType<typeof useDataSource> | undefined;

      renderWithProvider(<DataSourceSwitcher locale='sr-Cyrl' />, (ctx) => {
        contextRef = ctx;
      });

      // Start with demo selected
      await act(async () => {
        contextRef!.switchSource('demo');
      });

      const demoOption = screen.getByRole('radio', { name: /Демо скупови/ });

      await act(async () => {
        fireEvent.keyDown(demoOption, { key: 'ArrowUp' });
      });

      expect(contextRef!.source).toBe('official');
    });
  });

  describe('Visual styling', () => {
    it('selected option has blue styling', () => {
      renderWithProvider(<DataSourceSwitcher locale='sr-Cyrl' />);

      const officialOption = screen.getByRole('radio', {
        name: /Званични каталог/,
      });

      expect(officialOption).toHaveClass('bg-blue-50');
      expect(officialOption).toHaveClass('border-blue-200');
      expect(officialOption).toHaveClass('text-blue-700');
    });

    it('unselected option has neutral styling', () => {
      renderWithProvider(<DataSourceSwitcher locale='sr-Cyrl' />);

      const demoOption = screen.getByRole('radio', { name: /Демо скупови/ });

      expect(demoOption).toHaveClass('bg-white');
      expect(demoOption).toHaveClass('border-slate-200');
      expect(demoOption).toHaveClass('text-slate-600');
    });
  });
});
