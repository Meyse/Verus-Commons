/**
 * ScreenshotGallery component
 * 
 * Auto-detects image aspect ratios and displays accordingly:
 * - Landscape images: horizontal scroll layout with object-contain (shows full image)
 * - Portrait/mobile images: horizontal scroll with max-height constraint (shows full image)
 * - Mixed: adapts based on majority
 * - Single image: centered with max-width
 * 
 * Includes lightbox for full-size viewing
 * 
 * Updated: 
 * - Uses unified image path structure at /images/projects/{slug}/
 * - Uses build-time dimension extraction when available (eliminates double-loading)
 * - Optimized sizes prop for each layout to serve appropriately sized images
 * - Changed to object-contain for both layouts to show complete images without cropping
 * - Portrait images use horizontal scroll with 400px max-height for better page balance
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

interface ImageData {
  src: string;
  width: number;
  height: number;
  isLandscape: boolean;
}

/** Pre-extracted dimensions from build-time script */
interface PreloadedImageData {
  filename: string;
  src: string;
  width: number;
  height: number;
  isLandscape: boolean;
}

interface ScreenshotGalleryProps {
  screenshots: string[];
  projectSlug: string;
  /** Pre-extracted dimensions from server (null triggers client-side fallback) */
  preloadedDimensions?: PreloadedImageData[] | null;
}

export function ScreenshotGallery({ 
  screenshots, 
  projectSlug,
  preloadedDimensions 
}: ScreenshotGalleryProps) {
  // Use preloaded dimensions if available (server-rendered, no loading state)
  const hasPreloadedDimensions = preloadedDimensions && preloadedDimensions.length > 0;
  
  const [images, setImages] = useState<ImageData[]>(
    hasPreloadedDimensions ? preloadedDimensions : []
  );
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(!hasPreloadedDimensions);

  // Client-side dimension detection (fallback for development or missing dimensions)
  useEffect(() => {
    // Skip if we have preloaded dimensions
    if (hasPreloadedDimensions) return;
    if (screenshots.length === 0) return;

    const loadImages = async () => {
      const imagePromises = screenshots.map((filename) => {
        return new Promise<ImageData>((resolve) => {
          const img = new window.Image();
          const src = `/images/projects/${projectSlug}/${filename}`;
          img.onload = () => {
            resolve({
              src,
              width: img.naturalWidth,
              height: img.naturalHeight,
              isLandscape: img.naturalWidth > img.naturalHeight,
            });
          };
          img.onerror = () => {
            // Fallback for failed loads
            resolve({
              src,
              width: 16,
              height: 9,
              isLandscape: true,
            });
          };
          img.src = src;
        });
      });

      const loadedImages = await Promise.all(imagePromises);
      setImages(loadedImages);
      setLoading(false);
    };

    loadImages();
  }, [screenshots, projectSlug, hasPreloadedDimensions]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxIndex(null);
      } else if (e.key === 'ArrowRight' && lightboxIndex < images.length - 1) {
        setLightboxIndex(lightboxIndex + 1);
      } else if (e.key === 'ArrowLeft' && lightboxIndex > 0) {
        setLightboxIndex(lightboxIndex - 1);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [lightboxIndex, images.length]);

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  if (screenshots.length === 0) return null;
  if (loading) {
    return (
      <div className="mb-8">
        <h2 className="text-sm font-medium text-[var(--color-text-muted)] uppercase tracking-wide mb-4">
          Screenshots
        </h2>
        <div className="h-48 bg-[var(--color-surface-elevated)] rounded-lg animate-pulse" />
      </div>
    );
  }

  // Determine layout based on images
  const landscapeCount = images.filter((img) => img.isLandscape).length;
  const isLandscapeLayout = landscapeCount > images.length / 2;
  const isSingleImage = images.length === 1;

  return (
    <>
      <div className="mb-8">
        <h2 className="text-sm font-medium text-[var(--color-text-muted)] uppercase tracking-wide mb-4">
          Screenshots
        </h2>

        {isSingleImage ? (
          // Single image: centered
          <div className="flex justify-center">
            <button
              onClick={() => openLightbox(0)}
              className="relative rounded-lg overflow-hidden border border-[var(--color-border)] transition-opacity hover:opacity-90 cursor-zoom-in"
              style={{
                maxWidth: images[0].isLandscape ? '100%' : '300px',
              }}
            >
              <Image
                src={images[0].src}
                alt="Screenshot"
                width={images[0].width}
                height={images[0].height}
                className="w-full h-auto"
                priority
                sizes={images[0].isLandscape 
                  ? "(max-width: 768px) 100vw, 800px" 
                  : "300px"
                }
              />
            </button>
          </div>
        ) : isLandscapeLayout ? (
          // Landscape: horizontal scroll with object-contain to show full images
          <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-thin">
            {images.map((image, index) => (
              <button
                key={image.src}
                onClick={() => openLightbox(index)}
                className="relative flex-shrink-0 rounded-lg overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface-elevated)] transition-opacity hover:opacity-90 cursor-zoom-in"
                style={{
                  height: '280px',
                  width: `${(image.width / image.height) * 280}px`,
                }}
              >
                <Image
                  src={image.src}
                  alt={`Screenshot ${index + 1}`}
                  fill
                  className="object-contain"
                  priority={index === 0}
                  sizes="500px"
                />
              </button>
            ))}
          </div>
        ) : (
          // Portrait/mobile: horizontal scroll with max-height to show full images
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-thin">
            {images.map((image, index) => (
              <button
                key={image.src}
                onClick={() => openLightbox(index)}
                className="relative flex-shrink-0 rounded-lg overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface-elevated)] transition-opacity hover:opacity-90 cursor-zoom-in"
                style={{
                  height: '400px',
                  width: `${(image.width / image.height) * 400}px`,
                }}
              >
                <Image
                  src={image.src}
                  alt={`Screenshot ${index + 1}`}
                  fill
                  className="object-contain"
                  priority={index < 3}
                  sizes="250px"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white/70 hover:text-white text-2xl p-2 z-10"
            aria-label="Close"
          >
            ✕
          </button>

          {/* Navigation arrows */}
          {lightboxIndex > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex(lightboxIndex - 1);
              }}
              className="absolute left-4 text-white/70 hover:text-white text-3xl p-4 z-10"
              aria-label="Previous"
            >
              ‹
            </button>
          )}
          {lightboxIndex < images.length - 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex(lightboxIndex + 1);
              }}
              className="absolute right-4 text-white/70 hover:text-white text-3xl p-4 z-10"
              aria-label="Next"
            >
              ›
            </button>
          )}

          {/* Image */}
          <div
            className="relative max-w-[90vw] max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[lightboxIndex].src}
              alt={`Screenshot ${lightboxIndex + 1}`}
              width={images[lightboxIndex].width}
              height={images[lightboxIndex].height}
              className="max-w-full max-h-[90vh] w-auto h-auto object-contain"
              priority
              sizes="90vw"
            />
          </div>

          {/* Counter */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
              {lightboxIndex + 1} / {images.length}
            </div>
          )}
        </div>
      )}
    </>
  );
}
