"use client";

import { motion } from "motion/react";
import { TrendingUp } from "lucide-react";

// ===== Area chart er helper =====

const chartWidth = 600;
const chartHeight = 200;
const chartPadTop = 24;
const chartPadBottom = 12;

type ChartPoint = {
  x: number;
  y: number;
};

function getPoints(values: number[]) {
  // sob value 0 hole line niche e thakbe, tai max kom pokkhe 3
  let maxValue = 3;
  for (let i = 0; i < values.length; i++) {
    if (values[i] > maxValue) {
      maxValue = values[i];
    }
  }

  const points: ChartPoint[] = [];
  const stepX = chartWidth / (values.length - 1);
  const usableHeight = chartHeight - chartPadTop - chartPadBottom;

  for (let i = 0; i < values.length; i++) {
    const x = i * stepX;
    const y =
      chartHeight - chartPadBottom - (values[i] / maxValue) * usableHeight;
    points.push({ x: x, y: y });
  }

  return points;
}

// Smooth curve line er path
function buildLinePath(points: ChartPoint[]) {
  let path = "M " + points[0].x + "," + points[0].y;

  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const current = points[i];
    const midX = (prev.x + current.x) / 2;

    path =
      path +
      " C " +
      midX +
      "," +
      prev.y +
      " " +
      midX +
      "," +
      current.y +
      " " +
      current.x +
      "," +
      current.y;
  }

  return path;
}

function buildAreaPath(points: ChartPoint[]) {
  const linePath = buildLinePath(points);
  const last = points[points.length - 1];

  return (
    linePath + " L " + last.x + "," + chartHeight + " L 0," + chartHeight + " Z"
  );
}

// ===== Area chart =====

type AreaTrendProps = {
  idPrefix: string;
  title: string;
  subtitle: string;
  totalLabel: string;
  emptyText: string;
  data: { date: string; count: number }[];
};

