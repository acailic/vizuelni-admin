'use client';

import { useEffect, useRef, useState } from 'react';

interface DataPoint {
  year: number;
  value: number;
}

// Sample data for the animated chart - Serbia GDP growth trend
const sampleData: DataPoint[] = [
  { year: 2015, value: 0.8 },
  { year: 2016, value: 2.8 },
  { year: 2017, value: 3.5 },
  { year: 2018, value: 4.4 },
  { year: 2019, value: 4.2 },
  { year: 2020, value: -0.9 },
  { year: 2021, value: 7.7 },
  { year: 2022, value: 2.5 },
  { year: 2023, value: 2.1 },
  { year: 2024, value: 3.5 },
];

interface HeroAnimatedChartProps {
  className?: string;
}

export function HeroAnimatedChart({ className = '' }: HeroAnimatedChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [animationProgress, setAnimationProgress] = useState(0);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resize();
    window.addEventListener('resize', resize);

    // Animation loop
    const startTime = Date.now();
    const duration = 2000; // 2 seconds

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-out-cubic)
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimationProgress(eased);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const padding = 40;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Calculate scales
    const xScale = (width - padding * 2) / (sampleData.length - 1);
    const yMin = Math.min(...sampleData.map((d) => d.value));
    const yMax = Math.max(...sampleData.map((d) => d.value));
    const yRange = yMax - yMin;
    const yScale = (height - padding * 2) / (yRange * 1.2);
    const yOffset = height - padding - yRange * 0.1 * yScale;

    // Draw grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;

    for (let i = 0; i <= 4; i++) {
      const y = padding + (height - padding * 2) * (i / 4);
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }

    // Draw the line with animation
    const pointsToDraw = Math.floor(sampleData.length * animationProgress);
    if (pointsToDraw < 1) return;

    // Create gradient
    const gradient = ctx.createLinearGradient(0, padding, 0, height - padding);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0.4)');

    // Draw line
    ctx.beginPath();
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    for (let i = 0; i <= pointsToDraw && i < sampleData.length; i++) {
      const point = sampleData[i];
      const x = padding + i * xScale;
      const y = yOffset - (point.value - yMin) * yScale;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();

    // Draw area under curve
    if (pointsToDraw > 0) {
      ctx.beginPath();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';

      const firstX = padding;
      const firstY = yOffset - (sampleData[0].value - yMin) * yScale;
      ctx.moveTo(firstX, yOffset);
      ctx.lineTo(firstX, firstY);

      for (let i = 1; i <= pointsToDraw && i < sampleData.length; i++) {
        const point = sampleData[i];
        const x = padding + i * xScale;
        const y = yOffset - (point.value - yMin) * yScale;
        ctx.lineTo(x, y);
      }

      const lastX =
        padding + Math.min(pointsToDraw, sampleData.length - 1) * xScale;
      ctx.lineTo(lastX, yOffset);
      ctx.closePath();
      ctx.fill();
    }

    // Draw data points
    for (let i = 0; i <= pointsToDraw && i < sampleData.length; i++) {
      const point = sampleData[i];
      const x = padding + i * xScale;
      const y = yOffset - (point.value - yMin) * yScale;

      // Outer glow
      ctx.beginPath();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.arc(x, y, 8, 0, Math.PI * 2);
      ctx.fill();

      // Inner dot
      ctx.beginPath();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw year labels (every other year)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = '11px system-ui, sans-serif';
    ctx.textAlign = 'center';

    for (let i = 0; i < sampleData.length; i += 2) {
      const x = padding + i * xScale;
      ctx.fillText(sampleData[i].year.toString(), x, height - 15);
    }
  }, [animationProgress]);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full ${className}`}
      style={{ width: '100%', height: '100%' }}
    />
  );
}
