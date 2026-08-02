import fs from "fs";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "data", "content.json");
const KV_KEY = "central-laundry-content";

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
}

export interface AdminData {
  password: string;
  resetCode: string | null;
  resetExpiry: number | null;
}

// Check if Vercel KV is available
function hasKV(): boolean {
  return !!process.env.KV_REST_API_URL;
}

// Read from local JSON file (works in dev and for initial seed)
function readLocalFile(): SiteContent {
  const raw = fs.readFileSync(DATA_PATH, "utf-8");
  return JSON.parse(raw);
}

// Write to local JSON file (dev only)
function writeLocalFile(content: SiteContent): void {
  fs.writeFileSync(DATA_PATH, JSON.stringify(content, null, 2), "utf-8");
}

// Get content: KV in production, local file in development
export async function getContent(): Promise<SiteContent> {
  if (hasKV()) {
    try {
      const { kv } = await import("@vercel/kv");
      const data = await kv.get<SiteContent>(KV_KEY);
      if (data) return data;
      // First run: seed KV from local file
      const localData = readLocalFile();
      await kv.set(KV_KEY, localData);
      return localData;
    } catch {
      return readLocalFile();
    }
  }
  return readLocalFile();
}

// Save content: KV in production, local file in development
export async function saveContent(content: SiteContent): Promise<void> {
  if (hasKV()) {
    try {
      const { kv } = await import("@vercel/kv");
      await kv.set(KV_KEY, content);
    } catch (e) {
      console.error("Failed to save to KV:", e);
    }
  }
  // Always save locally in development
  if (!process.env.VERCEL) {
    writeLocalFile(content);
  }
}
