/**
 * @vitest-environment jsdom
 * Tests for Playground components and state hook
 * Tests state management, URL encoding/decoding, and UI interactions
 */

import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
  beforeAll,
} from "vitest";

// Import the hook and components to test
import { usePlaygroundState } from "@/hooks/use-playground-state";

import { ChartTypeSelector } from "../chart-type-selector";
import { ColorPicker } from "../color-picker";
import { DataInput } from "../data-input";
import { SharePanel } from "../share-panel";

// Mock next/router
const mockPush = vi.fn();
const mockReplace = vi.fn();
vi.mock("next/router", () => ({
  useRouter: () => ({
    route: "/playground",
    pathname: "/playground",
    query: {},
    asPath: "/playground",
    push: mockPush,
    replace: mockReplace,
    prefetch: vi.fn(),
    isReady: true,
    events: {
      on: vi.fn(),
      off: vi.fn(),
      emit: vi.fn(),
    },
  }),
}));

// Mock lz-string
vi.mock("lz-string", () => ({
  compressToEncodedURIComponent: (str: string) => `compressed_${str}`,
  decompressFromEncodedURIComponent: (str: string) => {
    if (str.startsWith("compressed_")) {
      return str.replace("compressed_", "");
    }
    return null;
  },
}));

// Mock window.history
const originalLocation = window.location;
const originalHistory = window.history;

beforeAll(() => {
  // Mock window.location
  Object.defineProperty(window, "location", {
    value: {
      ...originalLocation,
      origin: "http://localhost:3000",
      pathname: "/playground",
      href: "http://localhost:3000/playground",
    },
    writable: true,
  });

  // Mock window.history
  Object.defineProperty(window, "history", {
    value: {
      ...originalHistory,
      replaceState: vi.fn(),
      pushState: vi.fn(),
    },
    writable: true,
  });
});

describe("usePlaygroundState", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("default state initialization", () => {
    it("should initialize with default state", () => {
      const { result } = renderHook(() => usePlaygroundState());

      expect(result.current.state).toEqual({
        chartType: "bar",
        title: "My Chart",
        subtitle: "",
        xAxisLabel: "Category",
        yAxisLabel: "Value",
        data: [
          { label: "A", value: 30 },
          { label: "B", value: 50 },
          { label: "C", value: 40 },
          { label: "D", value: 70 },
        ],
        colors: ["#0ea5e9", "#2563eb", "#7c3aed", "#db2777"],
        showLegend: true,
        showGrid: true,
      });
    });

    it("should set isLoaded to true after initialization", async () => {
      const { result } = renderHook(() => usePlaygroundState());

      await waitFor(() => {
        expect(result.current.isLoaded).toBe(true);
      });
    });
  });

  describe("state updates", () => {
    it("should update state with updateState function", () => {
      const { result } = renderHook(() => usePlaygroundState());

      act(() => {
        result.current.updateState({ title: "New Title" });
      });

      expect(result.current.state.title).toBe("New Title");
    });

    it("should update chartType", () => {
      const { result } = renderHook(() => usePlaygroundState());

      act(() => {
        result.current.updateState({ chartType: "line" });
      });

      expect(result.current.state.chartType).toBe("line");
    });

    it("should update data", () => {
      const { result } = renderHook(() => usePlaygroundState());
      const newData = [
        { label: "X", value: 100 },
        { label: "Y", value: 200 },
      ];

      act(() => {
        result.current.updateState({ data: newData });
      });

      expect(result.current.state.data).toEqual(newData);
    });

    it("should update colors", () => {
      const { result } = renderHook(() => usePlaygroundState());
      const newColors = ["#ff0000", "#00ff00", "#0000ff"];

      act(() => {
        result.current.updateState({ colors: newColors });
      });

      expect(result.current.state.colors).toEqual(newColors);
    });

    it("should preserve other state when updating partial state", () => {
      const { result } = renderHook(() => usePlaygroundState());
      const originalData = result.current.state.data;

      act(() => {
        result.current.updateState({ title: "Updated" });
      });

      expect(result.current.state.title).toBe("Updated");
      expect(result.current.state.data).toEqual(originalData);
    });
  });

  describe("URL encoding/decoding", () => {
    it("should update URL when state changes", () => {
      const { result } = renderHook(() => usePlaygroundState());

      act(() => {
        result.current.updateState({ title: "Test Chart" });
      });

      expect(window.history.replaceState).toHaveBeenCalled();
    });

    it("should generate share URL with compressed state", () => {
      const { result } = renderHook(() => usePlaygroundState());

      const shareUrl = result.current.getShareUrl();

      expect(shareUrl).toContain("http://localhost:3000/playground?state=");
    });

    it("should generate embed code with iframe", () => {
      const { result } = renderHook(() => usePlaygroundState());

      const embedCode = result.current.getEmbedCode();

      expect(embedCode).toContain("<iframe");
      expect(embedCode).toContain('width="100%"');
      expect(embedCode).toContain('height="500"');
    });
  });

  describe("reset functionality", () => {
    it("should reset state to default with resetState", () => {
      const { result } = renderHook(() => usePlaygroundState());

      // First modify state
      act(() => {
        result.current.updateState({ title: "Modified", chartType: "pie" });
      });

      expect(result.current.state.title).toBe("Modified");
      expect(result.current.state.chartType).toBe("pie");

      // Then reset
      act(() => {
        result.current.resetState();
      });

      expect(result.current.state.title).toBe("My Chart");
      expect(result.current.state.chartType).toBe("bar");
      expect(mockPush).toHaveBeenCalled();
    });
  });
});

