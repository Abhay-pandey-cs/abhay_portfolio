'use client';

import React, { useState, useRef, useEffect } from 'react';

interface ProfilePhotoProps {
  src?: string;
  alt: string;
  size?: number;
  initials?: string;
  className?: string;
}

// Extracts an average color from the image and uses it as a tinted glow.
export const ProfilePhoto: React.FC<ProfilePhotoProps> = ({
  src,
  alt,
  size = 96,
  initials = 'AP',
  className = '',
}) => {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [glow, setGlow] = useState<string>('rgba(88,101,242,0.5)');

  useEffect(() => {
    if (!src) return;
    const img = imgRef.current;
    if (!img) return;

    const compute = () => {
      try {
        const canvas = document.createElement('canvas');
        const w = (canvas.width = 24);
        const h = (canvas.height = 24);
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(img, 0, 0, w, h);
        const data = ctx.getImageData(0, 0, w, h).data;
        let r = 0, g = 0, b = 0, count = 0;
        for (let i = 0; i < data.length; i += 4) {
          // skip near-transparent / very dark pixels
          if (data[i + 3] < 128) continue;
          r += data[i]; g += data[i + 1]; b += data[i + 2]; count++;
        }
        if (count > 0) {
          r = Math.round(r / count);
          g = Math.round(g / count);
          b = Math.round(b / count);
          setGlow(`rgba(${r}, ${g}, ${b}, 0.55)`);
        }
      } catch {
        // cross-origin canvas may throw; keep default glow
      }
    };

    if (img.complete) compute();
    else img.onload = compute;
  }, [src]);

  const base = 'relative rounded-full shrink-0 overflow-hidden bg-[#23252b] flex items-center justify-center';
  const glowStyle = {
    boxShadow: `0 0 22px 2px ${glow}`,
    borderColor: glow,
  } as React.CSSProperties;

  return (
    <div
      className={`${base} ${className}`}
      style={{ width: size, height: size, ...glowStyle, border: `2px solid ${glow}` }}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          crossOrigin="anonymous"
        />
      ) : (
        <span
          className="font-bold text-white select-none"
          style={{ fontSize: size * 0.36 }}
        >
          {initials}
        </span>
      )}
    </div>
  );
};
