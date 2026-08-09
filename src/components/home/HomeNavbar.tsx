"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { homeNavigation } from "./home-content";
import { PublicUserMenu } from "./PublicUserMenu";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { cn } from "@/lib/utils";

export function HomeNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isTransparent = isHome && !scrolled;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "inset-x-0 top-0 z-50 transition-[background-color,color,border-color,box-shadow] duration-300",
        isHome ? "fixed" : "sticky",
        isTransparent
          ? "border-b border-transparent bg-transparent text-white shadow-none"
          : "border-b border-border/60 bg-background text-foreground shadow-xs"
      )}
    >
      <div className="mx-auto flex h-20 max-w-[1600px] items-center justify-between px-5 sm:px-8 lg:h-24 lg:px-12">
        <div className="flex items-center gap-8 lg:gap-12">
          <Link href="/" className="flex items-center gap-2.5 font-heading text-xl font-black tracking-[-0.05em]" aria-label="RentNest home">
            <Image src="/favicon.ico" alt="RentNest logo" width={40} height={40} priority className="size-10 rounded-xl object-contain" />
            <span>Rent<span className={isTransparent ? "text-emerald-300" : "text-emerald-600 dark:text-emerald-400"}>Nest</span></span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Home navigation">
            {homeNavigation.map(({ label, href }) => {
              const isActive = href === "/" ? isHome : pathname.startsWith(href);
              return (
              <Link
                key={href}
                href={href}
                className={`rounded-full px-4 py-2 text-[11px] font-semibold transition-colors ${
                  isActive
                    ? isTransparent ? "border border-white/45 bg-white/10" : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                    : isTransparent ? "text-white/75 hover:bg-white/10 hover:text-white" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {label}
              </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/properties" className={`hidden items-center gap-2 rounded-full px-5 py-2.5 text-[11px] font-bold backdrop-blur-md transition-colors md:flex ${isTransparent ? "border border-white/45 bg-white/10 hover:bg-white hover:text-slate-950" : "bg-emerald-600 text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700"}`}>
            Explore homes <ArrowUpRight className="size-3.5" />
          </Link>
          <ThemeToggle variant={isTransparent ? "outline" : "ghost"} className={isTransparent ? "border-white/35 bg-black/10 text-white hover:bg-white/20" : ""} />
          <PublicUserMenu overlay={isTransparent} />
          <button type="button" onClick={() => setIsOpen((value) => !value)} className={`flex size-10 items-center justify-center rounded-full border backdrop-blur-md md:hidden ${isTransparent ? "border-white/35 bg-black/10" : "border-border bg-muted"}`} aria-label="Toggle navigation" aria-expanded={isOpen}>
            {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="mx-5 rounded-3xl border border-white/15 bg-slate-950/85 p-3 shadow-2xl backdrop-blur-xl md:hidden space-y-1">
          {homeNavigation.map(({ label, href }) => (
            <Link key={href} href={href} onClick={() => setIsOpen(false)} className="block rounded-2xl px-4 py-3 text-sm font-semibold text-white/80 hover:bg-white/10 hover:text-white">
              {label}
            </Link>
          ))}
          <div className="flex items-center justify-between px-4 py-2 text-white border-t border-white/10">
            <span className="text-xs font-semibold text-white/70">Appearance</span>
            <ThemeToggle variant="outline" className="border-white/20 text-white" />
          </div>
          <Link href="/properties" onClick={() => setIsOpen(false)} className="mt-2 flex items-center justify-between rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-bold text-emerald-950">
            Explore homes <ArrowUpRight className="size-4" />
          </Link>
        </div>
      )}
    </header>
  );
}
