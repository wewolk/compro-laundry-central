import SharedFooter from "@/components/SharedFooter";

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