export function AreaTrend({
  idPrefix,
  title,
  subtitle,
  totalLabel,
  emptyText,
  data,
}: AreaTrendProps) {
  const values: number[] = [];
  let total = 0;

  for (let i = 0; i < data.length; i++) {
    values.push(data[i].count);
    total = total + data[i].count;
  }

  const points = getPoints(values);
  const linePath = buildLinePath(points);
  const areaPath = buildAreaPath(points);

  const gridLines = [0.25, 0.5, 0.75];
  const fillId = idPrefix + "Fill";
  const strokeId = idPrefix + "Stroke";

  return (
    <div>
      <div className="flex items-end justify-between">
        <div>
          <h3 className="font-semibold">{title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        </div>

        <div className="text-right">
          <p className="font-heading text-3xl font-bold">{total}</p>
          <p className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
            <TrendingUp className="h-3.5 w-3.5 text-primary" />
            {totalLabel}
          </p>
        </div>
      </div>

      <div className="relative mt-6 h-52">
        <svg
          viewBox={"0 0 " + chartWidth + " " + chartHeight}
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
        >
          <defs>
            <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2db5a8" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#2db5a8" stopOpacity="0" />
            </linearGradient>
            <linearGradient id={strokeId} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#2db5a8" />
              <stop offset="100%" stopColor="#e3b55f" />
            </linearGradient>
          </defs>

          {gridLines.map((line) => (
            <line
              key={line}
              x1="0"
              x2={chartWidth}
              y1={chartHeight * line}
              y2={chartHeight * line}
              strokeDasharray="4 6"
              className="stroke-border"
              vectorEffect="non-scaling-stroke"
            />
          ))}

          <motion.path
            d={areaPath}
            fill={"url(#" + fillId + ")"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          />

          <motion.path
            d={linePath}
            fill="none"
            stroke={"url(#" + strokeId + ")"}
            strokeWidth="3"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.4, ease: "easeInOut" }}
          />
        </svg>

        {/* Dot gulo, hover korle number dekhay */}
        {points.map((point, index) => (
          <div
            key={index}
            className="group absolute -translate-x-1/2 -translate-y-1/2"
            style={{
              left: (point.x / chartWidth) * 100 + "%",
              top: (point.y / chartHeight) * 100 + "%",
            }}
          >
            <span className="block h-3 w-3 rounded-full border-2 border-card bg-primary shadow transition group-hover:scale-150" />
            <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 rounded-lg bg-foreground px-2 py-1 text-xs font-semibold text-background opacity-0 shadow transition group-hover:opacity-100">
              {values[index]}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-3 flex justify-between">
        {data.map((day) => {
          const label = new Date(day.date + "T00:00:00").toLocaleDateString(
            "en-US",
            { weekday: "short" }
          );

          return (
            <span key={day.date} className="text-xs text-muted-foreground">
              {label}
            </span>
          );
        })}
      </div>

      {total === 0 && (
        <p className="mt-4 rounded-xl bg-muted p-3 text-center text-sm text-muted-foreground">
          {emptyText}
        </p>
      )}
    </div>
  );
}

// ===== Donut chart =====

type DonutSegment = {
  label: string;
  value: number;
  color: string;
};

type DonutChartProps = {
  title: string;
  subtitle: string;
  centerLabel: string;
  segments: DonutSegment[];
};

export function DonutChart({
  title,
  subtitle,
  centerLabel,
  segments,
}: DonutChartProps) {
  let total = 0;
  for (let i = 0; i < segments.length; i++) {
    total = total + segments[i].value;
  }

  const radius = 42;
  const circumference = 2 * Math.PI * radius;

  // Protita arc er length ar shuru kothay
  const arcs = [];
  let offset = 0;

  for (let i = 0; i < segments.length; i++) {
    let length = 0;
    if (total > 0) {
      length = (segments[i].value / total) * circumference;
    }

    arcs.push({
      label: segments[i].label,
      value: segments[i].value,
      color: segments[i].color,
      length: length,
      offset: offset,
    });

    offset = offset + length;
  }

  return (
    <div>
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>

      <div className="relative mx-auto mt-6 h-40 w-40">
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            strokeWidth="10"
            className="stroke-muted"
          />

          {arcs.map((arc) => {
            if (arc.length === 0) {
              return null;
            }

            return (
              <motion.circle
                key={arc.label}
                cx="50"
                cy="50"
                r={radius}
                fill="none"
                stroke={arc.color}
                strokeWidth="10"
                strokeDashoffset={-arc.offset}
                initial={{ strokeDasharray: "0 " + circumference }}
                animate={{
                  strokeDasharray:
                    arc.length + " " + (circumference - arc.length),
                }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />
            );
          })}
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-heading text-3xl font-bold">{total}</span>
          <span className="text-xs text-muted-foreground">{centerLabel}</span>
        </div>
      </div>

      <div className="mt-6 space-y-2.5">
        {arcs.map((arc) => (
          <div
            key={arc.label}
            className="flex items-center justify-between text-sm"
          >
            <span className="flex items-center gap-2 text-muted-foreground">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: arc.color }}
              />
              {arc.label}
            </span>
            <span className="font-semibold">{arc.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ===== Stacked bar =====

type StackedBarProps = {
  segments: DonutSegment[];
};

export function StackedBar({ segments }: StackedBarProps) {
  let total = 0;
  for (let i = 0; i < segments.length; i++) {
    total = total + segments[i].value;
  }

  return (
    <div>
      <div className="flex h-4 w-full overflow-hidden rounded-full bg-muted">
        {segments.map((segment, index) => {
          let percent = 0;
          if (total > 0) {
            percent = (segment.value / total) * 100;
          }

          return (
            <motion.div
              key={segment.label}
              className="h-full"
              style={{ backgroundColor: segment.color }}
              initial={{ width: 0 }}
              animate={{ width: percent + "%" }}
              transition={{ duration: 1, delay: 0.3 + index * 0.15 }}
            />
          );
        })}
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3">
        {segments.map((segment) => (
          <div key={segment.label} className="rounded-2xl bg-muted/60 p-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: segment.color }}
              />
              {segment.label}
            </div>
            <p className="mt-1 font-heading text-2xl font-bold">
              {segment.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}