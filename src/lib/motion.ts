
import type { Variants } from 'framer-motion';

export const motionDuration = {
  quick: 0.16,
  section: 0.28,
  geometry: 0.36,
  initialization: 0.9,
} as const;

export const motionEase = [0.2, 0.75, 0.25, 1] as const;

export const defaultMotionTransition = {
  duration: motionDuration.section,
  ease: motionEase,
};

export const workspaceSectionVariants: Variants = {
  initial: (direction: 1 | -1) => ({
    opacity: 0,
    x: direction > 0 ? 48 : -48,
    rotateY: direction > 0 ? -2 : 2,
  }),
  enter: {
    opacity: 1,
    x: 0,
    rotateY: 0,
    transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] },
  },
  exit: (direction: 1 | -1) => ({
    opacity: 0,
    x: direction > 0 ? -48 : 48,
    rotateY: direction > 0 ? 2 : -2,
    transition: { duration: 0.34, ease: [0.22, 1, 0.36, 1] },
  }),
};

export interface Point {
  x: number;
  y: number;
}

export function createEulerSpiralPoints(
  width: number,
  height: number,
  sampleCount = 96,
): Point[] {
  const maxT = 3.2;
  const step = maxT / sampleCount;
  const rawPoints: Point[] = [{ x: 0, y: 0 }];
  let x = 0;
  let y = 0;

  for (let index = 1; index <= sampleCount; index += 1) {
    const t = (index - 0.5) * step;
    x += Math.cos((t * t) / 2) * step;
    y += Math.sin((t * t) / 2) * step;
    rawPoints.push({ x, y });
  }

  const minX = Math.min(...rawPoints.map((point) => point.x));
  const maxX = Math.max(...rawPoints.map((point) => point.x));
  const minY = Math.min(...rawPoints.map((point) => point.y));
  const maxY = Math.max(...rawPoints.map((point) => point.y));
  const padding = Math.min(width, height) * 0.12;
  const drawableWidth = width - padding * 2;
  const drawableHeight = height - padding * 2;
  const scale = Math.min(
    drawableWidth / Math.max(maxX - minX, Number.EPSILON),
    drawableHeight / Math.max(maxY - minY, Number.EPSILON),
  );
  const offsetX = (width - (maxX - minX) * scale) / 2;
  const offsetY = (height - (maxY - minY) * scale) / 2;

  return rawPoints.map((point) => ({
    x: offsetX + (point.x - minX) * scale,
    y: height - offsetY - (point.y - minY) * scale,
  }));
}

export function pointsToPath(points: Point[]): string {
  return points
    .map((point, index) => `${index === 0 ? 'M' : 'L'}${point.x.toFixed(2)},${point.y.toFixed(2)}`)
    .join(' ');
}

export function pointAtProgress(points: Point[], progress: number): Point {
  const position = Math.max(0, Math.min(1, progress)) * (points.length - 1);
  const index = Math.floor(position);
  const next = Math.min(index + 1, points.length - 1);
  const amount = position - index;

  return {
    x: points[index].x + (points[next].x - points[index].x) * amount,
    y: points[index].y + (points[next].y - points[index].y) * amount,
  };
}

export const workspaceCurvePoints = createEulerSpiralPoints(72, 22, 72);
export const workspaceCurvePath = pointsToPath(workspaceCurvePoints);
