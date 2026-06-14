import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function WargaLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`min-h-screen bg-gray-100 flex justify-center ${inter.className}`}>
      {/* Container ini akan mensimulasikan layar HP (max-width: 480px) pada desktop */}
      <div className="w-full max-w-md bg-white min-h-screen shadow-2xl relative overflow-x-hidden flex flex-col">
        {children}
      </div>
    </div>
  );
}
