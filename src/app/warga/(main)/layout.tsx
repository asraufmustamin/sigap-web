import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

import WargaTopNav from "@/components/WargaTopNav";

export default function WargaLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`min-h-screen bg-[#f0f4f9] flex flex-col ${inter.className}`}>
      <WargaTopNav />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
