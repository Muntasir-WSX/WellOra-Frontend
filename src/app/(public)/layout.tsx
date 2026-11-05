import type { ReactNode } from "react";

import Footer from "@/components/shared/footer/footer";
import Navbar from "@/components/shared/nav/navbar";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