// Helper to render hooks
function renderHook<T>(hook: () => T) {
  let result: { current: T } = { current: null as unknown as T };

  function TestComponent() {
    result.current = hook();
    return null;
  }

  render(<TestComponent />);

  return {
    result,
    rerender: () => render(<TestComponent />),
  };
}

describe("ColorPicker", () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
  });

  it("should render with initial colors", () => {
    const colors = ["#ff0000", "#00ff00", "#0000ff"];
    const onChange = vi.fn();

    render(<ColorPicker value={colors} onChange={onChange} />);

    expect(screen.getByText(/current colors/i)).toBeInTheDocument();
    // Check that the color count is displayed (3 colors)
    expect(screen.getByText(/Current Colors \(3\)/)).toBeInTheDocument();
  });

  it("should display preset palettes", () => {
    const onChange = vi.fn();

    render(<ColorPicker value={["#000"]} onChange={onChange} />);

    expect(screen.getByText("Preset Palettes")).toBeInTheDocument();
    // Palette buttons have aria-label instead of visible text
    expect(
      screen.getByRole("button", { name: /blue\/purple/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /warm/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /green\/teal/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /monochrome/i })
    ).toBeInTheDocument();
  });

  it("should call onChange when preset palette is selected", async () => {
    const onChange = vi.fn();

    render(<ColorPicker value={["#000"]} onChange={onChange} />);

    // Find and click a preset palette button
    const warmPalette = screen.getByRole("button", { name: /warm/i });
    await user.click(warmPalette);

    expect(onChange).toHaveBeenCalledWith([
      "#f97316",
      "#ef4444",
      "#ec4899",
      "#f59e0b",
    ]);
  });

  it("should display current colors with hex values", () => {
    const colors = ["#ff0000", "#00ff00"];
    const onChange = vi.fn();

    render(<ColorPicker value={colors} onChange={onChange} />);

    // Colors are displayed in uppercase
    expect(screen.getByText("#FF0000")).toBeInTheDocument();
    expect(screen.getByText("#00FF00")).toBeInTheDocument();
  });

  it("should remove color when remove button is clicked", async () => {
    const colors = ["#ff0000", "#00ff00", "#0000ff"];
    const onChange = vi.fn();

    render(<ColorPicker value={colors} onChange={onChange} />);

    // Find and click remove button for first color
    const removeButtons = screen.getAllByRole("button", { name: /remove/i });
    await user.click(removeButtons[0]);

    expect(onChange).toHaveBeenCalledWith(["#00ff00", "#0000ff"]);
  });

  it("should not remove the last color", async () => {
    const colors = ["#ff0000"];
    const onChange = vi.fn();

    render(<ColorPicker value={colors} onChange={onChange} />);

    // The remove button should not be present for single color
    expect(
      screen.queryByRole("button", { name: /remove/i })
    ).not.toBeInTheDocument();
  });

  it("should have color input for custom colors", () => {
    const onChange = vi.fn();

    render(<ColorPicker value={["#000"]} onChange={onChange} />);

    expect(screen.getByLabelText(/select custom color/i)).toBeInTheDocument();
  });

  it("should add custom color when Add button is clicked", async () => {
    const colors = ["#ff0000"];
    const onChange = vi.fn();

    render(<ColorPicker value={colors} onChange={onChange} />);

    // Change the color input value
    const colorInput = screen.getByLabelText(
      /select custom color/i
    ) as HTMLInputElement;
    fireEvent.change(colorInput, { target: { value: "#00ff00" } });

    // Click add button
    const addButton = screen.getByRole("button", { name: /add/i });
    await user.click(addButton);

    expect(onChange).toHaveBeenCalledWith(["#ff0000", "#00ff00"]);
  });

  it("should disable Add button for duplicate colors", () => {
    const colors = ["#0ea5e9"];
    const onChange = vi.fn();

    render(<ColorPicker value={colors} onChange={onChange} />);

    // The color input starts with #0ea5e9 by default
    const addButton = screen.getByRole("button", { name: /add/i });
    expect(addButton).toBeDisabled();
  });
});

