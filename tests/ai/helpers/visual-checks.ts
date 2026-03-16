/**
 * Visual Check Helper Utilities for DOM Inspection
 * Used for visual regression testing to detect visibility and layout issues
 */

import type { Stagehand } from '@browserbasehq/stagehand';
import { getContrastRatio, meetsWCAGAA } from './contrast-utils';
import { getActivePage } from '../fixtures/test-helpers';

// Result type interfaces
export interface TextVisibilityResult {
  visibleTextElements: number;
  lowContrastElements: Array<{
    selector: string;
    text: string;
    textColor: string;
    bgColor: string;
    contrastRatio: number;
  }>;
  hiddenByOverflow: number;
}

export interface InteractiveElementsResult {
  totalButtons: number;
  visibleButtons: number;
  totalLinks: number;
  visibleLinks: number;
  totalInputs: number;
  visibleInputs: number;
  obscuredElements: Array<{
    selector: string;
    tagName: string;
    reason: string;
  }>;
}

export interface LayoutIntegrityResult {
  hasHorizontalScroll: boolean;
  viewportWidth: number;
  contentWidth: number;
  documentHeight: number;
  overflowElements: Array<{
    selector: string;
    overflowX: number;
    overflowY: number;
  }>;
}

export interface HiddenElementsResult {
  displayNone: number;
  visibilityHidden: number;
  opacityZero: number;
  offscreenElements: number;
  potentialZIndexIssues: Array<{
    selector: string;
    zIndex: number;
  }>;
}

export interface VisualCheckResult
  extends
    TextVisibilityResult,
    InteractiveElementsResult,
    LayoutIntegrityResult,
    HiddenElementsResult {}

/**
 * Check text visibility and contrast on the page
 * Detects low-contrast text that may be hard to read
 */
export async function checkTextVisibility(
  page: any
): Promise<TextVisibilityResult> {
  const result = await page.evaluate(() => {
    const getSelector = (el) => {
      const className =
        typeof el.className === 'string'
          ? (el.className ?? '')
          : (el.getAttribute('class') ?? '');

      return el.id
        ? `#${el.id}`
        : className
          ? `${el.tagName.toLowerCase()}.${className.split(' ')[0]}`
          : el.tagName.toLowerCase();
    };

    window.__visualCheckData = [];

    const textElements = document.querySelectorAll(
      'p, h1, h2, h3, h4, h5, h6, span, a, button, label, li, td, th, div'
    );

    let visibleCount = 0;
    let hiddenByOverflow = 0;

    textElements.forEach((el) => {
      try {
        const text = el.textContent?.trim();
        if (!text || text.length < 3) return;

        const style = window.getComputedStyle(el);
        const rect = el.getBoundingClientRect();

        if (
          style.display === 'none' ||
          style.visibility === 'hidden' ||
          style.opacity === '0'
        ) {
          return;
        }

        if (rect.width === 0 || rect.height === 0) {
          hiddenByOverflow++;
          return;
        }

        visibleCount++;

        const textColor = style.color;
        let bgColor = style.backgroundColor;

        if (bgColor === 'rgba(0, 0, 0, 0)' || bgColor === 'transparent') {
          let parent = el.parentElement;
          while (parent) {
            const parentStyle = window.getComputedStyle(parent);
            bgColor = parentStyle.backgroundColor;
            if (bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') {
              break;
            }
            parent = parent.parentElement;
          }
        }

        const selector = getSelector(el);
        window.__visualCheckData = window.__visualCheckData || [];
        window.__visualCheckData.push({
          selector,
          text: text.substring(0, 50),
          textColor,
          bgColor,
          fontSize: parseFloat(style.fontSize),
          fontWeight: style.fontWeight,
        });
      } catch {
        return;
      }
    });

    return {
      visibleTextElements: visibleCount,
      hiddenByOverflow,
      elementsData: window.__visualCheckData || [],
    };
  });

  // Calculate contrast ratios in Node context
  const lowContrastElements = result.elementsData
    .map((el: any) => {
      const ratio = getContrastRatio(el.textColor, el.bgColor);
      const isLargeText =
        el.fontSize >= 18 || (el.fontSize >= 14 && el.fontWeight >= 700);

      return {
        selector: el.selector,
        text: el.text,
        textColor: el.textColor,
        bgColor: el.bgColor,
        contrastRatio: Math.round(ratio * 10) / 10,
        passesWCAGAA: meetsWCAGAA(ratio, isLargeText),
      };
    })
    .filter((el: any) => !el.passesWCAGAA);

  return {
    visibleTextElements: result.visibleTextElements,
    lowContrastElements,
    hiddenByOverflow: result.hiddenByOverflow,
  };
}

/**
 * Check that interactive elements are visible and not obscured
 */
