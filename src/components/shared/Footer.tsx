"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Mail, MapPin } from "lucide-react";
import { useAuth } from "@/app/features/auth/hooks/use-auth";

const exploreLinks = [
  { label: "Home", href: "/" },
  { label: "Properties", href: "/properties" },
  { label: "About us", href: "/about" },
] as const;

export default function Footer() {
  const pathname = usePathname();
  const { user, loading } = useAuth();

  const dashboardHref = user?.role === "ADMIN"
    ? "/dashboard/admin"
    : user?.role === "LANDLORD"
      ? "/dashboard/landlord"
      : "/dashboard/tenant";

  const accountLinks = user
    ? [
        { label: "Dashboard", href: dashboardHref },
        { label: "Profile", href: "/dashboard/profile" },
      ]
    : [
        { label: "Log in", href: "/login" },
        { label: "Create account", href: "/register" },
      ];

  if (pathname.startsWith("/dashboard")) return null;

  return (
    <footer className="bg-background px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <div className="mx-auto w-full max-w-[1600px] overflow-hidden rounded-[2rem] bg-slate-950 px-6 py-9 text-white sm:rounded-[2.5rem] sm:px-10 sm:py-12 lg:px-14 lg:py-14">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_0.9fr_0.9fr] lg:gap-8">
          <div className="lg:border-r lg:border-white/10 lg:pr-12">
            <Link href="/" className="inline-flex items-center gap-3" aria-label="RentNest home">
              <Image src="/favicon.ico" alt="RentNest logo" width={40} height={40} className="size-10 rounded-xl object-contain" />
              <span className="font-heading text-xl font-black tracking-[-0.05em]">Rent<span className="text-emerald-400">Nest</span></span>
            </Link>

            <h2 className="mt-7 max-w-sm font-heading text-3xl font-medium leading-[1.05] tracking-[-0.055em] text-white/75 sm:text-4xl">
              Better homes for better everyday living.
            </h2>

            <div className="mt-8 max-w-sm">
              <label htmlFor="footer-email" className="text-xs font-semibold text-white/70">Newsletter coming soon</label>
              <div className="mt-3 flex h-12 items-center rounded-full border border-white/15 bg-white/5 p-1 pl-4 focus-within:border-emerald-400/60">
                <Mail className="size-4 shrink-0 text-white/35" />
                <input id="footer-email" type="email" placeholder="Subscriptions unavailable" disabled className="min-w-0 flex-1 bg-transparent px-3 text-xs text-white outline-none placeholder:text-white/30 disabled:cursor-not-allowed" />
                <button type="button" aria-label="Newsletter subscriptions unavailable" disabled className="flex size-10 shrink-0 cursor-not-allowed items-center justify-center rounded-full bg-emerald-400 text-emerald-950 opacity-50">
                  <ArrowUpRight className="size-4" />
                </button>
              </div>
            </div>
          </div>

          {[
            { title: "Explore", links: exploreLinks },
            { title: "Account", links: loading ? [] : accountLinks },
          ].map((group) => (
            <nav key={group.title} aria-label={`${group.title} footer links`} className="lg:pl-8">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400">{group.title}</p>
              <ul className="mt-5 space-y-4">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="group inline-flex items-center gap-2 text-sm text-white/55 transition-colors hover:text-white">
                      {link.label}
                      <ArrowUpRight className="size-3 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-[10px] font-medium text-white/35 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} RentNest. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <span className="inline-flex items-center gap-1.5"><MapPin className="size-3" /> Bangladesh</span>
            <Link href="/contact" className="hover:text-white">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