describe("ChartTypeSelector", () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
  });

  it("should render all chart type options", () => {
    const onChange = vi.fn();

    render(<ChartTypeSelector value="bar" onChange={onChange} />);

    expect(screen.getByLabelText(/select line chart/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/select bar chart/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/select column chart/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/select pie chart/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/select area chart/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/select scatter chart/i)).toBeInTheDocument();
  });

  it("should highlight selected chart type", () => {
    const onChange = vi.fn();

    render(<ChartTypeSelector value="pie" onChange={onChange} />);

    const pieButton = screen.getByLabelText(/select pie chart/i);
    expect(pieButton).toHaveAttribute("aria-pressed", "true");
  });

  it("should call onChange when chart type is selected", async () => {
    const onChange = vi.fn();

    render(<ChartTypeSelector value="bar" onChange={onChange} />);

    const lineButton = screen.getByLabelText(/select line chart/i);
    await user.click(lineButton);

    expect(onChange).toHaveBeenCalledWith("line");
  });

  it("should not call onChange when same type is clicked", async () => {
    const onChange = vi.fn();

    render(<ChartTypeSelector value="bar" onChange={onChange} />);

    const barButton = screen.getByLabelText(/select bar chart/i);
    await user.click(barButton);

    // onChange is called with null when same button is clicked (exclusive selection)
    // but our handler should not call onChange with null
    expect(onChange).not.toHaveBeenCalled();
  });

  it("should have accessible label", () => {
    const onChange = vi.fn();

    render(<ChartTypeSelector value="bar" onChange={onChange} />);

    expect(screen.getByLabelText(/chart type selection/i)).toBeInTheDocument();
  });
});

