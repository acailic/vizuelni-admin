'use client';

import { useEffect, useRef } from 'react';

import { gdpTimeSeriesConfig } from '@/lib/examples/configs/gdp-time-series';

interface DataPoint {
  label: string;
  value: number;
}

const selectedRegion =
  typeof gdpTimeSeriesConfig.preselectedFilters?.dataFilters?.region ===
  'string'
    ? gdpTimeSeriesConfig.preselectedFilters.dataFilters.region
    : null;

const seriesData: DataPoint[] = (
  gdpTimeSeriesConfig.inlineData?.observations ?? []
)
  .filter((point) => {
    if (!selectedRegion) {
      return true;
    }

    return String(point.region ?? '') === selectedRegion;
  })
  .map((point) => ({
    label: String(point.quarter ?? ''),
    value: Number(point.gdp),
  }))
  .filter(
    (point): point is DataPoint =>
      point.label.length > 0 && Number.isFinite(point.value)
  );

interface HeroAnimatedChartProps {
  className?: string;
}

export function HeroAnimatedChart({ className = '' }: HeroAnimatedChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || seriesData.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    const duration = prefersReducedMotion ? 0 : 1800;
    let progress = prefersReducedMotion ? 1 : 0;

    const draw = (currentProgress: number) => {
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      if (width === 0 || height === 0) {
        return;
      }

      const devicePixelRatio = window.devicePixelRatio || 1;
      canvas.width = Math.round(width * devicePixelRatio);
      canvas.height = Math.round(height * devicePixelRatio);
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
      ctx.clearRect(0, 0, width, height);

      const paddingX = Math.max(28, width * 0.08);
      const paddingTop = Math.max(28, height * 0.14);
      const paddingBottom = Math.max(32, height * 0.16);
      const chartWidth = Math.max(width - paddingX * 2, 1);
      const chartHeight = Math.max(height - paddingTop - paddingBottom, 1);
      const xStep =
        seriesData.length > 1
          ? chartWidth / (seriesData.length - 1)
          : chartWidth;
      const yMin = Math.min(...seriesData.map((point) => point.value));
      const yMax = Math.max(...seriesData.map((point) => point.value));
      const yRange = Math.max(yMax - yMin, 1);
      const yPadding = yRange * 0.18;
      const lowerBound = yMin - yPadding;
      const upperBound = yMax + yPadding;
      const scaleY = (value: number) =>
        paddingTop +
        ((upperBound - value) / (upperBound - lowerBound)) * chartHeight;

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      for (let index = 0; index <= 3; index += 1) {
        const y = paddingTop + (chartHeight / 3) * index;
        ctx.beginPath();
        ctx.moveTo(paddingX, y);
        ctx.lineTo(width - paddingX, y);
        ctx.stroke();
      }

      if (currentProgress <= 0) {
        return;
      }

      const visiblePoints = Math.max(
        1,
        Math.ceil(seriesData.length * currentProgress)
      );
      const visibleData = seriesData.slice(0, visiblePoints);
      const areaGradient = ctx.createLinearGradient(0, paddingTop, 0, height);
      areaGradient.addColorStop(0, 'rgba(255, 255, 255, 0.2)');
      areaGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.beginPath();
      visibleData.forEach((point, index) => {
        const x = paddingX + xStep * index;
        const y = scaleY(point.value);

        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();

      const lastPoint = visibleData[visibleData.length - 1];
      const lastPointX = paddingX + xStep * (visibleData.length - 1);
      ctx.lineTo(lastPointX, paddingTop + chartHeight);
      ctx.lineTo(paddingX, paddingTop + chartHeight);
      ctx.closePath();
      ctx.fillStyle = areaGradient;
      ctx.fill();

      visibleData.forEach((point, index) => {
        const x = paddingX + xStep * index;
        const y = scaleY(point.value);

        ctx.beginPath();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.arc(x, y, 8, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.fillStyle = 'rgba(255, 255, 255, 0.58)';
      ctx.font = '11px system-ui, sans-serif';
      ctx.textAlign = 'center';
      seriesData.forEach((point, index) => {
        const x = paddingX + xStep * index;
        const shortLabel = point.label.replace('2023', '').trim();
        ctx.fillText(shortLabel, x, height - 12);
      });

      if (lastPoint) {
        ctx.textAlign = 'left';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.72)';
        ctx.fillText(
          `${selectedRegion ?? 'GDP'} • ${lastPoint.value.toFixed(1)}%`,
          paddingX,
          paddingTop - 10
        );
      }
    };

    const onResize = () => {
      draw(progress);
    };

    if (duration === 0) {
      draw(1);
    } else {
      let startTime = 0;
      const animate = (timestamp: number) => {
        if (startTime === 0) {
          startTime = timestamp;
        }

        const elapsed = timestamp - startTime;
        const rawProgress = Math.min(elapsed / duration, 1);
        progress = 1 - Math.pow(1 - rawProgress, 3);
        draw(progress);

        if (rawProgress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        }
      };

      animationRef.current = requestAnimationFrame(animate);
    }

    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full ${className}`}
      style={{ width: '100%', height: '100%' }}
    />
  );
}
