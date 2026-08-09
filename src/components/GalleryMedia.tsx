"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

interface GalleryMediaProps {
  src: string;
  alt: string;
  type: string;
  poster?: string;
  sizes?: string;
  /**
   * Render at the media's own aspect ratio instead of cropping to fill the
   * parent box. Used by the beranda gallery so uploads aren't squashed.
   */
  natural?: boolean;
}

const VIDEO_EXTENSIONS = /\.(mp4|webm|mov|m4v)(\?.*)?$/i;

/** Legacy rows can be flagged as video while still pointing at a placeholder image. */
function isPlayableVideo(src: string, type: string): boolean {
  return type === "video" && VIDEO_EXTENSIONS.test(src);
}

/**
 * Renders a gallery entry as either an image or a click-to-play video.
 * Videos stay as a poster frame until the visitor presses play, so a page full
 * of clips doesn't download megabytes on load.
 */
export default function GalleryMedia({
  src,
  alt,
  type,
  poster,
  sizes = "(max-width: 768px) 100vw, 33vw",
  natural = false,
}: GalleryMediaProps) {
  const [playing, setPlaying] = useState(false);
  const [posterFailed, setPosterFailed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (playing) videoRef.current?.play().catch(() => setPlaying(false));
  }, [playing]);

  if (!isPlayableVideo(src, type)) {
    // Natural mode keeps the upload's real aspect ratio. The intrinsic size is
    // unknown at render time (arbitrary admin uploads), so a plain img lets the
    // browser derive height from the decoded file instead of us guessing.
    if (natural) {
      return (
        /* eslint-disable-next-line @next/next/no-img-element --
           Intrinsic dimensions are unknown; next/image needs width+height or fill,
           both of which force an aspect ratio we're deliberately not imposing. */
        <img src={src} alt={alt} className="gallery-natural-img" loading="lazy" />
      );
    }
    return (
      <Image src={src} alt={alt} fill sizes={sizes} style={{ objectFit: "cover" }} />
    );
  }

  // ImageKit generates a poster frame for uploaded videos on demand; if that
  // fails we fall back to the video element's own first frame.
  const posterSrc = poster || `${src}/ik-thumbnail.jpg`;

  if (!playing) {
    return (
      <button
        type="button"
        className="gallery-video-trigger"
        onClick={() => setPlaying(true)}
        aria-label={`Putar video: ${alt}`}
      >
        {posterFailed ? (
          <video
            src={src}
            muted
            playsInline
            preload="metadata"
            className="gallery-video-poster"
            aria-hidden="true"
          />
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element --
             Poster frames are generated per-video by ImageKit at runtime. */
          <img
            src={posterSrc}
            alt={alt}
            className="gallery-video-poster"
            onError={() => setPosterFailed(true)}
          />
        )}
        <span className="gallery-play-overlay" aria-hidden="true">
          <span className="gallery-play-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </span>
        </span>
      </button>
    );
  }

  return (
    <video
      ref={videoRef}
      src={src}
      poster={posterFailed ? undefined : posterSrc}
      controls
      playsInline
      preload="metadata"
      className="gallery-video"
      aria-label={alt}
    />
  );
}
