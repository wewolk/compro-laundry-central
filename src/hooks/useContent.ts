"use client";

import { useState, useEffect } from "react";

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
  paket: { id: string; name: string; features: string[]; isPopular: boolean }[];
  kiloan: { id: string; name: string; description: string; features: string[]; iconType: string; isPopular: boolean }[];
  footer: {
    brandName: string;
    description: string;
    menuItems: { label: string; href: string }[];
    copyright: string;
  };
  gallery: { id: number; src: string; alt: string; category: string; type: string; poster?: string }[];
}

let cachedContent: SiteContent | null = null;

export function useSiteContent() {
  const [content, setContent] = useState<SiteContent | null>(cachedContent);
  const [loading, setLoading] = useState(!cachedContent);

  useEffect(() => {
    if (cachedContent) return;
    fetch("/api/content")
      .then((res) => res.json())
      .then((data) => {
        cachedContent = data;
        setContent(data);
      })
      .catch(() => console.error("Failed to load content"))
      .finally(() => setLoading(false));
  }, []);

  return { content, loading };
}
