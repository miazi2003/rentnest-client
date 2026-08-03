"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/app/features/auth/hooks/use-auth";
import { logoutAction } from "@/app/features/auth/actions/logoutAction";
import { toast } from "sonner";
import {
  Home,
  Building2,
  Info,
  LayoutDashboard,
  LogOut,
  User as UserIcon,
  ChevronDown,
  Menu,
  X,
  Shield,
  Key,
  LogIn,
  UserPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { HomeNavbar } from "@/components/home/HomeNavbar";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, setUser, loading } = useAuth();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Determine role-based dashboard route
  const getDashboardHref = () => {
    if (!user) return "/login";
    switch (user.role) {
      case "ADMIN":
        return "/dashboard/admin";
      case "LANDLORD":
        return "/dashboard/landlord";
      case "TENANT":
      default:
        return "/dashboard/tenant";
    }
  };

  const dashboardHref = getDashboardHref();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setDropdownOpen(false);
    try {
      const res = await logoutAction();
      if (res.success) {
        setUser(null);
        toast.success("Logged out successfully");
        router.push("/login");
        router.refresh();
      } else {
        toast.error("Logout failed. Please try again.");
      }
    } catch {
      toast.error("Error logging out");
    }
  };

  const navItems = [
    { label: "Home", href: "/", icon: Home },
    { label: "Properties", href: "/properties", icon: Building2 },
    { label: "About Us", href: "/about", icon: Info },
    { label: "Dashboard", href: dashboardHref, icon: LayoutDashboard },
  ];

  if (pathname === "/") {
    return <HomeNavbar />;
  }

  if (pathname.startsWith("/dashboard")) {
    return null;
  }

  const getRoleBadgeStyle = (role?: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 shadow-xs";
      case "LANDLORD":
        return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 shadow-xs";
      case "TENANT":
      default:
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-xs";
    }
  };

  const getRoleIcon = (role?: string) => {
    switch (role) {
      case "ADMIN":
        return <Shield className="w-3 h-3 text-amber-500" />;
      case "LANDLORD":
        return <Key className="w-3 h-3 text-purple-500" />;
      case "TENANT":
      default:
        return <UserIcon className="w-3 h-3 text-emerald-500" />;
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background/85 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.35)] transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group cursor-pointer select-none"
        >
          <Image
            src="/favicon.ico"
            alt="RentNest Logo"
            width={40}
            height={40}
            className="w-10 h-10 shrink-0 rounded-2xl object-contain shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-all duration-300"
          />
          <span className="font-heading tracking-tight text-xl font-black bg-gradient-to-r from-foreground via-foreground/90 to-emerald-600 bg-clip-text text-transparent">
            Rent<span className="text-emerald-600 dark:text-emerald-400 font-extrabold">Nest</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5 bg-muted/40 p-1.5 rounded-full shadow-inner">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-full text-xs tracking-wide transition-all duration-300 ${
                  isActive
                    ? "bg-background text-emerald-600 dark:text-emerald-400 font-bold shadow-[0_4px_16px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.4)] scale-[1.02]"
                    : "text-muted-foreground/80 hover:text-foreground font-medium hover:bg-background/60"
                }`}
              >
                <Icon
                  className={`w-3.5 h-3.5 transition-transform duration-300 ${
                    isActive
                      ? "text-emerald-600 dark:text-emerald-400 scale-110"
                      : "opacity-70 group-hover:opacity-100"
                  }`}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Section: User Profile Dropdown or Auth Actions */}
        <div className="flex items-center gap-3">
          {loading ? (
            <div className="w-9 h-9 rounded-full bg-muted/60 animate-pulse" />
          ) : user ? (
            /* Logged In User Dropdown */
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2.5 p-1.5 pr-3.5 rounded-full bg-muted/40 hover:bg-muted/70 transition-all duration-300 text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
              >
                {/* User Avatar Circle */}
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-500 text-white font-black text-xs flex items-center justify-center shadow-md shadow-emerald-500/20">
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>

                <div className="hidden sm:block text-xs leading-tight">
                  <p className="font-bold text-foreground max-w-[120px] truncate tracking-tight">
                    {user.name}
                  </p>
                  <p className="text-[10px] text-muted-foreground capitalize font-medium">
                    {user.role?.toLowerCase()}
                  </p>
                </div>

                <ChevronDown
                  className={`w-3.5 h-3.5 text-muted-foreground transition-transform duration-300 ${
                    dropdownOpen ? "rotate-180 text-emerald-600" : ""
                  }`}
                />
              </button>

              {/* User Dropdown Menu Card */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-72 rounded-3xl bg-background/95 backdrop-blur-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.12)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] p-2.5 z-50 animate-in fade-in-50 zoom-in-95 duration-200">
                  {/* User Profile Header */}
                  <div className="p-3.5 mb-2 rounded-2xl bg-gradient-to-br from-emerald-500/5 via-teal-500/5 to-transparent space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-sm text-foreground truncate">
                        {user.name}
                      </p>
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1 ${getRoleBadgeStyle(
                          user.role
                        )}`}
                      >
                        {getRoleIcon(user.role)}
                        {user.role}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate font-mono">
                      {user.email}
                    </p>
                  </div>

                  {/* Dropdown Items */}
                  <div className="space-y-0.5 text-xs font-semibold">
                    <Link
                      href={dashboardHref}
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-foreground hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all duration-200"
                    >
                      <LayoutDashboard className="w-4 h-4 text-emerald-600" />
                      <span>Role Dashboard</span>
                      <span className="ml-auto text-[10px] font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-full uppercase">
                        {user.role}
                      </span>
                    </Link>

                    <Link
                      href="/dashboard/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-foreground hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200"
                    >
                      <UserIcon className="w-4 h-4 text-blue-500" />
                      <span>Account Profile</span>
                    </Link>

                    <div className="my-1.5 border-t border-muted/80" />

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition-all duration-200 font-bold text-left cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Logged Out Actions */
            <div className="flex items-center gap-2.5">
              <Link href="/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full font-bold text-xs px-4 text-foreground/90 hover:text-foreground hover:bg-muted/50 transition-all duration-300"
                >
                  <LogIn className="w-3.5 h-3.5 text-muted-foreground mr-1.5" />
                  Log In
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  size="sm"
                  className="rounded-full font-bold text-xs px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-md shadow-emerald-600/25 hover:shadow-lg hover:shadow-emerald-600/35 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <UserPlus className="w-3.5 h-3.5 mr-1.5" />
                  Register
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden p-2.5 rounded-2xl bg-muted/40 text-foreground hover:bg-muted/70 transition-all duration-300 cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-2xl px-5 pt-3 pb-6 space-y-3 shadow-xl animate-in slide-in-from-top-4 duration-300">
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-300 ${
                    isActive
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-extrabold shadow-xs"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {user && (
            <div className="pt-3 border-t border-muted/80 space-y-2.5">
              <div className="p-3.5 rounded-2xl bg-muted/40 flex items-center justify-between">
                <div>
                  <p className="font-bold text-xs text-foreground">
                    {user.name}
                  </p>
                  <p className="text-[11px] text-muted-foreground font-mono">
                    {user.email}
                  </p>
                </div>
                <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                  {user.role}
                </span>
              </div>
              <Button
                variant="destructive"
                onClick={handleLogout}
                className="w-full rounded-2xl text-xs font-bold gap-2 py-2.5"
              >
                <LogOut className="w-4 h-4" />
                Log Out
              </Button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
