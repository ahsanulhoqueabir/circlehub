"use client";

import { usePathname } from "next/navigation";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function LayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathName = usePathname();
  const is_admin_route = pathName.startsWith("/admin");

  if (is_admin_route) {
    // Admin routes - no header/footer
    return <>{children}</>;
  }

  // Regular routes - with header/footer
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
