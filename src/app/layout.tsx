import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Central Laundry Express - Cucian Bersih, Hidup Lebih Praktis!",
  description: "Nikmati layanan laundry profesional dengan standar higienis tinggi. Kami menjemput pakaian kotor Anda dan mengembalikannya dalam keadaan bersih, harum, dan rapi.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/icon.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "Central Laundry Express - Cucian Bersih, Hidup Lebih Praktis!",
    description: "Nikmati layanan laundry profesional dengan standar higienis tinggi.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${outfit.variable}`}>
      <body style={{ paddingBottom: "20px" }}>
        {children}
      </body>
    </html>
  );
}
