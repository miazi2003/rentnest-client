"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useMemo } from "react";
import { useAuth } from "@/app/features/auth/hooks/use-auth";
import { logoutAction } from "@/app/features/auth/actions/logoutAction";
import { toast } from "sonner";
import {
  LayoutDashboard,
  Building2,
  ClipboardList,
  Star,
  Shield,
  User,
  LogOut,
  Sparkles,
  User2,
  Receipt,
  ListSortDescending,
  Plus,
} from "lucide-react";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
} from "@/components/ui/sidebar";

type NavItem = {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
};

const tenantNavItems: NavItem[] = [
  {
    title: "Dashboard Overview",
    href: "/dashboard/tenant",
    icon: LayoutDashboard,
  },
  {
    title: "Rental Requests",
    href: "/dashboard/tenant/requests",
    icon: ClipboardList,
  },
  {
    title: "Payment History",
    href: "/dashboard/tenant/payments",
    icon: Receipt,
  },
  {
    title: "My Reviews",
    href: "/dashboard/tenant/reviews",
    icon: Star,
  },
];

const landlordNavItems: NavItem[] = [
  {
    title: "Dashboard Overview",
    href: "/dashboard/landlord",
    icon: LayoutDashboard,
  },
  {
    title: "My Properties",
    href: "/dashboard/landlord/properties",
    icon: Building2,
  },
  {
    title: "Rental Requests",
    href: "/dashboard/landlord/requests",
    icon: ClipboardList,
  },
  {
    title: "Add Property",
    href: "/landlord/properties/new",
    icon: Plus,
  },
];

const adminNavItems: NavItem[] = [
  {
    title: "Dashboard Overview",
    href: "/dashboard/admin",
    icon: Shield,
  },
  {
    title: "User Management",
    href: "/dashboard/admin/users",
    icon: User2,
  },
  {
    title: "All Properties",
    href: "/dashboard/admin/properties",
    icon: Building2,
  },
  {
    title: "Rental Requests",
    href: "/dashboard/admin/rentals",
    icon: Receipt,
  },
  {
    title: "Categories",
    href: "/dashboard/admin/categories",
    icon: ListSortDescending,
  },
];

const accountNavItems: NavItem[] = [
  {
    title: "Profile",
    href: "/dashboard/profile",
    icon: User,
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, setUser } = useAuth();

  const currentRole = useMemo(() => {
    if (user?.role) return user.role;
    if (pathname?.startsWith("/dashboard/landlord")) return "LANDLORD";
    if (pathname?.startsWith("/dashboard/admin")) return "ADMIN";
    return "TENANT";
  }, [user?.role, pathname]);

  const navItems = useMemo(() => {
    switch (currentRole) {
      case "LANDLORD":
        return landlordNavItems;
      case "ADMIN":
        return adminNavItems;
      case "TENANT":
      default:
        return tenantNavItems;
    }
  }, [currentRole]);

  const portalInfo = useMemo(() => {
    switch (currentRole) {
      case "LANDLORD":
        return {
          title: "Landlord Portal",
          href: "/",
          badgeColor: "text-purple-500 fill-purple-500",
        };
      case "ADMIN":
        return {
          title: "Admin Portal",
          href: "/",
          badgeColor: "text-amber-500 fill-amber-500",
        };
      case "TENANT":
      default:
        return {
          title: "Tenant Portal",
          href: "/",
          badgeColor: "text-emerald-500 fill-emerald-500",
        };
    }
  }, [currentRole]);

  const handleLogout = async () => {
    try {
      const res = await logoutAction();
      if (res.success) {
        setUser(null);
        toast.success("Logged out successfully");
        router.push("/login");
        router.refresh();
      } else {
        toast.error("Logout failed");
      }
    } catch {
      toast.error("Error logging out");
    }
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-gray-200 dark:border-white/10 shadow-sm">

      <SidebarHeader className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 dark:border-white/10 px-4 group-data-[collapsible=icon]:px-2">
        <Link
          href={portalInfo.href}
          className="flex items-center gap-3 w-full group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0"
        >
          <Image
            src="/favicon.ico"
            alt="RentNest Logo"
            width={36}
            height={36}
            className="h-9 w-9 shrink-0 rounded-lg object-contain transition-transform group-hover:scale-105"
          />
          <div className="flex flex-col gap-0.5 overflow-hidden group-data-[collapsible=icon]:hidden">
            <span className="font-bold text-base tracking-tight leading-none text-sidebar-foreground">
              RentNest
            </span>
            <span className="text-[11px] font-medium text-muted-foreground leading-none flex items-center gap-1">
              <Sparkles className={`h-3 w-3 ${portalInfo.badgeColor}`} />
              {portalInfo.title}
            </span>
          </div>
        </Link>
      </SidebarHeader>


      <SidebarContent className="px-2 py-3 gap-4 group-data-[collapsible=icon]:px-0">

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70 px-2 mb-1">
            Overview
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/dashboard/tenant" &&
                    item.href !== "/dashboard/landlord" &&
                    item.href !== "/dashboard/admin" &&
                    pathname?.startsWith(item.href));

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      isActive={isActive}
                      tooltip={item.title}
                      className={`w-full justify-start gap-3 transition-colors group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:size-11 ${
                        isActive
                          ? "bg-primary text-primary-foreground font-medium hover:bg-primary/90 hover:text-primary-foreground"
                          : "hover:bg-accent hover:text-accent-foreground"
                      }`}
                    >
                      <Link
                        href={item.href}
                        className="flex items-center justify-start gap-3 w-full h-full group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0"
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>


        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70 px-2 mb-1">
            Management
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {accountNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      isActive={isActive}
                      tooltip={item.title}
                      className={`w-full justify-start gap-3 transition-colors group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:size-11 ${
                        isActive
                          ? "bg-primary text-primary-foreground font-medium hover:bg-primary/90 hover:text-primary-foreground"
                          : "hover:bg-accent hover:text-accent-foreground"
                      }`}
                    >
                      <Link
                        href={item.href}
                        className="flex items-center justify-start gap-3 w-full h-full group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0"
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>


      <SidebarFooter className="p-2 border-t border-border group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:py-2 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
        <SidebarMenu className="group-data-[collapsible=icon]:items-center space-y-1">
          <SidebarMenuItem className="flex items-center justify-between px-2 py-1 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
            <span className="text-xs font-semibold text-muted-foreground group-data-[collapsible=icon]:hidden">
              Theme
            </span>
            <ThemeToggle variant="ghost" />
          </SidebarMenuItem>
          <SidebarMenuItem className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
            <SidebarMenuButton
              tooltip="Logout"
              onClick={handleLogout}
              className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10 transition-colors group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:size-11 cursor-pointer"
            >
              <div className="flex items-center justify-start gap-3 w-full h-full group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0">
                <LogOut className="h-4 w-4 shrink-0" />
                <span className="group-data-[collapsible=icon]:hidden">Logout</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
