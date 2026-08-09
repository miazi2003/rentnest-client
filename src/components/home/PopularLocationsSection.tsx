"use client";

import Link from "next/link";
import { MapPin, ArrowUpRight, Compass } from "lucide-react";
import type { PropertyItem } from "@/app/properties/components/property.types";

interface PopularLocationsSectionProps {
  properties?: PropertyItem[];
}

export function PopularLocationsSection({ properties = [] }: PopularLocationsSectionProps) {
  // Extract distinct locations from real property data
  const realLocations = Array.from(
    new Set(
      properties
        .map((p) => p.location || p.address)
        .filter((loc): loc is string => typeof loc === "string" && loc.trim().length > 0)
    )
  ).slice(0, 4);

  const displayLocations = realLocations;

  return (
    <section className="py-16 sm:py-24 bg-muted/20 border-t border-border/50">
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12 space-y-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
              <Compass className="size-3.5" /> Prime Neighborhoods
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground font-heading">
              Popular Rental Locations
            </h2>
            <p className="text-sm text-muted-foreground max-w-xl">
              Discover top requested neighborhoods and location hubs across our verified listings.
            </p>
          </div>
          <Link
            href="/properties"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline shrink-0"
          >
            Explore all locations <ArrowUpRight className="size-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayLocations.map((location) => {
            const count = properties.filter(
              (p) => (p.location || p.address)?.toLowerCase().includes(location.toLowerCase())
            ).length;

            return (
              <Link
                key={location}
                href={`/properties?query=${encodeURIComponent(location)}`}
                className="group relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-xs hover:border-emerald-500/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="size-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
                  <MapPin className="size-5" />
                </div>
                <h3 className="text-lg font-bold text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {location}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  {count > 0 ? `${count} active listings` : "Verified properties available"}
                </p>
                <div className="mt-4 flex items-center justify-between text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <span>View listings</span>
                  <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
