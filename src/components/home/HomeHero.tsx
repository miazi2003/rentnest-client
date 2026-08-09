"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUpRight, Search } from "lucide-react";
import { heroContent } from "./home-content";

export function HomeHero() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/properties?query=${encodeURIComponent(query.trim())}`);
    } else {
      router.push("/properties");
    }
  };

  return (
    <section className="relative isolate min-h-[720px] overflow-hidden bg-slate-900 text-white sm:min-h-[800px] lg:min-h-[calc(100svh-1rem)]">
      <Image
        src="/rentnest-hero.png"
        alt="Sculptural modern coastal home at dusk"
        fill
        priority
        quality={92}
        sizes="100vw"
        className="object-cover object-[64%_center]"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/35 via-transparent to-slate-950/5" />
      <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-slate-950/30 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent" />

      <div className="absolute inset-x-0 top-[18%] z-10 mx-auto max-w-[1600px] px-5 sm:px-8 lg:top-[15%] lg:px-12">
        <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.24em] text-white/65">{heroContent.eyebrow}</p>
        <div className="max-w-[64%] overflow-hidden sm:max-w-[62%] lg:max-w-[67%]">
          <h1 className="whitespace-pre-line font-heading text-[clamp(5.4rem,15vw,14rem)] font-black uppercase leading-[0.69] tracking-[-0.095em] text-white/95">
            {heroContent.title}
          </h1>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-20 mx-auto max-w-[1600px] px-5 pb-8 sm:px-8 sm:pb-10 lg:px-12 lg:pb-12">
        <div className="flex flex-col items-start justify-between gap-6 border-t border-white/25 pt-6 lg:flex-row lg:items-end">
          <div className="max-w-xs">
            <p className="text-sm leading-6 text-white/78">{heroContent.description}</p>
            <Link href="/properties" className="mt-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-emerald-300 transition-colors hover:text-white">
              Browse properties <ArrowUpRight className="size-4" />
            </Link>
          </div>

          <form
            onSubmit={handleSearch}
            className="flex w-full max-w-md items-center gap-2 rounded-full border border-white/35 bg-slate-950/60 p-1.5 backdrop-blur-xl shadow-2xl transition-all focus-within:border-emerald-400"
          >
            <div className="flex flex-1 items-center gap-2 px-3 text-white">
              <Search className="size-4 shrink-0 text-emerald-300" />
              <input
                type="text"
                aria-label="Search properties"
                placeholder="Search location, title, or category..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent text-xs font-medium text-white placeholder:text-white/50 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 px-5 py-2.5 text-xs font-black tracking-wide shadow-md shadow-emerald-500/20 transition-all cursor-pointer shrink-0"
            >
              Search <ArrowUpRight className="size-3.5" />
            </button>
          </form>

          <div className="hidden items-center gap-3 text-[10px] font-bold uppercase tracking-[0.18em] text-white/55 lg:flex">
            Scroll to explore
            <span className="flex size-10 items-center justify-center rounded-full border border-white/30">
              <ArrowDown className="size-4" />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
