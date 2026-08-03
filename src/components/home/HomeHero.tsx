import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { heroContent } from "./home-content";

export function HomeHero() {
  return (
    <section className="relative isolate min-h-[720px] overflow-hidden bg-slate-900 text-white sm:min-h-[800px] lg:min-h-[calc(100svh-1rem)]">
      <Image src="/rentnest-hero.png" alt="Sculptural modern coastal home at dusk" fill priority quality={92} sizes="100vw" className="object-cover object-[64%_center]" />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/35 via-transparent to-slate-950/5" />
      <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-slate-950/30 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-slate-950/60 via-slate-950/10 to-transparent" />

      <div className="absolute inset-x-0 top-[18%] z-10 mx-auto max-w-[1600px] px-5 sm:px-8 lg:top-[15%] lg:px-12">
        <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.24em] text-white/65">{heroContent.eyebrow}</p>
        <div className="max-w-[64%] overflow-hidden sm:max-w-[62%] lg:max-w-[67%]">
          <h1 className="whitespace-pre-line font-heading text-[clamp(5.4rem,15vw,14rem)] font-black uppercase leading-[0.69] tracking-[-0.095em] text-white/95">
            {heroContent.title}
          </h1>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-20 mx-auto max-w-[1600px] px-5 pb-8 sm:px-8 sm:pb-10 lg:px-12 lg:pb-12">
        <div className="flex flex-col items-start justify-between gap-8 border-t border-white/25 pt-6 sm:flex-row sm:items-end">
          <div className="max-w-xs">
            <p className="text-sm leading-6 text-white/78">{heroContent.description}</p>
            <Link href="/properties" className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-emerald-300 transition-colors hover:text-white">
              Browse properties <ArrowUpRight className="size-4" />
            </Link>
          </div>
          <div className="hidden items-center gap-3 text-[10px] font-bold uppercase tracking-[0.18em] text-white/55 sm:flex">
            Scroll to explore
            <span className="flex size-10 items-center justify-center rounded-full border border-white/30"><ArrowDown className="size-4" /></span>
          </div>
        </div>
      </div>
    </section>
  );
}
