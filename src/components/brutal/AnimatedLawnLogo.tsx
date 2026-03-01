import { useMemo } from 'react';

interface Cell {
  x: number;
  y: number;
  colour: string;
}

interface Point {
  x: number;
  y: number;
}

const CELL = 10;
const GAP = 2;
const PITCH = CELL + GAP;

const FACE = '#000000';
const MID = '#6B7280';
const FAR = '#D1D5DB';

/* ── Letter shapes ───────────────────────────────────────── */

function buildLetters(): Point[] {
  const pts: Point[] = [];
  const seen = new Set<string>();

  const add = (x: number, y: number): void => {
    const k = `${x},${y}`;
    if (!seen.has(k)) {
      seen.add(k);
      pts.push({ x, y });
    }
  };

  const rect = (x: number, y: number, w: number, h: number): void => {
    for (let dy = 0; dy < h; dy++)
      for (let dx = 0; dx < w; dx++) add(x + dx, y + dy);
  };

  let o = 0;

  // L
  rect(o, 0, 1, 7);
  rect(o, 6, 5, 1);
  o += 6;

  // A
  rect(o, 1, 1, 6);
  rect(o + 4, 1, 1, 6);
  rect(o + 1, 0, 3, 1);
  rect(o + 1, 3, 3, 1);
  o += 6;

  // W
  rect(o, 0, 1, 7);
  rect(o + 6, 0, 1, 7);
  add(o + 1, 5);
  add(o + 2, 6);
  add(o + 3, 5);
  add(o + 4, 6);
  add(o + 5, 5);
  o += 8;

  // N
  rect(o, 0, 1, 7);
  rect(o + 4, 0, 1, 7);
  add(o + 1, 1);
  add(o + 2, 2);
  add(o + 2, 3);
  add(o + 3, 4);
  add(o + 3, 5);

  return pts;
}

/* ── Component ───────────────────────────────────────────── */

export interface AnimatedLawnLogoProps {
  readonly size?: 'sm' | 'md' | 'lg';
  readonly autoPlay?: boolean;
  readonly loop?: boolean;
  readonly duration?: number;
  readonly className?: string;
}

export default function AnimatedLawnLogo({
  size = 'md',
  className = '',
}: AnimatedLawnLogoProps) {
  const { cells, viewBox } = useMemo(() => {
    const pts = buildLetters();

    const layers: [number, string][] = [
      [2, FAR],
      [1, MID],
      [0, FACE],
    ];

    const allCells: Cell[] = [];
    for (const [offset, colour] of layers) {
      for (const p of pts) {
        allCells.push({ x: p.x + offset, y: p.y + offset, colour });
      }
    }

    let maxX = 0;
    let maxY = 0;
    for (const c of allCells) {
      if (c.x > maxX) maxX = c.x;
      if (c.y > maxY) maxY = c.y;
    }

    const pad = 1;
    const w = (maxX + 1 + pad * 2) * PITCH;
    const h = (maxY + 1 + pad * 2) * PITCH;

    return { cells: allCells, viewBox: `0 0 ${w} ${h}` };
  }, []);

  const pad = 1;

  const sizes = {
    sm: { box: 'w-32 h-16', scale: 0.5 },
    md: { box: 'w-48 sm:w-64 h-24 sm:h-32', scale: 1 },
    lg: { box: 'w-56 sm:w-80 md:w-96 h-28 sm:h-40 md:h-48', scale: 1.5 },
  };

  return (
    <div
      className={`flex items-center justify-center ${sizes[size].box} ${className}`}
      aria-label="LAWN"
    >
      <svg
        width="100%"
        height="100%"
        viewBox={viewBox}
        style={{ transform: `scale(${sizes[size].scale})` }}
        shapeRendering="crispEdges"
      >
        <title>LAWN</title>
        {cells.map((c, i) => (
          <rect
            key={`${i}-${c.x}-${c.y}`}
            x={(c.x + pad) * PITCH}
            y={(c.y + pad) * PITCH}
            width={CELL}
            height={CELL}
            fill={c.colour}
          />
        ))}
      </svg>
    </div>
  );
}
