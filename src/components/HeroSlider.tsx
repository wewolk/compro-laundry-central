"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

const AUTOPLAY_MS = 5000;
const MAX_SLIDES = 5;

interface HeroSliderProps {
  /** Slide image paths, in order. Duplicates should be removed by the caller. */
  images: string[];
  alt: string;
}

/**
 * Radius of the carousel cylinder: places each face so its edges meet its
 * neighbours. tan(pi/n) is undefined for n < 3, so those fall back to a
 * proportional depth that still reads as a rotation.
 */
function cylinderRadius(width: number, count: number) {
  if (count < 3) return width * 0.62;
  return width / 2 / Math.tan(Math.PI / count);
}

export default function HeroSlider({ images, alt }: HeroSliderProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [width, setWidth] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);

  // Hard cap so an oversized gallery can never blow up the hero
  const slides = images.slice(0, MAX_SLIDES);
  const total = slides.length;
  const hasMultiple = total > 1;

  // The cylinder rotation is absolute, so `index` grows without bound; this
  // maps it back to which face currently points at the viewer.
  const step = 360 / Math.max(total, 1);
  const radius = cylinderRadius(width, total);

  // translateZ needs pixels, so the cylinder radius tracks the stage width
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const observer = new ResizeObserver(([entry]) =>
      setWidth(entry.contentRect.width)
    );
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  const goTo = useCallback(
    // Track absolute rotation so the spin always continues in one direction
    // instead of snapping backwards when wrapping past the last slide.
    (next: number) => setIndex(next),
    []
  );
  const next = useCallback(() => setIndex((i) => i + 1), []);
  const prev = useCallback(() => setIndex((i) => i - 1), []);

  // Autoplay, paused on hover/focus or when the user prefers reduced motion
  useEffect(() => {
    if (!hasMultiple || paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = window.setInterval(() => setIndex((i) => i + 1), AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [hasMultiple, paused]);

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!hasMultiple) return;
    if (event.key === "ArrowRight") {
      event.preventDefault();
      next();
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      prev();
    }
  };

  // Which slide currently faces the viewer, for dots and screen readers
  const facing = ((index % total) + total) % total;

  return (
    <div
      className="hero-slider"
      role="region"
      aria-roledescription="carousel"
      aria-label="Galeri Central Laundry Express"
      tabIndex={hasMultiple ? 0 : -1}
      onKeyDown={onKeyDown}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {/* 3D spinner: faces sit on a cylinder that rotates to the active slide */}
      <div className="hero-slider-stage" ref={stageRef}>
        <div
          className="hero-slider-spinner"
          style={{ transform: `translateZ(${-radius}px) rotateY(${-index * step}deg)` }}
        >
          {slides.map((src, i) => (
            <div
              key={`${src}-${i}`}
              className="hero-slide"
              style={{ transform: `rotateY(${i * step}deg) translateZ(${radius}px)` }}
              aria-hidden={i !== facing}
            >
              <Image
                src={src}
                alt={i === 0 ? alt : `${alt} ${i + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ objectFit: "cover" }}
                priority={i === 0}
              />
            </div>
          ))}
        </div>
      </div>

      {hasMultiple && (
        <>
          <button
            type="button"
            className="hero-slider-arrow hero-slider-prev"
            onClick={prev}
            aria-label="Foto sebelumnya"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            type="button"
            className="hero-slider-arrow hero-slider-next"
            onClick={next}
            aria-label="Foto berikutnya"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

          <div className="hero-slider-dots">
            {slides.map((src, i) => (
              <button
                key={`dot-${src}-${i}`}
                type="button"
                className={`hero-slider-dot${i === facing ? " is-active" : ""}`}
                // Spin forward or back by the shortest arc to the chosen face
                onClick={() => {
                  const delta = ((i - facing + total + total / 2) % total) - Math.floor(total / 2);
                  goTo(index + delta);
                }}
                aria-label={`Ke foto ${i + 1} dari ${total}`}
                aria-current={i === facing}
              />
            ))}
          </div>

          <div className="sr-only" aria-live="polite">
            Foto {facing + 1} dari {total}
          </div>
        </>
      )}
    </div>
  );
}
