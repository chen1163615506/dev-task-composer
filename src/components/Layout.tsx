import { useEffect } from "react";
import { SidebarProvider, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Menu } from "lucide-react";
import { useLocation } from "react-router-dom";

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { setOpen, isMobile } = useSidebar();
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  useEffect(() => {
    if (isMobile) return;
    if (isHomePage) {
      setOpen(true);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (e.clientX <= 10) {
        setOpen(true);
      } else if (e.clientX > 280) {
        setOpen(false);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [setOpen, isMobile, isHomePage]);

  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <div className="flex-1 flex flex-col">
        <header className="h-14 border-b bg-card flex items-center px-4 sticky top-0 z-10">
          <SidebarTrigger className="mr-4">
            <Menu className="h-5 w-5" />
          </SidebarTrigger>
          <h1 className="text-lg font-semibold">AI 研发平台</h1>
        </header>
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <LayoutContent>{children}</LayoutContent>
    </SidebarProvider>
  );
}


