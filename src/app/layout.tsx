import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import SharedFooter from "@/components/SharedFooter";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Central Laundry Express - Cucian Bersih, Hidup Lebih Praktis!",
  description: "Nikmati layanan laundry profesional dengan standar higienis tinggi. Kami menjemput pakaian kotor Anda dan mengembalikannya dalam keadaan bersih, harum, dan rapi.",
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
        <SharedFooter />
      </body>
    </html>
  );
}
