import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Bell, Search } from "lucide-react";
import { ThemeToggle } from "@/components/shared/ThemeToggle";

export const dynamic = "force-dynamic";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center justify-between gap-2 border-b border-gray-200 dark:border-white/10 px-3 shadow-xs sm:h-16 sm:px-4">
          <div className="flex min-w-0 items-center gap-2 sm:px-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <h1 className="truncate text-base font-semibold tracking-tight sm:text-lg">Dashboard</h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative hidden sm:block">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                aria-label="Search dashboard"
                type="search"
                placeholder="Search..."
                className="w-48 lg:w-64 rounded-md border border-input bg-background pl-8 pr-3 py-1.5 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <ThemeToggle variant="ghost" />
            <button
              type="button"
              aria-label="Notifications"
              className="relative p-2 rounded-full hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
              title="Notifications"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary" />
            </button>
          </div>
        </header>

        <main className="min-w-0 flex-1 overflow-x-hidden p-3 sm:p-5 lg:p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