describe("SharePanel", () => {
  let user: ReturnType<typeof userEvent.setup>;
  let writeTextMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    user = userEvent.setup();

    // Mock clipboard API using Object.defineProperty
    writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      value: {
        writeText: writeTextMock,
        readText: vi.fn().mockResolvedValue(""),
      },
      writable: true,
      configurable: true,
    });
  });

  it("should render share URL section", () => {
    const getShareUrl = () => "http://localhost:3000/playground?state=abc";
    const getEmbedCode = () => '<iframe src="..."></iframe>';

    render(
      <SharePanel getShareUrl={getShareUrl} getEmbedCode={getEmbedCode} />
    );

    expect(screen.getByText("Share URL")).toBeInTheDocument();
    expect(screen.getByLabelText(/shareable url/i)).toBeInTheDocument();
  });

  it("should render embed code section", () => {
    const getShareUrl = () => "http://localhost:3000/playground?state=abc";
    const getEmbedCode = () => '<iframe src="..."></iframe>';

    render(
      <SharePanel getShareUrl={getShareUrl} getEmbedCode={getEmbedCode} />
    );

    expect(screen.getByText("Embed Code")).toBeInTheDocument();
    expect(screen.getByLabelText(/iframe embed code/i)).toBeInTheDocument();
  });

  it("should render download section with disabled buttons", () => {
    const getShareUrl = () => "http://localhost:3000/playground?state=abc";
    const getEmbedCode = () => '<iframe src="..."></iframe>';

    render(
      <SharePanel getShareUrl={getShareUrl} getEmbedCode={getEmbedCode} />
    );

    expect(screen.getByText("Download")).toBeInTheDocument();
    expect(screen.getByText("Download as PNG")).toBeDisabled();
    expect(screen.getByText("Download as SVG")).toBeDisabled();
    expect(screen.getByText("Coming soon")).toBeInTheDocument();
  });

  it("should copy share URL to clipboard", async () => {
    const getShareUrl = () => "http://localhost:3000/playground?state=abc";
    const getEmbedCode = () => '<iframe src="..."></iframe>';

    render(
      <SharePanel getShareUrl={getShareUrl} getEmbedCode={getEmbedCode} />
    );

    const copyLinkButton = screen.getByRole("button", { name: /copy link/i });
    await user.click(copyLinkButton);

    expect(writeTextMock).toHaveBeenCalledWith(
      "http://localhost:3000/playground?state=abc"
    );
  });

  it("should copy embed code to clipboard", async () => {
    const getShareUrl = () => "http://localhost:3000/playground?state=abc";
    const getEmbedCode = () =>
      '<iframe src="http://localhost:3000/playground?state=abc" width="100%" height="500" style="border:0;"></iframe>';

    render(
      <SharePanel getShareUrl={getShareUrl} getEmbedCode={getEmbedCode} />
    );

    const copyEmbedButton = screen.getByRole("button", {
      name: /copy embed code/i,
    });
    await user.click(copyEmbedButton);

    expect(writeTextMock).toHaveBeenCalledWith(
      '<iframe src="http://localhost:3000/playground?state=abc" width="100%" height="500" style="border:0;"></iframe>'
    );
  });

  it("should show success snackbar after copying link", async () => {
    const getShareUrl = () => "http://localhost:3000/playground?state=abc";
    const getEmbedCode = () => '<iframe src="..."></iframe>';

    render(
      <SharePanel getShareUrl={getShareUrl} getEmbedCode={getEmbedCode} />
    );

    const copyLinkButton = screen.getByRole("button", { name: /copy link/i });
    await user.click(copyLinkButton);

    await waitFor(() => {
      expect(screen.getByText("Link copied to clipboard!")).toBeInTheDocument();
    });
  });

  it("should show success snackbar after copying embed code", async () => {
    const getShareUrl = () => "http://localhost:3000/playground?state=abc";
    const getEmbedCode = () => '<iframe src="..."></iframe>';

    render(
      <SharePanel getShareUrl={getShareUrl} getEmbedCode={getEmbedCode} />
    );

    const copyEmbedButton = screen.getByRole("button", {
      name: /copy embed code/i,
    });
    await user.click(copyEmbedButton);

    await waitFor(() => {
      expect(
        screen.getByText("Embed code copied to clipboard!")
      ).toBeInTheDocument();
    });
  });

  it("should handle clipboard error gracefully", async () => {
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    writeTextMock.mockRejectedValueOnce(new Error("Clipboard error"));

    const getShareUrl = () => "http://localhost:3000/playground?state=abc";
    const getEmbedCode = () => '<iframe src="..."></iframe>';

    render(
      <SharePanel getShareUrl={getShareUrl} getEmbedCode={getEmbedCode} />
    );

    const copyLinkButton = screen.getByRole("button", { name: /copy link/i });
    await user.click(copyLinkButton);

    await waitFor(() => {
      expect(consoleError).toHaveBeenCalledWith(
        "Failed to copy link:",
        expect.any(Error)
      );
    });

    consoleError.mockRestore();
  });

  it("should display share URL in text field", () => {
    const shareUrl = "http://localhost:3000/playground?state=test123";
    const getShareUrl = () => shareUrl;
    const getEmbedCode = () => '<iframe src="..."></iframe>';

    render(
      <SharePanel getShareUrl={getShareUrl} getEmbedCode={getEmbedCode} />
    );

    const urlInput = screen.getByLabelText(/shareable url/i);
    expect(urlInput).toHaveValue(shareUrl);
  });

  it("should display embed code in text field", () => {
    const embedCode =
      '<iframe src="http://localhost:3000/playground?state=test" width="100%" height="500"></iframe>';
    const getShareUrl = () => "http://localhost:3000/playground?state=test";
    const getEmbedCode = () => embedCode;

    render(
      <SharePanel getShareUrl={getShareUrl} getEmbedCode={getEmbedCode} />
    );

    const embedInput = screen.getByLabelText(/iframe embed code/i);
    expect(embedInput).toHaveValue(embedCode);
  });
});

