"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, LayoutDashboard, LogIn, LogOut, User, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/app/features/auth/hooks/use-auth";
import { logoutAction } from "@/app/features/auth/actions/logoutAction";
import { ThemeToggle } from "@/components/shared/ThemeToggle";

interface PublicUserMenuProps {
  overlay: boolean;
}

function getDashboardHref(role?: string) {
  if (role === "ADMIN") return "/dashboard/admin";
  if (role === "LANDLORD") return "/dashboard/landlord";
  return "/dashboard/tenant";
}

export function PublicUserMenu({ overlay }: PublicUserMenuProps) {
  const { user, setUser, loading } = useAuth();
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    function closeOnOutsideClick(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setIsOpen(false);
    }

    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, []);

  async function handleLogout() {
    setIsOpen(false);
    try {
      const response = await logoutAction();
      if (!response.success) {
        toast.error("Logout failed. Please try again.");
        return;
      }

      setUser(null);
      toast.success("Logged out successfully");
      router.push("/login");
      router.refresh();
    } catch {
      toast.error("Error logging out");
    }
  }

  if (loading) {
    return <span className={`size-10 animate-pulse rounded-full ${overlay ? "bg-white/15" : "bg-muted"}`} />;
  }

  return (
    <div ref={menuRef} className="relative">
      <button type="button" onClick={() => setIsOpen((value) => !value)} className={`flex h-10 items-center gap-2 rounded-full border px-2 transition-colors cursor-pointer ${overlay ? "border-white/40 bg-white/10 text-white hover:bg-white/20" : "border-border bg-background text-foreground hover:bg-muted"}`} aria-label="Open account menu" aria-haspopup="menu" aria-expanded={isOpen}>
        <span className={`flex size-7 items-center justify-center rounded-full text-xs font-black ${user ? "bg-emerald-400 text-emerald-950" : overlay ? "bg-white/15 text-white" : "bg-emerald-500/10 text-emerald-700"}`}>
          {user?.name ? user.name.charAt(0).toUpperCase() : <User className="size-3.5" />}
        </span>
        {user && <ChevronDown className={`hidden size-3 transition-transform sm:block ${isOpen ? "rotate-180" : ""}`} />}
      </button>

      {isOpen && (
        <div role="menu" className="absolute right-0 mt-3 w-72 overflow-hidden rounded-[1.5rem] border border-border/70 bg-background/95 p-2.5 text-foreground shadow-[0_24px_70px_-20px_rgba(15,23,42,0.5)] backdrop-blur-2xl">
          {user ? (
            <>
              <div className="rounded-[1.1rem] bg-emerald-500/8 p-4">
                <p className="truncate text-sm font-extrabold">{user.name}</p>
                <p className="mt-1 truncate text-[11px] text-muted-foreground">{user.email}</p>
                <span className="mt-3 inline-flex rounded-full bg-emerald-500/10 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.14em] text-emerald-700 dark:text-emerald-300">{user.role}</span>
              </div>

              <div className="mt-2 space-y-1 text-xs font-bold">
                <Link role="menuitem" href="/dashboard/profile" onClick={() => setIsOpen(false)} className="flex items-center gap-3 rounded-xl px-3.5 py-3 hover:bg-muted">
                  <User className="size-4 text-emerald-600 dark:text-emerald-400" /> Profile
                </Link>
                <Link role="menuitem" href={getDashboardHref(user.role)} onClick={() => setIsOpen(false)} className="flex items-center gap-3 rounded-xl px-3.5 py-3 hover:bg-muted">
                  <LayoutDashboard className="size-4 text-emerald-600 dark:text-emerald-400" /> Dashboard
                </Link>
                <div className="flex items-center justify-between rounded-xl px-3.5 py-2 hover:bg-muted">
                  <span className="text-muted-foreground">Theme</span>
                  <ThemeToggle variant="ghost" showLabel />
                </div>
                <button role="menuitem" type="button" onClick={handleLogout} className="flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-left text-rose-600 hover:bg-rose-500/10 dark:text-rose-400 cursor-pointer">
                  <LogOut className="size-4" /> Log out
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-1 text-xs font-bold">
              <p className="px-3.5 pb-2 pt-1 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Your RentNest account</p>
              <Link role="menuitem" href="/login" onClick={() => setIsOpen(false)} className="flex items-center gap-3 rounded-xl px-3.5 py-3 hover:bg-muted"><LogIn className="size-4 text-emerald-600 dark:text-emerald-400" /> Log in</Link>
              <Link role="menuitem" href="/register" onClick={() => setIsOpen(false)} className="flex items-center gap-3 rounded-xl bg-emerald-600 px-3.5 py-3 text-white hover:bg-emerald-700"><UserPlus className="size-4" /> Create account</Link>
              <div className="flex items-center justify-between rounded-xl px-3.5 py-2 hover:bg-muted border-t border-border/50 mt-1">
                <span className="text-muted-foreground">Theme</span>
                <ThemeToggle variant="ghost" showLabel />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
