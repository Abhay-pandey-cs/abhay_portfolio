'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Crop, Link as LinkIcon, RotateCcw, Trash2, Upload } from 'lucide-react';

interface ImageUploadProps {
  label?: string;
  value?: string;
  onChange: (url: string) => void;
  placeholder?: string;
  aspectRatio?: number;
  outputWidth?: number;
}

interface Position {
  x: number;
  y: number;
}

interface ImageDimensions {
  width: number;
  height: number;
}

interface PointerDrag {
  pointerId: number;
  clientX: number;
  clientY: number;
  position: Position;
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export const ImageUpload: React.FC<ImageUploadProps> = ({
  label = 'Image',
  value = '',
  onChange,
  placeholder = 'https://... or upload file',
  aspectRatio = 1,
  outputWidth = 720,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const previewRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const objectUrlRef = useRef<string | null>(null);
  const pointerDragRef = useRef<PointerDrag | null>(null);
  const [source, setSource] = useState(value);
  const [imageDimensions, setImageDimensions] = useState<ImageDimensions | null>(null);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [isCropping, setIsCropping] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const safeAspectRatio = Number.isFinite(aspectRatio) && aspectRatio > 0 ? aspectRatio : 1;
  const canCrop = source.startsWith('blob:') || source.startsWith('data:');

  useEffect(() => {
    setSource(value);
    setImageDimensions(null);
    setZoom(1);
    setPosition({ x: 0, y: 0 });
    setIsCropping(false);
    setError('');
  }, [value]);

  useEffect(
    () => () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    },
    [],
  );

  const constrainedPosition = (next: Position, nextZoom = zoom): Position => {
    const preview = previewRef.current;
    const image = imageRef.current;
    if (!preview || !image?.naturalWidth || !image.naturalHeight) return next;

    const { width, height } = preview.getBoundingClientRect();
    const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight) * nextZoom;
    const maxX = Math.max(0, (image.naturalWidth * scale - width) / 2);
    const maxY = Math.max(0, (image.naturalHeight * scale - height) / 2);

    return {
      x: clamp(next.x, -maxX, maxX),
      y: clamp(next.y, -maxY, maxY),
    };
  };

