import { render, screen } from '@testing-library/react';
import { FilterSidebar } from '../FilterSidebar';
import { useSearch } from '@/lib/hooks/useSearch';

jest.mock('@/lib/hooks/useSearch');

const mockFacets = {
  organizations: [{ value: 'org1', label: 'Organization 1', count: 10 }],
  topics: [{ value: 'topic1', label: 'Topic 1', count: 5 }],
  formats: [],
  frequencies: [],
};

const mockLabels = {
  title: 'Filters',
  organization: 'Organizations',
  topic: 'Topics',
  format: 'Format',
  frequency: 'Frequency',
  clear: 'Clear',
  all: 'All',
  showAll: 'Show all',
};

describe('FilterSidebar', () => {
  beforeEach(() => {
    const mockUseSearch = useSearch as jest.MockedFunction<typeof useSearch>;
    mockUseSearch.mockReturnValue({
      searchParams: new URLSearchParams(),
      setSearchParams: jest.fn(),
    });
  });

  it('renders collapsible sections for themes and organizations', () => {
    render(
      <FilterSidebar facets={mockFacets} labels={mockLabels} selected={{}} />
    );

    expect(screen.getByText('Topics')).toBeInTheDocument();
    expect(screen.getByText('Organizations')).toBeInTheDocument();
  });
});
