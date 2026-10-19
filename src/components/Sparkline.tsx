"use client";

import React from "react";

interface SparklineProps {
  data?: number[];
  width?: number;
  height?: number;
  className?: string;
}

export function Sparkline({
  data = [10, 15, 12, 18, 20, 25, 24, 30],
  width = 96,
  height = 24,
  className = "",
}: SparklineProps) {
  // Ensure we have at least 2 points and safe numbers
  const safeData = Array.isArray(data) && data.length > 0 ? data : [1, 1, 1, 1];
  const min = Math.min(...safeData);
  const max = Math.max(...safeData);
  const range = max === min ? 1 : max - min;

  const paddingY = 3;
  const usableHeight = height - paddingY * 2;

  // Generate SVG coordinates
  const points = safeData.map((val, idx) => {
    const x = (idx / (safeData.length - 1)) * (width - 4) + 2;
    const y = height - paddingY - ((val - min) / range) * usableHeight;
    return { x, y };
  });

  // Construct smooth SVG path
  const pathD = points.reduce((acc, curr, idx, arr) => {
    if (idx === 0) return `M ${curr.x},${curr.y}`;
    const prev = arr[idx - 1];
    const cp1x = prev.x + (curr.x - prev.x) / 2;
    const cp1y = prev.y;
    const cp2x = cp1x;
    const cp2y = curr.y;
    return `${acc} C ${cp1x},${cp1y} ${cp2x},${cp2y} ${curr.x},${curr.y}`;
  }, "");

  // Area under curve
  const areaD = `${pathD} L ${points[points.length - 1].x},${height} L ${points[0].x},${height} Z`;

  return (
    <div className={`relative flex items-center justify-end ${className}`}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-24 h-6 overflow-visible text-neutral-500 hover:text-emerald-400 transition-colors duration-200"
      >
        <defs>
          <linearGradient id={`spark-${points.length}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.25" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.0" />
          </linearGradient>
        </defs>
        <path d={areaD} fill={`url(#spark-${points.length})`} />
        <path
          d={pathD}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