  const releaseObjectUrl = () => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
  };

  const handleFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Choose an image file to continue.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('Choose an image smaller than 10 MB.');
      return;
    }

    releaseObjectUrl();
    const objectUrl = URL.createObjectURL(file);
    objectUrlRef.current = objectUrl;
    setSource(objectUrl);
    setImageDimensions(null);
    setZoom(1);
    setPosition({ x: 0, y: 0 });
    setIsCropping(true);
    setError('');
  };

  const handleZoomChange = (nextZoom: number) => {
    const boundedZoom = clamp(nextZoom, 1, 4);
    setZoom(boundedZoom);
    setPosition((current) => constrainedPosition(current, boundedZoom));
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isCropping) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    pointerDragRef.current = {
      pointerId: event.pointerId,
      clientX: event.clientX,
      clientY: event.clientY,
      position,
    };
    setIsDragging(true);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = pointerDragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    setPosition(
      constrainedPosition({
        x: drag.position.x + event.clientX - drag.clientX,
        y: drag.position.y + event.clientY - drag.clientY,
      }),
    );
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (pointerDragRef.current?.pointerId !== event.pointerId) return;
    pointerDragRef.current = null;
    setIsDragging(false);
  };

  const previewBounds = previewRef.current?.getBoundingClientRect();
  const previewScale = imageDimensions && previewBounds
    ? Math.max(previewBounds.width / imageDimensions.width, previewBounds.height / imageDimensions.height) * zoom
    : zoom;

  const handleCrop = () => {
    const image = imageRef.current;
    const preview = previewRef.current;
    if (!image?.naturalWidth || !image.naturalHeight || !preview) {
      setError('Wait for the image preview to finish loading, then try again.');
      return;
    }

    const { width, height } = preview.getBoundingClientRect();
    const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight) * zoom;
    const sourceWidth = width / scale;
    const sourceHeight = height / scale;
    const cropX = clamp(
      (image.naturalWidth - sourceWidth) / 2 - position.x / scale,
      0,
      image.naturalWidth - sourceWidth,
    );
    const cropY = clamp(
      (image.naturalHeight - sourceHeight) / 2 - position.y / scale,
      0,
      image.naturalHeight - sourceHeight,
    );
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(outputWidth);
    canvas.height = Math.round(outputWidth / safeAspectRatio);

    try {
      const context = canvas.getContext('2d');
      if (!context) throw new Error('Image crop is unavailable in this browser.');

      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = 'high';
      context.drawImage(
        image,
        cropX,
        cropY,
        sourceWidth,
        sourceHeight,
        0,
        0,
        canvas.width,
        canvas.height,
      );

      const croppedImage = canvas.toDataURL('image/webp', 0.9);
      onChange(croppedImage);
      releaseObjectUrl();
      setSource(croppedImage);
      setIsCropping(false);
      setError('');
    } catch (cropError) {
      console.error('Image crop failed:', cropError);
      setError(cropError instanceof Error ? cropError.message : 'Could not crop this image. Upload the image file and try again.');
    }
  };

  const handleCancelCrop = () => {
    releaseObjectUrl();
    setSource(value);
    setZoom(1);
    setPosition({ x: 0, y: 0 });
    setIsCropping(false);
    setError('');
  };

  const handleRemove = () => {
    releaseObjectUrl();
    setSource('');
    setZoom(1);
    setPosition({ x: 0, y: 0 });
    setIsCropping(false);
    setError('');
    onChange('');
  };

  return (
    <div className="space-y-3">
      <label className="block text-xs font-medium text-gray-300">{label}</label>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative min-w-0 flex-1">
            <LinkIcon className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-500" />
            <input
              type="url"
              value={value}
              onChange={(event) => {
                releaseObjectUrl();
                setError('');
                onChange(event.target.value);
              }}
              placeholder={placeholder}
              className="w-full rounded-lg border border-[#343843] bg-[#111216] py-2.5 pl-8 pr-3 text-xs text-white outline-none transition-colors focus:border-[#38bdf8]"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#3b4350] bg-[#252932] px-3 py-2 text-xs text-gray-100 transition-colors hover:border-[#38bdf8] hover:bg-[#2b303a]"
            >
              <Upload className="h-3.5 w-3.5" />
              Upload & crop
            </button>
            {value && (
              <button
                type="button"
                onClick={handleRemove}
                className="inline-flex items-center justify-center rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-red-300 transition-colors hover:bg-red-500/20"
                aria-label={`Remove ${label.toLowerCase()}`}
                title="Remove image"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />

        {source && (
          <div className="grid gap-4 rounded-xl border border-[#2e3038] bg-[#131419] p-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
            <div className="min-w-0 space-y-2">
              <div
                ref={previewRef}
                className={`relative mx-auto w-full max-w-[360px] overflow-hidden rounded-lg border border-[#39404b] bg-[#0b0c0f] ${
                  isCropping ? 'cursor-grab touch-none' : ''
                } ${isDragging ? 'cursor-grabbing' : ''}`}
                style={{ aspectRatio: String(safeAspectRatio) }}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  ref={imageRef}
                  src={source}
                  alt={`${label} preview`}
                  onLoad={(event) => {
                    setImageDimensions({
                      width: event.currentTarget.naturalWidth,
                      height: event.currentTarget.naturalHeight,
                    });
                    setError('');
                  }}
                  onError={() => setError('This image could not be loaded. Check its URL or upload the file instead.')}
                  draggable={false}
                  className="absolute left-1/2 top-1/2 max-h-none max-w-none select-none"
                  style={{
                    width: imageDimensions ? imageDimensions.width * previewScale : '100%',
                    height: imageDimensions ? imageDimensions.height * previewScale : '100%',
                    transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))`,
                    transition: isDragging ? 'none' : 'width 120ms ease-out, height 120ms ease-out',
                  }}
                />
                {isCropping && safeAspectRatio === 1 && (
                  <div className="pointer-events-none absolute inset-[8%] rounded-full border border-white/50 shadow-[0_0_0_999px_rgba(0,0,0,0.12)]" />
                )}
              </div>
              <p className="text-center text-[10px] text-gray-500">
                {isCropping ? 'Drag to position the image inside the crop frame.' : 'Preview uses the final image framing.'}
              </p>
            </div>

            {isCropping ? (
              <div className="flex flex-col gap-3 sm:min-w-[180px]">
                <label className="space-y-2 text-[10px] text-gray-400">
                  <span className="flex items-center justify-between font-mono">
                    <span>ZOOM</span>
                    <span>{Math.round(zoom * 100)}%</span>
                  </span>
                  <input
                    type="range"
                    min="1"
                    max="4"
                    step="0.01"
                    value={zoom}
                    onChange={(event) => handleZoomChange(Number(event.target.value))}
                    className="w-full accent-[#38bdf8]"
                    aria-label="Crop zoom"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setZoom(1);
                    setPosition({ x: 0, y: 0 });
                  }}
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#343843] px-3 py-2 text-xs text-gray-300 transition-colors hover:bg-[#252932]"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Reset framing
                </button>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleCancelCrop}
                    className="flex-1 rounded-lg border border-[#343843] px-3 py-2 text-xs text-gray-300 transition-colors hover:bg-[#252932]"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleCrop}
                    disabled={!canCrop}
                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#5865f2] px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#4752c4] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Crop className="h-3.5 w-3.5" />
                    Apply
                  </button>
                </div>
                {!canCrop && (
                  <p className="text-[10px] text-amber-300">
                    Upload the image file to crop it. External image URLs may block browser cropping.
                  </p>
                )}
              </div>
            ) : canCrop ? (
              <button
                type="button"
                onClick={() => {
                  setIsCropping(true);
                  setError('');
                }}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#3b4350] px-3 py-2 text-xs text-gray-200 transition-colors hover:border-[#38bdf8]"
              >
                <Crop className="h-3.5 w-3.5" />
                Adjust crop
              </button>
            ) : (
              <p className="max-w-[200px] text-[10px] text-gray-500">
                To adjust framing, upload the image file so the browser can crop it safely.
              </p>
            )}
          </div>
        )}

        {error && <p role="alert" className="text-xs text-red-300">{error}</p>}
      </div>
    </div>
  );
};
