import Footer from "@/components/layout/public/footer";
import Header from "@/components/layout/public/Header";
import { ReactNode } from "react";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer></Footer>
    </div>
  );
}