export async function checkInteractiveElements(
  page: any
): Promise<InteractiveElementsResult> {
  return page.evaluate(() => {
    const getSelector = (el: Element) => {
      const className =
        typeof (el as Element & { className?: unknown }).className === 'string'
          ? ((el as Element & { className: string }).className ?? '')
          : (el.getAttribute('class') ?? '');

      return el.id
        ? `#${el.id}`
        : className
          ? `${el.tagName.toLowerCase()}.${className.split(' ')[0]}`
          : el.tagName.toLowerCase();
    };

    const buttons = document.querySelectorAll('button');
    const links = document.querySelectorAll('a[href]');
    const inputs = document.querySelectorAll('input, select, textarea');

    const obscuredElements: Array<{
      selector: string;
      tagName: string;
      reason: string;
    }> = [];

    const checkVisibility = (el: Element, type: string): boolean => {
      const style = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();

      const selector = getSelector(el);

      // Check if hidden by CSS
      if (style.display === 'none') {
        obscuredElements.push({
          selector,
          tagName: type,
          reason: 'display: none',
        });
        return false;
      }
      if (style.visibility === 'hidden') {
        obscuredElements.push({
          selector,
          tagName: type,
          reason: 'visibility: hidden',
        });
        return false;
      }
      if (parseFloat(style.opacity) === 0) {
        obscuredElements.push({
          selector,
          tagName: type,
          reason: 'opacity: 0',
        });
        return false;
      }

      // Check if element has zero size
      if (rect.width === 0 || rect.height === 0) {
        obscuredElements.push({ selector, tagName: type, reason: 'zero size' });
        return false;
      }

      // Check if element is off-screen
      if (rect.bottom < 0 || rect.top > window.innerHeight) {
        // Not necessarily obscured, just not in viewport
        return true;
      }

      return true;
    };

    let visibleButtons = 0;
    let visibleLinks = 0;
    let visibleInputs = 0;

    buttons.forEach((btn) => {
      if (checkVisibility(btn, 'button')) visibleButtons++;
    });

    links.forEach((link) => {
      if (checkVisibility(link, 'link')) visibleLinks++;
    });

    inputs.forEach((input) => {
      if (checkVisibility(input, 'input')) visibleInputs++;
    });

    return {
      totalButtons: buttons.length,
      visibleButtons,
      totalLinks: links.length,
      visibleLinks,
      totalInputs: inputs.length,
      visibleInputs,
      obscuredElements,
    };
  });
}

/**
 * Check layout integrity - no horizontal scroll, overflow issues
 */
export async function checkLayoutIntegrity(
  page: any
): Promise<LayoutIntegrityResult> {
  return page.evaluate(() => {
    const getSelector = (el: Element) => {
      const className =
        typeof (el as Element & { className?: unknown }).className === 'string'
          ? ((el as Element & { className: string }).className ?? '')
          : (el.getAttribute('class') ?? '');

      return el.id
        ? `#${el.id}`
        : className
          ? `${el.tagName.toLowerCase()}.${className.split(' ')[0]}`
          : el.tagName.toLowerCase();
    };

    const viewportWidth = window.innerWidth;
    const contentWidth = document.documentElement.scrollWidth;
    const documentHeight = document.documentElement.scrollHeight;

    const overflowElements: Array<{
      selector: string;
      overflowX: number;
      overflowY: number;
    }> = [];

    // Check for elements causing overflow
    document.querySelectorAll('*').forEach((el) => {
      const rect = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);

      // Skip elements with overflow: hidden or auto (they handle their own overflow)
      if (style.overflowX === 'hidden' || style.overflowX === 'auto') return;

      if (rect.width > viewportWidth + 10) {
        // 10px tolerance
        const selector = getSelector(el);

        overflowElements.push({
          selector,
          overflowX: Math.round(rect.width - viewportWidth),
          overflowY: 0,
        });
      }
    });

    return {
      hasHorizontalScroll: contentWidth > viewportWidth + 10,
      viewportWidth,
      contentWidth,
      documentHeight,
      overflowElements: overflowElements.slice(0, 10), // Limit to top 10
    };
  });
}

/**
 * Check for hidden/z-index issues
 */
export async function checkHiddenElements(
  page: any
): Promise<HiddenElementsResult> {
  return page.evaluate(() => {
    const getSelector = (el: Element) => {
      const className =
        typeof (el as Element & { className?: unknown }).className === 'string'
          ? ((el as Element & { className: string }).className ?? '')
          : (el.getAttribute('class') ?? '');

      return el.id
        ? `#${el.id}`
        : className
          ? `${el.tagName.toLowerCase()}.${className.split(' ')[0]}`
          : el.tagName.toLowerCase();
    };

    let displayNone = 0;
    let visibilityHidden = 0;
    let opacityZero = 0;
    let offscreenElements = 0;
    const potentialZIndexIssues: Array<{ selector: string; zIndex: number }> =
      [];

    document.querySelectorAll('*').forEach((el) => {
      const style = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      const selector = getSelector(el);

      if (style.display === 'none') displayNone++;
      if (style.visibility === 'hidden') visibilityHidden++;
      if (parseFloat(style.opacity) === 0) opacityZero++;

      // Check for offscreen positioning
      if (style.position === 'absolute' || style.position === 'fixed') {
        if (
          rect.right < -100 ||
          rect.left > window.innerWidth + 100 ||
          rect.bottom < -100 ||
          rect.top > window.innerHeight + 100
        ) {
          offscreenElements++;
        }
      }

      // Check for high z-index elements that might cover content
      const zIndex = parseInt(style.zIndex, 10);
      if (zIndex > 1000 && rect.width > 0 && rect.height > 0) {
        potentialZIndexIssues.push({ selector, zIndex });
      }
    });

    return {
      displayNone,
      visibilityHidden,
      opacityZero,
      offscreenElements,
      potentialZIndexIssues: potentialZIndexIssues.slice(0, 10), // Limit to top 10
    };
  });
}

/**
 * Run all visual checks and return combined result
 */
export async function runFullVisualCheck(
  stagehand: Stagehand
): Promise<VisualCheckResult> {
  const page = await getActivePage(stagehand);

  // Stagehand page.evaluate is not reliable under parallel execution.
  const textVisibility = await checkTextVisibility(page);
  const interactiveElements = await checkInteractiveElements(page);
  const layoutIntegrity = await checkLayoutIntegrity(page);
  const hiddenElements = await checkHiddenElements(page);

  return {
    ...textVisibility,
    ...interactiveElements,
    ...layoutIntegrity,
    ...hiddenElements,
  };
}
