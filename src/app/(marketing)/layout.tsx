import type { Metadata } from "next";
import SharedFooter from "@/components/SharedFooter";

export const metadata: Metadata = {
  title: {
    default: "Laundry Purbalingga | Central Laundry Express",
    template: "%s | Central Laundry Express",
  },
  description:
    "Laundry express Purbalingga dengan layanan antar jemput, cuci kiloan, cuci setrika, dan perawatan pakaian higienis untuk rumah, kos, dan bisnis.",
  keywords: [
    "laundry Purbalingga",
    "laundry express Purbalingga",
    "jasa laundry purbalingga",
    "laundry kiloan Purbalingga",
    "antar jemput laundry Purbalingga",
    "cuci setrika Purbalingga",
  ],
  openGraph: {
    title: "Laundry Purbalingga | Central Laundry Express",
    description:
      "Laundry express Purbalingga yang praktis, higienis, dan cepat dengan opsi antar jemput.",
    type: "website",
    locale: "id_ID",
    siteName: "Central Laundry Express",
  },
  twitter: {
    card: "summary_large_image",
    title: "Laundry Purbalingga | Central Laundry Express",
    description:
      "Laundry express Purbalingga yang praktis, higienis, dan cepat dengan opsi antar jemput.",
  },
  publisher: "Central Laundry Express",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "t6N-KEJM3FuVeMJ5YRjR_FqJon7tJx5p9xXkAbbOh-I",
  },
};

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {children}
      <SharedFooter />
    </>
  );
}
