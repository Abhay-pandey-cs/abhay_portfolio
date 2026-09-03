'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Upload, Link as LinkIcon, Trash2, ZoomIn, ZoomOut, Crop } from 'lucide-react';

interface ImageUploadProps {
  label?: string;
  value?: string;
  onChange: (url: string) => void;
  placeholder?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  label = 'Image',
  value = '',
  onChange,
  placeholder = 'https://... or upload file',
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [zoom, setZoom] = useState(1);
  const [showControls, setShowControls] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onChange(reader.result);
        setZoom(1);
        setPosition({ x: 0, y: 0 });
      }
    };
    reader.readAsDataURL(file);
  };

  // Auto-show controls when an image is set
  useEffect(() => {
    setShowControls(!!value);
  }, [value]);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.1, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.5));
  const handleZoomReset = () => setZoom(1);

  const handleCrop = () => {
    if (!canvasRef.current || !imgRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas to image natural dimensions
    canvas.width = imgRef.current.naturalWidth;
    canvas.height = imgRef.current.naturalHeight;

    // Clear and draw
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(imgRef.current, 0, 0, canvas.width, canvas.height);

    // Get cropped data URL
    const croppedDataUrl = canvas.toDataURL('image/png');
    onChange(croppedDataUrl);
    setShowControls(false);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="space-y-1.5">
      <label className="text-gray-400">{label}</label>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <LinkIcon className="w-3.5 h-3.5 text-gray-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className="w-full pl-8 pr-3 py-2 rounded bg-[#141518] border border-[#2e3038] text-white text-xs"
            />
          </div>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="px-3 py-2 rounded bg-[#25272e] hover:bg-[#2e313b] text-gray-200 border border-[#383a42] text-xs flex items-center gap-1.5"
            title="Upload image"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload</span>
          </button>
          {value && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="px-2 py-2 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20"
              title="Remove image"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        {value && (
          <div className="space-y-2">
            {/* Preview with zoom and pan */}
            <div
              className="relative h-40 w-full rounded border border-[#2e3038] bg-black/20 overflow-hidden flex items-center justify-center cursor-move"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <img
                ref={imgRef}
                src={value}
                alt="Preview"
                className="max-w-full max-h-full object-contain pointer-events-none"
                style={{
                  transform: `scale(${zoom}) translate(${position.x}px, ${position.y}px)`,
                  transformOrigin: 'center',
                  transition: isDragging ? 'none' : 'transform 0.1s ease',
                }}
              />
            </div>

            {/* Hidden canvas for cropping */}
            <canvas ref={canvasRef} className="hidden" />

            {/* Edit Controls */}
            {showControls && (
              <div className="flex items-center justify-between p-2 bg-[#141518] rounded border border-[#2e3038]">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleZoomOut}
                    className="p-1.5 rounded bg-[#25272e] hover:bg-[#2e313b] text-gray-200 border border-[#383a42]"
                    title="Zoom out"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-mono text-gray-400 min-w-[50px] text-center">
                    {Math.round(zoom * 100)}%
                  </span>
                  <button
                    type="button"
                    onClick={handleZoomIn}
                    className="p-1.5 rounded bg-[#25272e] hover:bg-[#2e313b] text-gray-200 border border-[#383a42]"
                    title="Zoom in"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleZoomReset}
                    className="px-2 py-1.5 rounded bg-[#25272e] hover:bg-[#2e313b] text-gray-200 text-xs font-mono border border-[#383a42]"
                    title="Reset zoom"
                  >
                    Reset
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-gray-400">Drag to position</span>
                  <button
                    type="button"
                    onClick={handleCrop}
                    className="px-3 py-1.5 rounded bg-[#5865f2] hover:bg-[#4752c4] text-white text-xs font-mono font-bold flex items-center gap-1.5"
                    title="Apply crop"
                  >
                    <Crop className="w-3.5 h-3.5" />
                    <span>Apply Crop</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
