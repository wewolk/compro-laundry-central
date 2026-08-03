"use client";

import Image from "next/image";

/**
 * Static map: a plain tile mosaic from OpenStreetMap plus a marker, wrapped in
 * a link to Google Maps. No iframe, no API key, no third-party JS — so it can't
 * block paint or track visitors the way an embedded Google map does.
 */

interface StaticMapProps {
  lat: number;
  lng: number;
  /** Google Maps URL opened when the map is clicked. */
  href: string;
  label: string;
  zoom?: number;
  /** Tile grid size; 3x3 covers wide boxes with room to spare after centring. */
  cols?: number;
  rows?: number;
  className?: string;
}

const TILE_SIZE = 256;

/** Slippy-map projection: lon/lat degrees to fractional tile coordinates. */
function toTileCoords(lat: number, lng: number, zoom: number) {
  const n = 2 ** zoom;
  const x = ((lng + 180) / 360) * n;
  const latRad = (lat * Math.PI) / 180;
  const y = ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n;
  return { x, y };
}

export default function StaticMap({
  lat,
  lng,
  href,
  label,
  zoom = 17,
  cols = 3,
  rows = 3,
  className,
}: StaticMapProps) {
  const { x, y } = toTileCoords(lat, lng, zoom);

  const originX = Math.floor(x) - Math.floor(cols / 2);
  const originY = Math.floor(y) - Math.floor(rows / 2);

  // Where the coordinate falls inside the mosaic, in pixels. The canvas is
  // shifted by exactly this much so the point lands at the box centre — which
  // lets the pin sit at a plain 50%/50% instead of tracking the tile grid.
  const offsetX = (x - originX) * TILE_SIZE;
  const offsetY = (y - originY) * TILE_SIZE;

  const tiles = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const tx = originX + col;
      const ty = originY + row;
      tiles.push(
        <Image
          key={`${tx}-${ty}`}
          src={`https://tile.openstreetmap.org/${zoom}/${tx}/${ty}.png`}
          alt=""
          width={TILE_SIZE}
          height={TILE_SIZE}
          unoptimized
          aria-hidden="true"
          style={{
            position: "absolute",
            left: col * TILE_SIZE,
            top: row * TILE_SIZE,
            width: TILE_SIZE,
            height: TILE_SIZE,
          }}
        />
      );
    }
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`static-map${className ? ` ${className}` : ""}`}
      aria-label={`Buka lokasi ${label} di Google Maps`}
    >
      <div
        className="static-map-canvas"
        style={{
          width: cols * TILE_SIZE,
          height: rows * TILE_SIZE,
          transform: `translate(${-offsetX}px, ${-offsetY}px)`,
        }}
      >
        {tiles}
      </div>

      {/* Sits at the box centre because the canvas above is offset to match */}
      <span className="static-map-pin" aria-hidden="true">
        <svg width="34" height="34" viewBox="0 0 24 24" fill="#9e3f05" stroke="white" strokeWidth="1.5">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
          <circle cx="12" cy="9" r="2.5" fill="white" stroke="none" />
        </svg>
      </span>

      <span className="static-map-badge">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
          <line x1="9" y1="3" x2="9" y2="18" />
          <line x1="15" y1="6" x2="15" y2="21" />
        </svg>
        Buka di Google Maps
      </span>

      <span className="static-map-attribution">© OpenStreetMap</span>
    </a>
  );
}
