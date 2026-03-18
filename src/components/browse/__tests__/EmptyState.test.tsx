import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { EmptyState } from '../EmptyState';

describe('EmptyState', () => {
  beforeEach(() => {
    cleanup();
  });

  afterEach(() => {
    cleanup();
  });

  describe('Basic rendering', () => {
    it('renders title and description', () => {
      render(
        <EmptyState
          title='No datasets found'
          description='Try adjusting your filters or search criteria.'
        />
      );

      expect(screen.getByText('No datasets found')).toBeInTheDocument();
      expect(
        screen.getByText('Try adjusting your filters or search criteria.')
      ).toBeInTheDocument();
    });

    it('has role="status" for accessibility', () => {
      const { container } = render(
        <EmptyState title='Empty' description='Nothing here' />
      );

      const status = container.querySelector('[role="status"]');
      expect(status).toBeInTheDocument();
    });

    it('has aria-live="polite" for accessibility', () => {
      const { container } = render(
        <EmptyState title='Empty' description='Nothing here' />
      );

      const live = container.querySelector('[aria-live="polite"]');
      expect(live).toBeInTheDocument();
    });
  });

  describe('Variants', () => {
    it('default variant is "empty"', () => {
      const { container } = render(
        <EmptyState title='Empty' description='Nothing here' />
      );

      const stateDiv = container.firstChild as HTMLElement;
      expect(stateDiv).toHaveClass('border-slate-300');
      expect(stateDiv).toHaveClass('bg-white');
    });

    it('"empty" variant shows inbox icon', () => {
      const { container } = render(
        <EmptyState title='Empty' description='Nothing here' variant='empty' />
      );

      // Check for inbox icon by looking for SVG path
      const icon = container.querySelector('svg');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveClass('text-slate-400');
    });

    it('"error" variant shows alert icon with red styling', () => {
      const { container } = render(
        <EmptyState
          title='Error occurred'
          description='Something went wrong'
          variant='error'
        />
      );

      const stateDiv = container.firstChild as HTMLElement;
      expect(stateDiv).toHaveClass('border-red-300');
      expect(stateDiv).toHaveClass('bg-red-50');

      const icon = container.querySelector('svg');
      expect(icon).toHaveClass('text-red-500');
    });

    it('"offline" variant shows wifi-off icon with amber styling', () => {
      const { container } = render(
        <EmptyState
          title='You are offline'
          description='Check your connection'
          variant='offline'
        />
      );

      const stateDiv = container.firstChild as HTMLElement;
      expect(stateDiv).toHaveClass('border-amber-300');
      expect(stateDiv).toHaveClass('bg-amber-50');

      const icon = container.querySelector('svg');
      expect(icon).toHaveClass('text-amber-500');
    });
  });

  describe('Action buttons', () => {
    it('does not show actions when not provided', () => {
      render(<EmptyState title='Empty' description='Nothing here' />);

      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('renders single action button', () => {
      const handleRetry = jest.fn();

      render(
        <EmptyState
          title='Error'
          description='Failed to load'
          variant='error'
          actions={[{ label: 'Retry', onClick: handleRetry }]}
        />
      );

      const retryButton = screen.getByRole('button', { name: 'Retry' });
      expect(retryButton).toBeInTheDocument();

      fireEvent.click(retryButton);
      expect(handleRetry).toHaveBeenCalledTimes(1);
    });

    it('renders multiple action buttons', () => {
      const handleRetry = jest.fn();
      const handleUseDemo = jest.fn();

      render(
        <EmptyState
          title='Offline'
          description='No connection'
          variant='offline'
          actions={[
            { label: 'Retry', onClick: handleRetry, variant: 'primary' },
            {
              label: 'Use demo data',
              onClick: handleUseDemo,
              variant: 'secondary',
            },
          ]}
        />
      );

      expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Use demo data' })
      ).toBeInTheDocument();
    });

    it('primary action has blue styling', () => {
      const handleClick = jest.fn();

      render(
        <EmptyState
          title='Empty'
          description='Nothing here'
          actions={[
            { label: 'Action', onClick: handleClick, variant: 'primary' },
          ]}
        />
      );

      const button = screen.getByRole('button', { name: 'Action' });
      expect(button).toHaveClass('bg-blue-600');
      expect(button).toHaveClass('text-white');
    });

    it('secondary action has neutral styling', () => {
      const handleClick = jest.fn();

      render(
        <EmptyState
          title='Empty'
          description='Nothing here'
          actions={[
            { label: 'Action', onClick: handleClick, variant: 'secondary' },
          ]}
        />
      );

      const button = screen.getByRole('button', { name: 'Action' });
      expect(button).toHaveClass('bg-white');
      expect(button).toHaveClass('text-slate-700');
    });

    it('default action variant is primary', () => {
      const handleClick = jest.fn();

      render(
        <EmptyState
          title='Empty'
          description='Nothing here'
          actions={[{ label: 'Action', onClick: handleClick }]}
        />
      );

      const button = screen.getByRole('button', { name: 'Action' });
      expect(button).toHaveClass('bg-blue-600');
      expect(button).toHaveClass('text-white');
    });
  });

  describe('Custom className', () => {
    it('applies custom className', () => {
      const { container } = render(
        <EmptyState
          title='Empty'
          description='Nothing here'
          className='custom-class'
        />
      );

      const stateDiv = container.firstChild as HTMLElement;
      expect(stateDiv).toHaveClass('custom-class');
    });
  });
});
