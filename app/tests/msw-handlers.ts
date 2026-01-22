/**
 * Default MSW handlers for testing
 *
 * Provides common handlers that are used across multiple test files.
 */

import { http, HttpResponse } from "msw";

// Mock data
const mockOrganization = {
  id: "RepublikaSrbija",
  name: "Republika Srbija",
  title: "Republika Srbija",
  description: "Vlada Republike Srbije",
  image_url: "https://data.gov.rs/static/organization/republika-srbija.png",
  created_at: "2021-01-01T00:00:00.000000",
};

const mockResource = {
  id: "resource-1",
  title: "CSV Resource",
  description: "Dataset in CSV format",
  format: "CSV",
  url: "https://data.gov.rs/datasets/test-dataset/resource-1.csv",
  created_at: "2023-01-01T00:00:00.000000",
  updated_at: "2023-01-01T00:00:00.000000",
  filesize: 1024,
  mimetype: "text/csv",
};

const mockDataset = {
  id: "test-dataset-1",
  title: "Test Dataset 1",
  description: "Test dataset for unit testing",
  organization: mockOrganization,
  resources: [mockResource],
  tags: ["test", "sample", "data"],
  created_at: "2023-01-01T00:00:00.000000",
  updated_at: "2023-01-01T00:00:00.000000",
  slug: "test-dataset-1",
  page: "https://data.gov.rs/datasets/test-dataset-1",
  frequency: "monthly",
  spatial: "Srbija",
  temporal_start: "2020-01-01",
  temporal_end: "2023-12-31",
  license: "CC-BY-4.0",
  license_url: "https://creativecommons.org/licenses/by/4.0/",
};

const mockDatasets = [
  mockDataset,
  {
    ...mockDataset,
    id: "test-dataset-2",
    title: "Test Dataset 2",
    description: "Another test dataset",
  },
  {
    ...mockDataset,
    id: "test-dataset-3",
    title: "Test Dataset 3",
    description: "Yet another test dataset",
  },
];

const mockOrganizations = [
  mockOrganization,
  {
    ...mockOrganization,
    id: "ministarstvo-zdravlja",
    name: "Ministarstvo zdravlja",
    title: "Ministarstvo zdravlja",
  },
  {
    ...mockOrganization,
    id: "ministarstvo-prosvete",
    name: "Ministarstvo prosvete",
    title: "Ministarstvo prosvete",
  },
];

const API_BASE_URL = "https://data.gov.rs/api/1";

// Default handlers for common endpoints
export const defaultHandlers = [
  // Dataset search endpoints
  http.get(`${API_BASE_URL}/datasets/`, ({ request }) => {
    const url = new URL(request.url);
    const q = url.searchParams.get("q");
    const organization = url.searchParams.get("organization");
    const tag = url.searchParams.get("tag");
    const page = parseInt(url.searchParams.get("page") || "1");
    const pageSize = parseInt(url.searchParams.get("page_size") || "20");

    // Filter datasets based on query params
    let filteredDatasets = mockDatasets;

    if (q) {
      const query = q.toLowerCase();
      filteredDatasets = filteredDatasets.filter(
        (d) =>
          d.title.toLowerCase().includes(query) ||
          d.description.toLowerCase().includes(query)
      );
    }

    if (organization) {
      filteredDatasets = filteredDatasets.filter(
        (d) => d.organization.id === organization
      );
    }

    if (tag) {
      filteredDatasets = filteredDatasets.filter((d) => d.tags.includes(tag));
    }

    // Pagination
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedData = filteredDatasets.slice(start, end);

    return HttpResponse.json({
      data: paginatedData,
      page,
      page_size: pageSize,
      total: filteredDatasets.length,
      next_page: end < filteredDatasets.length ? page + 1 : undefined,
      previous_page: page > 1 ? page - 1 : undefined,
    });
  }),

  // Get dataset by ID
  http.get(`${API_BASE_URL}/datasets/:id/`, ({ params }) => {
    const dataset = mockDatasets.find((d) => d.id === params.id);
    if (dataset) {
      return HttpResponse.json(dataset);
    }
    return HttpResponse.json({ message: "Dataset not found" }, { status: 404 });
  }),

  // Organizations endpoints
  http.get(`${API_BASE_URL}/organizations/`, ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const pageSize = parseInt(url.searchParams.get("page_size") || "20");

    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedData = mockOrganizations.slice(start, end);

    return HttpResponse.json({
      data: paginatedData,
      page,
      page_size: pageSize,
      total: mockOrganizations.length,
      next_page: end < mockOrganizations.length ? page + 1 : undefined,
      previous_page: page > 1 ? page - 1 : undefined,
    });
  }),

  // Get organization by ID
  http.get(`${API_BASE_URL}/organizations/:id/`, ({ params }) => {
    const organization = mockOrganizations.find((o) => o.id === params.id);
    if (organization) {
      return HttpResponse.json(organization);
    }
    return HttpResponse.json(
      { message: "Organization not found" },
      { status: 404 }
    );
  }),

  // Get datasets for an organization
  http.get(`${API_BASE_URL}/organizations/:id/datasets/`, ({ params }) => {
    const organizationDatasets = mockDatasets.filter(
      (d) => d.organization.id === params.id
    );
    return HttpResponse.json({
      data: organizationDatasets,
      total: organizationDatasets.length,
    });
  }),

  // Get resource by ID
  http.get(`${API_BASE_URL}/resources/:id/`, ({ params }) => {
    if (params.id === "nonexistent") {
      return HttpResponse.json(
        { message: "Resource not found" },
        { status: 404 }
      );
    }

    if (params.id === mockResource.id) {
      return HttpResponse.json(mockResource);
    }

    return HttpResponse.json(
      { message: "Resource not found" },
      { status: 404 }
    );
  }),

  // Download resource (actual CSV data)
  http.get("https://data.gov.rs/datasets/test-dataset/resource-1.csv", () => {
    return HttpResponse.text("id,name,value\n1,Test,100\n2,Sample,200");
  }),
];
