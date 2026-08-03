import fs from "fs";
import path from "path";
import { ensureSchema, query } from "./db";

const DATA_PATH = path.join(process.cwd(), "data", "content.json");
const CONTENT_KEY = "central-laundry-content";

export interface SiteContent {
  settings: {
    waLink: string;
    waNumber: string;
    instagramUrl: string;
    email: string;
    address: string;
    mapLink: string;
    mapEmbedUrl: string;
    operationalHours: { weekdays: string; weekend: string };
  };
  paket: PaketItem[];
  kiloan: KiloanItem[];
  footer: FooterData;
  gallery: GalleryItem[];
  admin: AdminData;
}

export interface PaketItem {
  id: string;
  name: string;
  features: string[];
  isPopular: boolean;
}

export interface KiloanItem {
  id: string;
  name: string;
  description: string;
  features: string[];
  iconType: string;
  isPopular: boolean;
}

export interface FooterData {
  brandName: string;
  description: string;
  menuItems: { label: string; href: string }[];
  copyright: string;
}

export interface GalleryItem {
  id: number;
  src: string;
  alt: string;
  category: string;
  type: string;
  /** Poster frame for video entries. */
  poster?: string;
  /** ImageKit fileId, present for images uploaded through the admin panel. */
  fileId?: string;
}

export interface AdminData {
  password: string;
  resetCode: string | null;
  resetExpiry: number | null;
}

/** Seed data shipped with the repo, used only on an empty database. */
function readSeedFile(): SiteContent {
  const raw = fs.readFileSync(DATA_PATH, "utf-8");
  return JSON.parse(raw);
}

/**
 * Reads the site content from Postgres. On first run the table is empty, so we
 * seed it from data/content.json and return that.
 */
export async function getContent(): Promise<SiteContent> {
  await ensureSchema();

  const { rows } = await query<{ data: SiteContent }>(
    "SELECT data FROM site_content WHERE key = $1",
    [CONTENT_KEY]
  );

  if (rows.length > 0 && rows[0].data) return rows[0].data;

  const seed = readSeedFile();
  await saveContent(seed);
  return seed;
}

/** Persists the full site content document to Postgres. */
export async function saveContent(content: SiteContent): Promise<void> {
  await ensureSchema();
  await query(
    `INSERT INTO site_content (key, data, updated_at)
     VALUES ($1, $2::jsonb, now())
     ON CONFLICT (key)
     DO UPDATE SET data = EXCLUDED.data, updated_at = now()`,
    [CONTENT_KEY, JSON.stringify(content)]
  );
}
