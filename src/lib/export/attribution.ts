export async function withSourceAttribution<T>(
  element: HTMLElement,
  source: string | undefined,
  callback: () => Promise<T>
): Promise<T> {
  let attributionElement: HTMLElement | null = null;

  if (source) {
    attributionElement = document.createElement('div');
    attributionElement.style.cssText = `
      padding: 8px 12px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 11px;
      color: #666;
      text-align: center;
      background: #f9fafb;
      border-top: 1px solid #e5e7eb;
    `;
    attributionElement.textContent = source;
    element.appendChild(attributionElement);
  }

  try {
    return await callback();
  } finally {
    if (attributionElement && element.contains(attributionElement)) {
      element.removeChild(attributionElement);
    }
  }
}
