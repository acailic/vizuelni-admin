import "@testing-library/jest-dom/vitest";
import { describe, expect, it } from "vitest";

import { DemoGallery } from "@/_components/DemoGallery";
import { staticGalleryDatasets } from "@/data/static-gallery-data";
import GalleryPage from "@/pages/gallery";
import { render, screen } from "@/test-utils";

describe("GalleryPage", () => {
  it("renders page title and description", () => {
    render(<GalleryPage />);

    expect(screen.getByText("Serbia Open Data Gallery")).toBeTruthy();
    expect(
      screen.getByText(/Exploring datasets from data.gov.rs/i)
    ).toBeTruthy();
  });

  it("renders static gallery datasets", () => {
    render(<GalleryPage />);

    const sampleDataset = staticGalleryDatasets[0];
    expect(screen.getAllByText(sampleDataset.title).length).toBeGreaterThan(0);
    if (sampleDataset.organization?.title) {
      expect(
        screen.getAllByText(sampleDataset.organization.title).length
      ).toBeGreaterThan(0);
    }
  });

  it("renders external links with proper security attributes", () => {
    const { container } = render(<GalleryPage />);

    const externalLinks = container.querySelectorAll('a[target="_blank"]');
    expect(externalLinks.length).toBeGreaterThan(0);
    externalLinks.forEach((link) => {
      expect(link.getAttribute("rel")).toContain("noopener");
      expect(link.getAttribute("rel")).toContain("noreferrer");
    });
  });

  it("omits download button when dataset has no resources", () => {
    render(
      <DemoGallery
        datasets={[
          {
            id: "no-resources",
            title: "Dataset Without Resources",
            notes: "No downloadable resources",
            resources: [],
            tags: [{ name: "test" }],
          },
        ]}
      />
    );

    expect(screen.queryByRole("link", { name: /Download/i })).toBeNull();
  });
});
