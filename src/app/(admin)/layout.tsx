import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Panel - Central Laundry Express",
  description: "Panel administrasi Central Laundry Express.",
  robots: { index: false, follow: false },
};

export default function AdminGroupLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
