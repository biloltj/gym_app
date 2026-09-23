"use client";

import { useState } from "react";

export type RevenuePoint = {
  month: string;
  label: string;
  collected: number;
  expected: number;
};

const COLOR_COLLECTED = "#3987e5"; // categorical slot 1 (blue), dark-mode step
const COLOR_EXPECTED = "#d95926"; // categorical slot 2 (orange), dark-mode step

const BAR_WIDTH = 18;
const BAR_GAP = 2;
const GROUP_PADDING = 24;
const GROUP_WIDTH = BAR_WIDTH * 2 + BAR_GAP + GROUP_PADDING;
const PLOT_HEIGHT = 180;
const TOP_MARGIN = 28;
const AXIS_HEIGHT = 24;
const LEFT_MARGIN = 44;

function niceMax(value: number): number {
  if (value <= 0) return 100;
  const exponent = Math.floor(Math.log10(value));
  const magnitude = 10 ** exponent;
  const residual = value / magnitude;
  const niceResidual = residual <= 1 ? 1 : residual <= 2 ? 2 : residual <= 5 ? 5 : 10;
  return niceResidual * magnitude;
}

function compact(value: number): string {
  if (value >= 1000) {
    const k = value / 1000;
    return `${k % 1 === 0 ? k : k.toFixed(1)}K`;
  }
  return String(Math.round(value));
}

function topRoundedRectPath(x: number, y: number, w: number, h: number, r: number): string {
  const radius = Math.max(0, Math.min(r, h, w / 2));
  if (h <= 0) return "";
  return `M${x},${y + radius} Q${x},${y} ${x + radius},${y} L${x + w - radius},${y} Q${x + w},${y} ${x + w},${y + radius} L${x + w},${y + h} L${x},${y + h} Z`;
}

export default function RevenueChart({
  data,
  legendCollected,
  legendExpected,
}: {
  data: RevenuePoint[];
  legendCollected: string;
  legendExpected: string;
}) {
  const [hovered, setHovered] = useState<number | null>(null);

  const maxValue = niceMax(Math.max(1, ...data.flatMap((d) => [d.collected, d.expected])));
  const scale = PLOT_HEIGHT / maxValue;
  const baselineY = TOP_MARGIN + PLOT_HEIGHT;
  const width = LEFT_MARGIN + GROUP_WIDTH * data.length;
  const height = TOP_MARGIN + PLOT_HEIGHT + AXIS_HEIGHT;

  const gridSteps = [0, 0.5, 1];

  return (
    <div className="relative">
      <div className="flex items-center gap-4 mb-3 text-xs text-neutral-400">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm" style={{ background: COLOR_COLLECTED }} />
          {legendCollected}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm" style={{ background: COLOR_EXPECTED }} />
          {legendExpected}
        </span>
      </div>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        style={{ height: `${height}px` }}
        role="img"
        aria-label={`${legendCollected} vs ${legendExpected}`}
      >
        {gridSteps.map((step) => {
          const y = baselineY - step * PLOT_HEIGHT;
          return (
            <g key={step}>
              <line
                x1={LEFT_MARGIN - 8}
                x2={width}
                y1={y}
                y2={y}
                stroke="#2c2c2a"
                strokeWidth={1}
              />
              <text
                x={LEFT_MARGIN - 14}
                y={y}
                textAnchor="end"
                dominantBaseline="middle"
                className="fill-neutral-500"
                fontSize={10}
              >
                {compact(maxValue * step)}
              </text>
            </g>
          );
        })}

        {data.map((d, i) => {
          const groupX = LEFT_MARGIN + i * GROUP_WIDTH + GROUP_PADDING / 2;
          const collectedH = d.collected * scale;
          const expectedH = d.expected * scale;
          const isHovered = hovered === i;
          const isLast = i === data.length - 1;

          return (
            <g key={d.month}>
              {isHovered && (
                <rect
                  x={groupX - 4}
                  y={TOP_MARGIN - 4}
                  width={BAR_WIDTH * 2 + BAR_GAP + 8}
                  height={PLOT_HEIGHT + 8}
                  fill="#ffffff"
                  opacity={0.04}
                  rx={6}
                />
              )}

              <path
                d={topRoundedRectPath(groupX, baselineY - collectedH, BAR_WIDTH, collectedH, 4)}
                fill={COLOR_COLLECTED}
                opacity={isHovered || hovered === null ? 1 : 0.5}
              />
              <path
                d={topRoundedRectPath(
                  groupX + BAR_WIDTH + BAR_GAP,
                  baselineY - expectedH,
                  BAR_WIDTH,
                  expectedH,
                  4
                )}
                fill={COLOR_EXPECTED}
                opacity={isHovered || hovered === null ? 1 : 0.5}
              />

              {isLast && (
                <text
                  x={groupX + BAR_WIDTH / 2}
                  y={baselineY - collectedH - 8}
                  textAnchor="middle"
                  className="fill-neutral-200"
                  fontSize={11}
                  fontWeight={600}
                >
                  {compact(d.collected)}
                </text>
              )}

              <text
                x={groupX + BAR_WIDTH + BAR_GAP / 2}
                y={baselineY + 16}
                textAnchor="middle"
                className="fill-neutral-500"
                fontSize={10}
              >
                {d.label}
              </text>

              <rect
                x={groupX - GROUP_PADDING / 2}
                y={TOP_MARGIN}
                width={GROUP_WIDTH}
                height={PLOT_HEIGHT}
                fill="transparent"
                tabIndex={0}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(i)}
                onBlur={() => setHovered(null)}
              />
            </g>
          );
        })}
      </svg>

      {hovered !== null && (
        <div
          className="absolute top-0 -translate-x-1/2 rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-xs shadow-xl pointer-events-none"
          style={{ left: `${((hovered + 0.5) / data.length) * 100}%` }}
        >
          <div className="font-medium text-neutral-200 mb-1">{data[hovered].label}</div>
          <div className="flex items-center gap-1.5 text-neutral-300">
            <span className="h-2 w-2 rounded-sm shrink-0" style={{ background: COLOR_COLLECTED }} />
            {legendCollected}: <span className="font-semibold text-white">{data[hovered].collected}</span>
          </div>
          <div className="flex items-center gap-1.5 text-neutral-300">
            <span className="h-2 w-2 rounded-sm shrink-0" style={{ background: COLOR_EXPECTED }} />
            {legendExpected}: <span className="font-semibold text-white">{data[hovered].expected}</span>
          </div>
        </div>
      )}
    </div>
  );
}
