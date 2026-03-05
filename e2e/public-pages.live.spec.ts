import { expect, Page, test } from "@playwright/test";

const DATA_SOURCE = "Prod";
const PATH_PREFIX = (process.env.E2E_PATH_PREFIX ?? "").replace(/\/$/, "");

const withPrefix = (path: string) => {
  if (/^https?:\/\//.test(path)) {
    return path;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${PATH_PREFIX}${normalizedPath}`;
};

const withDataSource = (
  pathname: string,
  params: Record<string, string> = {}
) => {
  const search = new URLSearchParams({ dataSource: DATA_SOURCE, ...params });
  return withPrefix(`${pathname}?${search.toString()}`);
};

const expectInternalHomeTarget = async (page: Page) => {
  const homeLink = page.getByTestId("nav-home").first();
  await expect(homeLink).toBeVisible();

  const href = (await homeLink.getAttribute("href")) ?? "";
  expect(href).not.toContain("acailic.github.io");
  expect(href).not.toContain("data.gov.rs");
};

const expectNoEmptyRoleButtons = async (page: Page) => {
  const emptyButtons = await page
    .locator('[role="button"]')
    .evaluateAll((nodes) => {
      return nodes
        .filter((node) => {
          const el = node as HTMLElement;
          const style = window.getComputedStyle(el);
          const visible =
            style.display !== "none" &&
            style.visibility !== "hidden" &&
            el.getClientRects().length > 0;

          if (!visible) {
            return false;
          }

          const text = (el.textContent ?? "").replace(/\s+/g, " ").trim();
          const ariaLabel = el.getAttribute("aria-label")?.trim() ?? "";
          const labelledBy = el.getAttribute("aria-labelledby")?.trim() ?? "";
          const title = el.getAttribute("title")?.trim() ?? "";

          return !text && !ariaLabel && !labelledBy && !title;
        })
        .map((node) => (node as HTMLElement).outerHTML.slice(0, 180));
    });

  expect(
    emptyButtons,
    `Found visible role=button controls without accessible text/label: ${emptyButtons.join("\n")}`
  ).toEqual([]);
};

test.describe("Public pages E2E", () => {
  test("home page has fixed CTAs/links and no docs dead links", async ({
    page,
  }) => {
    await page.goto(withDataSource("/"));

    await expect(page.locator("h1").first()).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Analiza cena" })
    ).toBeVisible();

    const galleryCta = page
      .getByRole("link", { name: /Otvori galeriju|Open gallery/i })
      .first();
    await expect(galleryCta).toHaveAttribute("href", /\/demos/);
    await expect(page.locator('a[href*="/docs"]')).toHaveCount(0);
  });

  test("browse page keeps single search control and no empty filter buttons", async ({
    page,
  }) => {
    await page.goto(withDataSource("/browse"));

    await expect(page.getByText("Runtime Error")).toHaveCount(0);
    await expect(page.locator('[data-testid="datasetSearch"]')).toHaveCount(1, {
      timeout: 20_000,
    });
    await expectNoEmptyRoleButtons(page);
  });

  test("demos index has valid interactive markup and no placeholder section", async ({
    page,
  }) => {
    await page.goto(withDataSource("/demos"));

    await expect(page.locator("h1").first()).toBeVisible();
    await expect(page.locator("a button, button a")).toHaveCount(0);
    await expect(page.getByText(/coming soon/i)).toHaveCount(0);
  });

  test("showcase has clean back navigation and actionable featured cards", async ({
    page,
  }) => {
    await page.goto(withDataSource("/demos/showcase"));

    const backLink = page
      .getByRole("link", { name: /Back to demo gallery|Nazad|Povratak/i })
      .first();
    await expect(backLink).toBeVisible();

    const backLinkText = await backLink.innerText();
    expect(backLinkText).not.toMatch(/←\s*←/);

    const actionControls = page.locator(
      'a:has-text("Otvori stranicu"), a:has-text("Open page"), button:has-text("Otvori stranicu"), button:has-text("Open page")'
    );
    await expect(actionControls.first()).toBeVisible({ timeout: 20_000 });
  });

  test("demo detail page is implemented and renders chart content", async ({
    page,
  }) => {
    await page.goto(withDataSource("/demos/demographics"));

    await expect(page.locator("h1").first()).toBeVisible();
    await expect(page.getByText("Runtime Error")).toHaveCount(0);
    await expect(
      page.getByText(
        /nije implementiran|sledećoj fazi|not implemented|coming soon/i
      )
    ).toHaveCount(0);

    await expect(page.locator("svg, canvas").first()).toBeVisible({
      timeout: 20_000,
    });
  });

  test("topics pages render list and detail routes correctly", async ({
    page,
  }) => {
    await page.goto(withDataSource("/topics"));

    await expect(
      page.getByRole("heading", { name: /Istražite|Explore/i })
    ).toBeVisible();
    await expectInternalHomeTarget(page);

    const firstTopicCard = page.locator('a[href*="/topics/"]').first();
    await firstTopicCard.click();

    await expect(page).toHaveURL(/\/topics\/[a-z-]+/);
    await expect(page.locator("h1").first()).toBeVisible();
  });

  test("embed generator propagates selected chart params into preview/snippet", async ({
    page,
  }) => {
    await page.goto(
      withPrefix("/embed?type=bar&dataset=budget&dataSource=Prod")
    );

    await expect(page.getByText("Chart params from URL:")).toBeVisible();
    await expect(page.getByText("type: bar")).toBeVisible();
    await expect(page.getByText("dataset: budget")).toBeVisible();

    const previewLink = page.getByRole("link", { name: "Preview embed" });
    const previewHref = (await previewLink.getAttribute("href")) ?? "";

    expect(previewHref).toContain("type=bar");
    expect(previewHref).toContain("dataset=budget");
    expect(previewHref).toContain("dataSource=Prod");
    expect(previewHref).toContain("lang=");

    const inlinePreview = page.locator('iframe[title="Embed preview"]');
    await expect(inlinePreview).toBeVisible();
    const inlineSrc = (await inlinePreview.getAttribute("src")) ?? "";

    expect(inlineSrc).toContain("type=bar");
    expect(inlineSrc).toContain("dataset=budget");
    expect(inlineSrc).toContain("dataSource=Prod");
  });

  test("embed preview reflects requested chart and dataset", async ({
    page,
  }) => {
    await page.goto(
      withPrefix(
        "/embed/demo?type=bar&dataset=budget&dataSource=Prod&theme=light&lang=en"
      )
    );

    await expect(page.getByText(/Dataset: budget/)).toBeVisible();
    await expect(page.getByText(/Prod/)).toBeVisible();
    await expect(page.locator("svg, canvas").first()).toBeVisible();
  });

  test("price analysis page has global header and locale-consistent currency format", async ({
    page,
  }) => {
    await page.goto(withPrefix("/cene"));

    await expect(page.getByTestId("header")).toBeVisible();
    await expectInternalHomeTarget(page);

    const bodyText = await page.locator("body").innerText();
    expect(bodyText).toMatch(/\d{1,3}(?:\.\d{3})*,\d{2}\s?RSD/);
  });
});
