import { render, screen, fireEvent } from '@testing-library/react';
import { FilterSection } from '../FilterSection';

const mockOptions = [
  { value: 'admin', label: 'Administration', count: 55 },
  { value: 'health', label: 'Health', count: 25 },
];

describe('FilterSection', () => {
  it('renders title and options with counts', () => {
    render(
      <FilterSection
        title='Themes'
        options={mockOptions}
        selectedValue={undefined}
        onSelect={jest.fn()}
        labels={{ showAll: 'Show all' }}
      />
    );

    expect(screen.getByText('Themes')).toBeInTheDocument();
    expect(screen.getByText('Administration')).toBeInTheDocument();
    // Find the button with "Administration" and check if it contains the count
    const adminButton = screen.getByRole('button', { name: /Administration/i });
    expect(adminButton).toBeInTheDocument();
    expect(adminButton).toHaveTextContent('(55)');

    expect(screen.getByText('Health')).toBeInTheDocument();
    const healthButton = screen.getByRole('button', { name: /Health/i });
    expect(healthButton).toBeInTheDocument();
    expect(healthButton).toHaveTextContent('(25)');
  });

  it('calls onSelect when option is clicked', () => {
    const onSelect = jest.fn();
    render(
      <FilterSection
        title='Themes'
        options={mockOptions}
        selectedValue={undefined}
        onSelect={onSelect}
        labels={{ showAll: 'Show all' }}
      />
    );

    // Find the button containing "Administration" text
    const adminButton = screen.getByRole('button', { name: /Administration/i });
    fireEvent.click(adminButton);
    expect(onSelect).toHaveBeenCalledWith('admin');
  });

  it('highlights selected option', () => {
    render(
      <FilterSection
        title='Themes'
        options={mockOptions}
        selectedValue='health'
        onSelect={jest.fn()}
        labels={{ showAll: 'Show all' }}
      />
    );

    const healthOption = screen.getByRole('button', { name: /Health/i });
    expect(healthOption).toHaveClass('bg-gov-secondary/10');
  });

  it('collapses and expands when header is clicked', () => {
    render(
      <FilterSection
        title='Themes'
        options={mockOptions}
        selectedValue={undefined}
        onSelect={jest.fn()}
        labels={{ showAll: 'Show all' }}
        defaultExpanded={true}
      />
    );

    // Initially expanded - options visible
    expect(
      screen.getByRole('button', { name: /Administration/i })
    ).toBeInTheDocument();

    // Click header to collapse
    fireEvent.click(screen.getByText('Themes'));
    expect(
      screen.queryByRole('button', { name: /Administration/i })
    ).not.toBeInTheDocument();
  });
});
