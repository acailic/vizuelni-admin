import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { ErrorFallbackBanner } from '../ErrorFallbackBanner';

describe('ErrorFallbackBanner', () => {
  const mockOnRetry = jest.fn();
  const mockOnAccept = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  afterEach(() => {
    cleanup();
  });

  describe('Content display', () => {
    it('shows title and description in Serbian Cyrillic', () => {
      render(
        <ErrorFallbackBanner
          locale='sr-Cyrl'
          onRetry={mockOnRetry}
          onAccept={mockOnAccept}
        />
      );

      expect(
        screen.getByText('Званични каталог није доступан')
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          /Нисмо успели да учитамо податке са data.gov.rs након 2 покушаја/
        )
      ).toBeInTheDocument();
    });

    it('shows title and description in Serbian Latin', () => {
      render(
        <ErrorFallbackBanner
          locale='sr-Latn'
          onRetry={mockOnRetry}
          onAccept={mockOnAccept}
        />
      );

      expect(
        screen.getByText('Zvanični katalog nije dostupan')
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          /Nismo uspeli da učitamo podatke sa data.gov.rs nakon 2 pokušaja/
        )
      ).toBeInTheDocument();
    });

    it('shows title and description in English', () => {
      render(
        <ErrorFallbackBanner
          locale='en'
          onRetry={mockOnRetry}
          onAccept={mockOnAccept}
        />
      );

      expect(
        screen.getByText('Official catalog unavailable')
      ).toBeInTheDocument();
      expect(
        screen.getByText(/We could not load data from data.gov.rs/)
      ).toBeInTheDocument();
    });

    it('shows retry and accept buttons', () => {
      render(
        <ErrorFallbackBanner
          locale='sr-Cyrl'
          onRetry={mockOnRetry}
          onAccept={mockOnAccept}
        />
      );

      expect(
        screen.getByRole('button', { name: /Покушај поново са званичним/ })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /Настави са демо/ })
      ).toBeInTheDocument();
    });
  });

  describe('Button actions', () => {
    it('retry button calls onRetry', () => {
      render(
        <ErrorFallbackBanner
          locale='sr-Cyrl'
          onRetry={mockOnRetry}
          onAccept={mockOnAccept}
        />
      );

      const retryButton = screen.getByRole('button', {
        name: /Покушај поново са званичним/,
      });
      fireEvent.click(retryButton);

      expect(mockOnRetry).toHaveBeenCalledTimes(1);
      expect(mockOnAccept).not.toHaveBeenCalled();
    });

    it('accept button calls onAccept', () => {
      render(
        <ErrorFallbackBanner
          locale='sr-Cyrl'
          onRetry={mockOnRetry}
          onAccept={mockOnAccept}
        />
      );

      const acceptButton = screen.getByRole('button', {
        name: /Настави са демо/,
      });
      fireEvent.click(acceptButton);

      expect(mockOnAccept).toHaveBeenCalledTimes(1);
      expect(mockOnRetry).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('has role="alert"', () => {
      render(
        <ErrorFallbackBanner
          locale='sr-Cyrl'
          onRetry={mockOnRetry}
          onAccept={mockOnAccept}
        />
      );

      const alert = screen.getByRole('alert');
      expect(alert).toBeInTheDocument();
    });

    it('has aria-live="polite"', () => {
      const { container } = render(
        <ErrorFallbackBanner
          locale='sr-Cyrl'
          onRetry={mockOnRetry}
          onAccept={mockOnAccept}
        />
      );

      const alert = container.querySelector('[aria-live="polite"]');
      expect(alert).toBeInTheDocument();
    });

    it('has focusable buttons', () => {
      render(
        <ErrorFallbackBanner
          locale='sr-Cyrl'
          onRetry={mockOnRetry}
          onAccept={mockOnAccept}
        />
      );

      const retryButton = screen.getByRole('button', {
        name: /Покушај поново са званичним/,
      });
      const acceptButton = screen.getByRole('button', {
        name: /Настави са демо/,
      });

      // Buttons should not have tabIndex=-1 (they should be focusable)
      expect(retryButton).not.toHaveAttribute('tabindex', '-1');
      expect(acceptButton).not.toHaveAttribute('tabindex', '-1');
    });
  });

  describe('Visual styling', () => {
    it('has amber warning styling', () => {
      const { container } = render(
        <ErrorFallbackBanner
          locale='sr-Cyrl'
          onRetry={mockOnRetry}
          onAccept={mockOnAccept}
        />
      );

      const banner = container.firstChild as HTMLElement;
      expect(banner).toHaveClass('bg-amber-50');
      expect(banner).toHaveClass('border-amber-200');
    });

    it('retry button has primary action styling', () => {
      render(
        <ErrorFallbackBanner
          locale='sr-Cyrl'
          onRetry={mockOnRetry}
          onAccept={mockOnAccept}
        />
      );

      const retryButton = screen.getByRole('button', {
        name: /Покушај поново са званичним/,
      });
      expect(retryButton).toHaveClass('bg-amber-600');
      expect(retryButton).toHaveClass('text-white');
    });

    it('accept button has secondary action styling', () => {
      render(
        <ErrorFallbackBanner
          locale='sr-Cyrl'
          onRetry={mockOnRetry}
          onAccept={mockOnAccept}
        />
      );

      const acceptButton = screen.getByRole('button', {
        name: /Настави са демо/,
      });
      expect(acceptButton).toHaveClass('bg-white');
      expect(acceptButton).toHaveClass('text-amber-700');
    });
  });
});
