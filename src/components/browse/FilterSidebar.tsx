'use client';

import { useSearch } from '@/lib/hooks/useSearch';
import { FilterSection } from './FilterSection';
import type { BrowseFacets, BrowseSearchParams } from '@/types/browse';

interface FilterSidebarLabels {
  title: string;
  organization: string;
  topic: string;
  format: string;
  frequency: string;
  clear: string;
  all: string;
  showAll: string;
}

interface FilterSidebarProps {
  facets: BrowseFacets;
  labels: FilterSidebarLabels;
  selected: BrowseSearchParams;
}

export function FilterSidebar({
  facets,
  labels,
  selected,
}: FilterSidebarProps) {
  const { setSearchParams } = useSearch();

  const handleSelect = (
    key: keyof BrowseSearchParams,
    value: string | undefined
  ) => {
    setSearchParams({ [key]: value }, true);
  };

  const clearFilters = () => {
    setSearchParams(
      {
        organization: undefined,
        topic: undefined,
        format: undefined,
        frequency: undefined,
      },
      true
    );
  };

  return (
    <aside className='rounded-3xl border border-gray-200 bg-white p-5 shadow-sm'>
      <div className='mb-4 flex items-center justify-between gap-3'>
        <h2 className='text-sm font-semibold uppercase tracking-[0.14em] text-gray-500'>
          {labels.title}
        </h2>
        <button
          className='text-sm font-medium text-gov-primary transition hover:text-gov-accent'
          onClick={clearFilters}
          type='button'
        >
          {labels.clear}
        </button>
      </div>

      <div className='space-y-1'>
        <FilterSection
          title={labels.topic}
          options={facets.topics}
          selectedValue={selected.topic}
          onSelect={(value) => handleSelect('topic', value)}
          labels={{ showAll: labels.showAll }}
          defaultExpanded={true}
        />

        <FilterSection
          title={labels.organization}
          options={facets.organizations}
          selectedValue={selected.organization}
          onSelect={(value) => handleSelect('organization', value)}
          labels={{ showAll: labels.showAll }}
          defaultExpanded={true}
        />

        <FilterSection
          title={labels.format}
          options={facets.formats}
          selectedValue={selected.format}
          onSelect={(value) => handleSelect('format', value)}
          labels={{ showAll: labels.showAll }}
          defaultExpanded={false}
        />

        <FilterSection
          title={labels.frequency}
          options={facets.frequencies}
          selectedValue={selected.frequency}
          onSelect={(value) => handleSelect('frequency', value)}
          labels={{ showAll: labels.showAll }}
          defaultExpanded={false}
        />
      </div>
    </aside>
  );
}
