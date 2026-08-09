import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Quote } from "lucide-react";

interface PropertyStatsSectionProps {
  totalProperties: number;
}

export function PropertyStatsSection({ totalProperties }: PropertyStatsSectionProps) {
  const propertyLabel = totalProperties === 1 ? "Listed property" : "Listed properties";

  return (
    <section className="bg-backgorund pb-16 sm:pb-20 lg:p-28">
      <div className="mx-auto grid w-full max-w-[1600px] gap-4 px-5 sm:px-8 lg:grid-cols-2 lg:px-12">
        <div className="relative flex min-h-[540px] flex-col overflow-hidden rounded-[2rem] bg-[#f2f1ed] p-7 text-center text-slate-950 sm:rounded-[2.5rem] sm:p-12 lg:min-h-[620px] shadow-xl">
          <div className="pointer-events-none absolute -left-20 top-4 size-80 rounded-full border-[45px] border-white/45" />
          <div className="pointer-events-none absolute -right-24 top-36 size-72 rounded-full border-[38px] border-white/35" />

          <div className="relative mx-auto max-w-xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-emerald-700">Rent with confidence</p>
            <h2 className="mt-5 font-heading text-[clamp(2.7rem,5vw,5rem)] font-black leading-[0.92] tracking-[-0.07em]">
              Unlock the door to exceptional living
            </h2>
            <p className="mx-auto mt-6 max-w-md text-sm leading-6 text-slate-600">
              RentNest simplifies the rental journey with trusted listings,
              straightforward tools, and a clear experience from discovery to move-in.
            </p>

            <div className="m-8 flex flex-wrap justify-center gap-3">
              <Link href="/properties" className="rounded-full bg-emerald-400 px-6 py-3 text-xs font-bold text-emerald-950 transition-colors hover:bg-emerald-300">
                Find a home
              </Link>
              <Link href="/about" className="rounded-full px-6 py-3 text-xs font-bold text-slate-700 transition-colors hover:bg-white/70">
                About RentNest
              </Link>
            </div>
          </div>

          <div className="relative mt-auto rounded-[1.5rem] bg-white/90 p-6 shadow-[0_18px_45px_-35px_rgba(15,23,42,0.4)] backdrop-blur-sm sm:p-8">
            <div>
              <div className="px-2">
                <p className="font-heading text-2xl font-semibold tracking-tight sm:text-4xl">{totalProperties.toLocaleString()}</p>
                <p className="mt-2 text-[10px] text-slate-500 sm:text-xs">{propertyLabel}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative min-h-[540px] overflow-hidden rounded-[2rem] bg-slate-200 sm:rounded-[2.5rem] lg:min-h-[620px]">
          <Image src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1500&q=90" alt="Modern RentNest home surrounded by greenery" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/65 via-transparent to-slate-950/5" />

          <div className="absolute left-5 right-5 top-5 flex items-center justify-between sm:left-8 sm:right-8 sm:top-8">
            <span className="rounded-full border border-white/30 bg-black/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur-md">Featured living</span>
            <Link href="/properties" aria-label="Explore properties" className="flex size-11 items-center justify-center rounded-full bg-white text-slate-950 transition-transform hover:scale-105">
              <ArrowUpRight className="size-5" />
            </Link>
          </div>

          <div className="absolute bottom-5 left-5 right-5 rounded-[1.4rem] border border-white/30 bg-slate-950/20 p-5 text-white backdrop-blur-md sm:bottom-8 sm:left-8 sm:right-8 sm:p-7">
            <Quote className="size-6 text-emerald-300" />
            <p className="mt-3 max-w-lg font-heading text-xl font-semibold leading-tight tracking-[-0.035em] sm:text-2xl">
              A simpler way to discover a place that already feels like home.
            </p>
            <div className="mt-5 flex items-center justify-between gap-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/65">The RentNest experience</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
