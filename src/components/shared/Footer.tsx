"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Building2, Home, LogIn, UserPlus } from "lucide-react";

const footerLinks = [
  { label: "Home", href: "/", icon: Home },
  { label: "Properties", href: "/properties", icon: Building2 },
  { label: "Log in", href: "/login", icon: LogIn },
  { label: "Create account", href: "/register", icon: UserPlus },
];

export default function Footer() {
  const pathname = usePathname();

  if (pathname.startsWith("/dashboard")) return null;

  return (
    <footer className="mt-auto border-t border-slate-200/80 bg-white dark:border-border dark:bg-slate-950">
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-center">
          <div className="max-w-md">
            <Link href="/" className="inline-flex items-center gap-3">
              <Image
                src="/favicon.ico"
                alt="RentNest logo"
                width={40}
                height={40}
                className="size-10 rounded-xl object-contain"
              />
              <span className="font-heading text-xl font-black tracking-tight text-foreground">
                Rent<span className="text-emerald-600 dark:text-emerald-400">Nest</span>
              </span>
            </Link>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              A simple place for tenants to discover homes and landlords to manage their rental properties.
            </p>
          </div>

          <nav aria-label="Footer navigation" className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:justify-end">
            {footerLinks.map(({ label, href, icon: Icon }) => {
              const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition-colors duration-200 ${
                    isActive
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
                      : "text-muted-foreground hover:bg-slate-50 hover:text-foreground dark:hover:bg-slate-900"
                  }`}
                >
                  <Icon className="size-3.5" />
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t border-slate-100 pt-5 text-xs text-muted-foreground dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} RentNest. All rights reserved.</p>
          <p>Property rental, made simpler.</p>
        </div>
      </div>
    </footer>
  );
}
