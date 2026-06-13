import Sidebar from "@/components/Sidebar";
import TopAppBar from "@/components/TopAppBar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-full flex bg-background overflow-hidden relative">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-0 md:ml-64 h-screen bg-background">
        <TopAppBar />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