describe("DataInput", () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
  });

  it("should render with default CSV format", () => {
    const data = [{ label: "A", value: 30 }];
    const onChange = vi.fn();

    render(<DataInput value={data} onChange={onChange} />);

    expect(screen.getByText("Input Format")).toBeInTheDocument();
    expect(screen.getByText("CSV Data")).toBeInTheDocument();
  });

  it("should display data in CSV format by default", () => {
    const data = [
      { label: "A", value: 30 },
      { label: "B", value: 50 },
    ];
    const onChange = vi.fn();

    render(<DataInput value={data} onChange={onChange} />);

    const textarea = screen.getByLabelText(/data input in csv format/i);
    expect(textarea).toHaveValue("label,value\nA,30\nB,50");
  });

  it("should switch to JSON format", async () => {
    const data = [{ label: "A", value: 30 }];
    const onChange = vi.fn();

    render(<DataInput value={data} onChange={onChange} />);

    const jsonButton = screen.getByRole("button", { name: /json/i });
    await user.click(jsonButton);

    expect(screen.getByText("JSON Data")).toBeInTheDocument();
  });

  it("should display data in JSON format when switched", async () => {
    const data = [{ label: "A", value: 30 }];
    const onChange = vi.fn();

    render(<DataInput value={data} onChange={onChange} />);

    const jsonButton = screen.getByRole("button", { name: /json/i });
    await user.click(jsonButton);

    const textarea = screen.getByLabelText(
      /data input in json format/i
    ) as HTMLTextAreaElement;
    expect(textarea.value).toContain('"label": "A"');
    expect(textarea.value).toContain('"value": 30');
  });

  it("should call onChange when valid CSV is entered", async () => {
    const onChange = vi.fn();

    render(<DataInput value={[]} onChange={onChange} />);

    const textarea = screen.getByLabelText(/data input in csv format/i);
    await user.clear(textarea);
    await user.type(textarea, "label,value\nX,100\nY,200");

    expect(onChange).toHaveBeenCalledWith([
      { label: "X", value: 100 },
      { label: "Y", value: 200 },
    ]);
  });

  it("should call onChange when valid JSON is entered", async () => {
    const onChange = vi.fn();

    render(<DataInput value={[]} onChange={onChange} />);

    // First switch to JSON format
    const jsonButton = screen.getByRole("button", { name: /json/i });
    await user.click(jsonButton);

    const textarea = screen.getByLabelText(/data input in json format/i);
    await user.clear(textarea);
    // Use fireEvent for JSON with special characters
    fireEvent.change(textarea, {
      target: { value: '[{"name":"Test","count":5}]' },
    });

    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith([{ name: "Test", count: 5 }]);
    });
  });

  it("should show error for invalid CSV", async () => {
    const onChange = vi.fn();

    render(<DataInput value={[]} onChange={onChange} />);

    const textarea = screen.getByLabelText(/data input in csv format/i);
    await user.clear(textarea);
    await user.type(textarea, "invalid csv without proper structure");

    // Should show error helper text
    await waitFor(() => {
      expect(
        screen.getByText(/csv must have a header row/i)
      ).toBeInTheDocument();
    });
  });

  it("should show error for invalid JSON", async () => {
    const onChange = vi.fn();

    render(<DataInput value={[]} onChange={onChange} />);

    // Switch to JSON format
    const jsonButton = screen.getByRole("button", { name: /json/i });
    await user.click(jsonButton);

    const textarea = screen.getByLabelText(/data input in json format/i);
    await user.clear(textarea);
    await user.type(textarea, "not valid json");

    await waitFor(() => {
      expect(screen.getByText(/invalid json format/i)).toBeInTheDocument();
    });
  });

  it("should show error when JSON is not an array", async () => {
    const onChange = vi.fn();

    render(<DataInput value={[]} onChange={onChange} />);

    // Switch to JSON format
    const jsonButton = screen.getByRole("button", { name: /json/i });
    await user.click(jsonButton);

    const textarea = screen.getByLabelText(/data input in json format/i);
    await user.clear(textarea);
    // Use fireEvent for JSON with special characters
    fireEvent.change(textarea, {
      target: { value: '{"not": "array"}' },
    });

    await waitFor(() => {
      expect(screen.getByText(/json must be an array/i)).toBeInTheDocument();
    });
  });

  it("should preserve format toggle selection", async () => {
    const data = [{ label: "A", value: 30 }];
    const onChange = vi.fn();

    render(<DataInput value={data} onChange={onChange} />);

    // Click JSON
    const jsonButton = screen.getByRole("button", { name: /json/i });
    await user.click(jsonButton);

    // Verify JSON is selected
    expect(jsonButton).toHaveAttribute("aria-pressed", "true");

    // Click CSV
    const csvButton = screen.getByRole("button", { name: /csv/i });
    await user.click(csvButton);

    // Verify CSV is selected
    expect(csvButton).toHaveAttribute("aria-pressed", "true");
  });

  it("should have accessible labels", () => {
    const data = [{ label: "A", value: 30 }];
    const onChange = vi.fn();

    render(<DataInput value={data} onChange={onChange} />);

    expect(
      screen.getByLabelText(/data input format selection/i)
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(/data input in csv format/i)
    ).toBeInTheDocument();
  });
});
