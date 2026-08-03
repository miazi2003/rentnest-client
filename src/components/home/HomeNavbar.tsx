"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { homeNavigation } from "./home-content";

export function HomeNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="absolute inset-x-0 top-0 z-50 text-white">
      <div className="mx-auto flex h-20 max-w-[1600px] items-center justify-between px-5 sm:px-8 lg:h-24 lg:px-12">
        <div className="flex items-center gap-8 lg:gap-12">
          <Link href="/" className="font-heading text-xl font-black tracking-[-0.05em]" aria-label="RentNest home">
            Rent<span className="text-emerald-300">Nest</span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Home navigation">
            {homeNavigation.map(({ label, href }, index) => (
              <Link
                key={href}
                href={href}
                className={`rounded-full px-4 py-2 text-[11px] font-semibold transition-colors ${index === 0 ? "border border-white/45 bg-white/10" : "text-white/75 hover:bg-white/10 hover:text-white"}`}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        <Link href="/properties" className="hidden items-center gap-2 rounded-full border border-white/45 bg-white/10 px-5 py-2.5 text-[11px] font-bold backdrop-blur-md transition-colors hover:bg-white hover:text-slate-950 md:flex">
          Explore homes <ArrowUpRight className="size-3.5" />
        </Link>

        <button type="button" onClick={() => setIsOpen((value) => !value)} className="flex size-10 items-center justify-center rounded-full border border-white/35 bg-black/10 backdrop-blur-md md:hidden" aria-label="Toggle navigation" aria-expanded={isOpen}>
          {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {isOpen && (
        <div className="mx-5 rounded-3xl border border-white/15 bg-slate-950/85 p-3 shadow-2xl backdrop-blur-xl md:hidden">
          {homeNavigation.map(({ label, href }) => (
            <Link key={href} href={href} onClick={() => setIsOpen(false)} className="block rounded-2xl px-4 py-3 text-sm font-semibold text-white/80 hover:bg-white/10 hover:text-white">
              {label}
            </Link>
          ))}
          <Link href="/properties" onClick={() => setIsOpen(false)} className="mt-2 flex items-center justify-between rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-bold text-emerald-950">
            Explore homes <ArrowUpRight className="size-4" />
          </Link>
        </div>
      )}
    </header>
  );
}
