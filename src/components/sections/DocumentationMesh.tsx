'use client';

import React, { useEffect, useRef } from 'react';

interface DocumentationMeshProps {
  active: boolean;
}

interface MeshPoint {
  x: number;
  y: number;
  originX: number;
  originY: number;
  phase: number;
}

export const DocumentationMesh: React.FC<DocumentationMeshProps> = ({ active }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d', { alpha: true });
    if (!canvas || !context) return;

    let frame = 0;
    let inViewport = true;
    let width = 0;
    let height = 0;
    let points: MeshPoint[] = [];
    let pointer: { x: number; y: number } | null = null;
    const columns = 6;
    const rows = 4;

    const canDraw = () => active && inViewport && document.visibilityState === 'visible';
    const scheduleDraw = () => {
      if (canDraw() && !frame) frame = requestAnimationFrame(draw);
    };

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
      width = bounds.width;
      height = bounds.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      points = [];

      for (let row = 0; row <= rows; row += 1) {
        for (let column = 0; column <= columns; column += 1) {
          const x = (column / columns) * width;
          const y = (row / rows) * height;
          points.push({ x, y, originX: x, originY: y, phase: (row * 17 + column * 11) * 0.17 });
        }
      }
      if (canDraw()) scheduleDraw();
    };

    const draw = () => {
      frame = 0;
      if (!canDraw()) return;
      context.clearRect(0, 0, width, height);
      const interactionStrength = pointer ? 1 : 0;

      points.forEach((point) => {
        let x = point.originX;
        let y = point.originY;

        if (pointer) {
          const dx = x - pointer.x;
          const dy = y - pointer.y;
          const distanceSquared = dx * dx + dy * dy;
          const radius = 150;
          if (distanceSquared < radius * radius && distanceSquared > 1) {
            const force = (1 - Math.sqrt(distanceSquared) / radius) * 16 * interactionStrength;
            const distance = Math.sqrt(distanceSquared);
            x += (dx / distance) * force;
            y += (dy / distance) * force;
          }
        }
        point.x = x;
        point.y = y;
      });

      const drawTriangle = (a: MeshPoint, b: MeshPoint, c: MeshPoint, index: number) => {
        const centerX = (a.x + b.x + c.x) / 3;
        const centerY = (a.y + b.y + c.y) / 3;
        const light = pointer && interactionStrength > 0
          ? Math.max(0, 1 - Math.hypot(centerX - pointer.x, centerY - pointer.y) / 300) * interactionStrength
          : 0;
        context.beginPath();
        context.moveTo(a.x, a.y);
        context.lineTo(b.x, b.y);
        context.lineTo(c.x, c.y);
        context.closePath();
        context.fillStyle = index % 3 === 0
          ? `rgba(139, 92, 246, ${0.012 + light * 0.035})`
          : `rgba(0, 240, 255, ${0.008 + light * 0.025})`;
        context.fill();
        context.strokeStyle = `rgba(121, 145, 172, ${0.09 + light * 0.14})`;
        context.lineWidth = 0.7;
        context.stroke();
      };

      for (let row = 0; row < rows; row += 1) {
        for (let column = 0; column < columns; column += 1) {
          const topLeft = points[row * (columns + 1) + column];
          const topRight = points[row * (columns + 1) + column + 1];
          const bottomLeft = points[(row + 1) * (columns + 1) + column];
          const bottomRight = points[(row + 1) * (columns + 1) + column + 1];
          const alternate = (row + column) % 2 === 0;
          if (alternate) {
            drawTriangle(topLeft, topRight, bottomRight, row + column);
            drawTriangle(topLeft, bottomRight, bottomLeft, row + column + 1);
          } else {
            drawTriangle(topLeft, topRight, bottomLeft, row + column);
            drawTriangle(topRight, bottomRight, bottomLeft, row + column + 1);
          }
        }
      }

    };

    const observer = new IntersectionObserver(([entry]) => {
      inViewport = entry.isIntersecting;
      cancelAnimationFrame(frame);
      frame = 0;
      if (canDraw()) scheduleDraw();
    });
    observer.observe(canvas);

    const handlePointerMove = (event: PointerEvent) => {
      const bounds = canvas.getBoundingClientRect();
      pointer = { x: event.clientX - bounds.left, y: event.clientY - bounds.top };
      scheduleDraw();
    };
    const clearPointer = () => {
      pointer = null;
      scheduleDraw();
    };
    const handleVisibilityChange = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      if (canDraw()) scheduleDraw();
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    canvas.addEventListener('pointermove', handlePointerMove);
    canvas.addEventListener('pointerleave', clearPointer);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    resize();
    if (canDraw()) scheduleDraw();

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      resizeObserver.disconnect();
      canvas.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('pointerleave', clearPointer);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-auto absolute inset-0 h-full w-full opacity-80"
    />
  );
};
