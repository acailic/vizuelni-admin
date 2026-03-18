import { render, screen, fireEvent } from '@testing-library/react';
import { CollapsibleFilters } from '../CollapsibleFilters';

const mockLabels = {
  filters: 'Filters',
  showFilters: 'Show filters',
  hideFilters: 'Hide filters',
};

describe('CollapsibleFilters', () => {
  it('renders toggle button with filters label', () => {
    render(
      <CollapsibleFilters
        activeFilterCount={0}
        labels={mockLabels}
        defaultExpanded={false}
      >
        <div>Filter content</div>
      </CollapsibleFilters>
    );

    const button = screen.getByRole('button', { name: /filters/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Filters');
  });

  it('shows badge when activeFilterCount > 0', () => {
    render(
      <CollapsibleFilters
        activeFilterCount={3}
        labels={mockLabels}
        defaultExpanded={false}
      >
        <div>Filter content</div>
      </CollapsibleFilters>
    );

    const badge = screen.getByText('3');
    expect(badge).toBeInTheDocument();
  });

  it('does not show badge when activeFilterCount is 0', () => {
    render(
      <CollapsibleFilters
        activeFilterCount={0}
        labels={mockLabels}
        defaultExpanded={false}
      >
        <div>Filter content</div>
      </CollapsibleFilters>
    );

    expect(screen.queryByText('0')).not.toBeInTheDocument();
  });

  it('is collapsed by default', () => {
    render(
      <CollapsibleFilters
        activeFilterCount={0}
        labels={mockLabels}
        defaultExpanded={false}
      >
        <div>Filter content</div>
      </CollapsibleFilters>
    );

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-expanded', 'false');

    const content = screen.getByText('Filter content');
    expect(content.closest('[aria-hidden="true"]')).toBeInTheDocument();
  });

  it('can be expanded by default', () => {
    render(
      <CollapsibleFilters
        activeFilterCount={0}
        labels={mockLabels}
        defaultExpanded={true}
      >
        <div>Filter content</div>
      </CollapsibleFilters>
    );

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-expanded', 'true');
  });

  it('toggles content when button is clicked', () => {
    render(
      <CollapsibleFilters
        activeFilterCount={0}
        labels={mockLabels}
        defaultExpanded={false}
      >
        <div>Filter content</div>
      </CollapsibleFilters>
    );

    const button = screen.getByRole('button');

    // Initially collapsed
    expect(button).toHaveAttribute('aria-expanded', 'false');

    // Click to expand
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');

    // Click to collapse
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  it('renders children when expanded', () => {
    render(
      <CollapsibleFilters
        activeFilterCount={0}
        labels={mockLabels}
        defaultExpanded={true}
      >
        <div data-testid='filter-content'>Filter content</div>
      </CollapsibleFilters>
    );

    expect(screen.getByTestId('filter-content')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(
      <CollapsibleFilters
        activeFilterCount={0}
        labels={mockLabels}
        defaultExpanded={false}
      >
        <div>Filter content</div>
      </CollapsibleFilters>
    );

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute(
      'aria-controls',
      'collapsible-filters-content'
    );
    expect(button).toHaveAttribute('aria-expanded', 'false');

    const content = screen.getByTestId('collapsible-filters-content');
    expect(content).toHaveAttribute('aria-hidden', 'true');
  });

  it('announces filter count to screen readers', () => {
    render(
      <CollapsibleFilters
        activeFilterCount={5}
        labels={mockLabels}
        defaultExpanded={false}
      >
        <div>Filter content</div>
      </CollapsibleFilters>
    );

    const badge = screen.getByLabelText(/5 filters active/i);
    expect(badge).toBeInTheDocument();
  });
});
