import type { Metadata } from "next";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | RentNest",
  description: "Meet the people and principles behind RentNest.",
};

export default function AboutPage() {
  return (
    <div className="overflow-hidden bg-background text-foreground">
      <section className="mx-auto w-full max-w-7xl px-4 pb-16 pt-10 sm:px-6 sm:pb-20 sm:pt-14 lg:px-8 lg:pb-24 lg:pt-16">
        <div className="grid items-end gap-7 lg:grid-cols-[0.72fr_1.45fr_0.85fr] lg:gap-8">
          <div className="lg:pb-1">
            <h1 className="font-heading text-[clamp(4.8rem,10.2vw,9rem)] font-black uppercase leading-[0.72] tracking-[-0.085em]">
              About<span className="mt-[0.28em] block">Us</span>
            </h1>
            <div className="mt-9 max-w-48 space-y-6 text-[11px] leading-[1.55] text-muted-foreground sm:text-xs">
              <p className="font-semibold text-foreground/80">A better way to find a place that feels like home.</p>
              <p>RentNest brings modern rental discovery, trusted connections, and simple property management together in one welcoming place.</p>
            </div>
          </div>

          <div className="relative h-[310px] overflow-hidden rounded-[2rem] bg-muted sm:h-[390px] lg:h-[345px]">
            <Image src="https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1400&q=88" alt="Bright, modern RentNest living room" fill priority sizes="(max-width: 1024px) 100vw, 46vw" className="object-cover transition-transform duration-700 hover:scale-[1.025]" />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/25 to-transparent" />
            <div className="absolute bottom-5 left-5 flex items-center gap-2 rounded-full bg-white/90 px-3.5 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-900 backdrop-blur-md">
              <span className="size-2 rounded-full bg-emerald-500" />Find your place
            </div>
          </div>

          <div className="flex h-full flex-col justify-end gap-5 lg:pb-1">
            <div className="relative h-40 overflow-hidden rounded-[2rem] bg-muted sm:h-52 lg:h-40">
              <Image src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=85" alt="Calm and thoughtfully designed home interior" fill sizes="(max-width: 1024px) 100vw, 27vw" className="object-cover" />
            </div>
            <div>
              <span className="mb-3 inline-block h-1 w-12 rounded-full bg-emerald-500" />
              <h2 className="font-heading text-2xl font-extrabold tracking-[-0.04em] sm:text-3xl">Our Philosophy</h2>
              <p className="mt-3 max-w-sm text-xs leading-5 text-muted-foreground">We believe renting should feel exciting, not exhausting. We build every RentNest experience around trust, clarity, and genuine care.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 pb-20 sm:px-6 sm:pb-28 lg:px-8">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-emerald-950 to-slate-950 px-5 py-10 text-white sm:rounded-[2.5rem] sm:px-10 sm:py-14 lg:px-16 lg:py-16">
          <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-emerald-400/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 -left-20 size-80 rounded-full bg-teal-400/10 blur-3xl" />
          <div className="relative grid items-center gap-10 lg:grid-cols-[1fr_0.92fr] lg:gap-16">
            <div className="order-2 lg:order-1">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-emerald-300">Meet the principal</p>
              <h2 className="mt-4 max-w-xl font-heading text-4xl font-black leading-[0.95] tracking-[-0.055em] sm:text-6xl">Built with care.<span className="block text-emerald-400">Led with purpose.</span></h2>
              <p className="mt-6 max-w-xl text-sm leading-7 text-white/65 sm:text-base">As the founder and principal of RentNest, Sumai leads the vision behind a rental experience where people feel informed, supported, and at home from their very first search.</p>
              <div className="mt-9 flex items-end justify-between gap-4 border-t border-white/15 pt-6">
                <div>
                  <h3 className="font-heading text-2xl font-extrabold tracking-tight">Sumai</h3>
                  <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-300">Founder &amp; Principal</p>
                </div>
                <div className="flex size-11 items-center justify-center rounded-full border border-white/20 bg-white/10"><ArrowUpRight className="size-5" aria-hidden="true" /></div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-[2rem] bg-emerald-100 sm:rounded-[2.5rem]">
                <Image src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=1000&q=90" alt="Founder and principal of RentNest" fill sizes="(max-width: 1024px) 90vw, 36vw" className="object-cover object-center grayscale-[12%]" />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/45 via-transparent to-transparent" />
                <span className="absolute right-5 top-5 rounded-full border border-white/25 bg-black/15 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.16em] backdrop-blur-md">RentNest / 01</span>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
