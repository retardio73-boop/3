"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

export default function ProductGallery({
  name,
  images,
}: {
  name: string;
  images: string[];
}) {
  const safeImages = useMemo(
    () => (images?.length ? images : ["/logo-megacel.png"]),
    [images]
  );
  const [active, setActive] = useState(0);

  // Check if images are external URLs
  const isExternalImage = (url: string) => {
    return url.startsWith('http://') || url.startsWith('https://');
  };

  return (
    <div className="space-y-4">
      {/* Main image */}
      <div className="relative aspect-square overflow-hidden rounded-2xl border border-white/10 bg-zinc-950">
        <Image
          src={safeImages[active]}
          alt={name}
          fill
          className="object-contain p-6"
          unoptimized={isExternalImage(safeImages[active])}
          onError={(e) => {
            // Fallback to logo if image fails
            const target = e.target as HTMLImageElement;
            target.src = "/logo-megacel.png";
          }}
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
        />
      </div>

      {/* Thumbnails */}
      <div className="flex gap-3 overflow-x-auto pb-1">
        {safeImages.map((src, idx) => (
          <button
            key={`${src}-${idx}`}
            onClick={() => setActive(idx)}
            className={[
              "relative h-20 w-20 flex-none overflow-hidden rounded-xl border bg-zinc-950",
              idx === active
                ? "border-white/30"
                : "border-white/10 hover:border-white/20",
            ].join(" ")}
            aria-label={`Show image ${idx + 1}`}
          >
            <Image
              src={src}
              alt={`${name} thumbnail ${idx + 1}`}
              fill
              className="object-contain p-2"
              unoptimized={isExternalImage(src)}
              onError={(e) => {
                // Fallback to logo if thumbnail fails
                const target = e.target as HTMLImageElement;
                target.src = "/logo-megacel.png";
              }}
              sizes="80px"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
