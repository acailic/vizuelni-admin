import { useEffect, useRef, useState } from 'react';

/**
 * Detects when a chart enters the viewport and triggers a one-shot draw animation.
 * Skips animation for users who prefer reduced motion (handled via matchMedia).
 * Recharts isAnimationActive is set to true only after the chart scrolls into view.
 */
export function useChartInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect(); // animate only once
        }
      },
      { threshold }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}
