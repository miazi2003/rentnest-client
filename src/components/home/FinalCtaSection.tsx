"use client";

import Link from "next/link";
import { ArrowUpRight, Building2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FinalCtaSection() {
  return (
    <section className="relative overflow-hidden bg-slate-950 text-white py-20 sm:py-28">
      {/* Decorative Blur Orbs */}
      <div className="absolute -left-20 -top-20 size-96 rounded-full bg-emerald-500/20 blur-3xl" />
      <div className="absolute -right-20 -bottom-20 size-96 rounded-full bg-teal-500/15 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12 text-center space-y-8">
        <div className="max-w-3xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <Building2 className="size-3.5" /> Ready to find your home?
          </span>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight font-heading leading-tight">
            Start Your Rental Journey Today
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            Join tenants and verified landlords experiencing simpler, modern rental management with RentNest.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link href="/properties">
            <Button className="rounded-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs px-8 py-3.5 shadow-xl shadow-emerald-500/25 flex items-center gap-2 cursor-pointer w-full sm:w-auto">
              Explore All Listings <ArrowUpRight className="size-4" />
            </Button>
          </Link>
          <Link href="/register">
            <Button variant="outline" className="rounded-full border-white/25 bg-white/5 text-white hover:bg-white/15 font-bold text-xs px-8 py-3.5 flex items-center gap-2 cursor-pointer w-full sm:w-auto">
              Create Free Account <UserPlus className="size-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
