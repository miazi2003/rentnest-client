"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Bath,
  BedDouble,
  Building2,
  MapPin,
  Sparkles,
  Star,
  Tag,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface PropertyItem {
  id: string;
  title: string;
  description?: string;
  price?: number | string;
  address?: string;
  location?: string;
  images?: string[];
  category?: {
    name: string;
  };
  bedrooms?: number;
  bathrooms?: number;
  amenities?: string[];
  isAvailable?: boolean;
  availability?: string;
  status?: string;
  avgRating?: number;
  rating?: number;
}

interface PropertiesListClientProps {
  properties: PropertyItem[];
}

function getAvailability(property: PropertyItem) {
  if (typeof property.isAvailable === "boolean") {
    return property.isAvailable ? "Available" : "Unavailable";
  }

  const value = property.availability || property.status;
  if (!value) return null;

  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

export default function PropertiesListClient({
  properties,
}: PropertiesListClientProps) {
  return (
    <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
      {properties.map((property) => {
        const image = property.images?.[0];
        const location = property.location || property.address;
        const availability = getAvailability(property);
        const isAvailable = availability?.toLowerCase() === "available";
        const rating = property.avgRating ?? property.rating;
        const hasRating = typeof rating === "number" && Number.isFinite(rating);
        const details = [
          location
            ? { icon: MapPin, label: location, title: "Location" }
            : null,
          typeof property.bedrooms === "number"
            ? {
                icon: BedDouble,
                label: `${property.bedrooms} ${property.bedrooms === 1 ? "bed" : "beds"}`,
                title: "Bedrooms",
              }
            : null,
          typeof property.bathrooms === "number"
            ? {
                icon: Bath,
                label: `${property.bathrooms} ${property.bathrooms === 1 ? "bath" : "baths"}`,
                title: "Bathrooms",
              }
            : null,
          property.category?.name
            ? { icon: Tag, label: property.category.name, title: "Property type" }
            : null,
        ].filter((detail): detail is NonNullable<typeof detail> => Boolean(detail));

        return (
          <Card
            key={property.id}
            className="group h-full gap-0 overflow-hidden rounded-[1.75rem] border border-emerald-950/10 bg-white py-0 shadow-[0_10px_35px_-20px_rgba(6,78,59,0.35)] transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-[0_22px_50px_-24px_rgba(6,78,59,0.45)] dark:border-emerald-900/40 dark:bg-card"
          >
            <div className="relative m-2.5 aspect-[16/10] overflow-hidden rounded-[1.35rem] bg-emerald-50 dark:bg-emerald-950/30">
              {image ? (
                <Image
                  src={image}
                  alt={property.title}
                  fill
                  unoptimized
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-emerald-700/35 dark:text-emerald-300/30">
                  <Building2 className="size-12" aria-hidden="true" />
                </div>
              )}

              <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-3">
                {(property.category?.name || availability) && (
                  <Badge className="border border-white/70 bg-white/90 px-3 py-1 text-[11px] font-bold text-emerald-900 shadow-sm backdrop-blur-md hover:bg-white dark:border-white/10 dark:bg-slate-950/80 dark:text-emerald-200">
                    {property.category?.name || availability}
                  </Badge>
                )}

                {hasRating && (
                  <Badge className="ml-auto gap-1 border border-white/70 bg-white/90 px-2.5 py-1 text-[11px] font-extrabold text-slate-900 shadow-sm backdrop-blur-md hover:bg-white dark:border-white/10 dark:bg-slate-950/80 dark:text-white">
                    <Star className="size-3 fill-amber-400 text-amber-400" />
                    {rating.toFixed(1)}
                  </Badge>
                )}
              </div>
            </div>

            <CardContent className="flex flex-1 flex-col px-5 pb-0 pt-3 sm:px-6">
              <div className="flex items-start gap-3">
                <h2 className="min-w-0 flex-1 text-xl font-extrabold leading-tight tracking-[-0.025em] text-slate-950 dark:text-white">
                  {property.title}
                </h2>
                {availability && (
                  <Badge
                    variant="outline"
                    className={cn(
                      "mt-0.5 shrink-0 px-2.5 py-1 text-[10px] font-bold",
                      isAvailable
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300"
                        : "border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300",
                    )}
                  >
                    {availability}
                  </Badge>
                )}
              </div>

              {details.length > 0 && (
                <div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-3 border-y border-slate-100 py-4 dark:border-border/70">
                  {details.map(({ icon: Icon, label, title }) => (
                    <div key={title} className="flex min-w-0 items-center gap-2" title={title}>
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                        <Icon className="size-3.5" aria-hidden="true" />
                      </span>
                      <span className="truncate text-xs font-semibold text-slate-600 dark:text-slate-300">
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {property.description && (
                <p className="mt-4 line-clamp-2 min-h-10 text-sm leading-5 text-slate-500 dark:text-slate-400">
                  {property.description}
                </p>
              )}

              {property.amenities && property.amenities.length > 0 && (
                <div className="mt-3 flex items-center gap-2 overflow-hidden text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
                  <Sparkles className="size-3.5 shrink-0" aria-hidden="true" />
                  <span className="truncate">{property.amenities.slice(0, 3).join(" · ")}</span>
                </div>
              )}
            </CardContent>

            <CardFooter className="mt-auto flex items-end justify-between gap-4 px-5 pb-5 pt-6 sm:px-6 sm:pb-6">
              <div className="min-w-0">
                {property.price !== undefined && property.price !== null && (
                  <>
                    <p className="truncate text-xl font-black tracking-tight text-emerald-800 dark:text-emerald-300">
                      ${Number(property.price).toLocaleString()}
                    </p>
                    <p className="text-[11px] font-medium text-slate-400">per month</p>
                  </>
                )}
              </div>

              <Link
                href={`/properties/${property.id}`}
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "h-11 shrink-0 rounded-xl bg-emerald-700 px-4 text-xs font-bold text-white shadow-sm shadow-emerald-900/15 hover:bg-emerald-800 sm:px-5",
                )}
              >
                View Details
                <ArrowUpRight className="size-4 transition-transform duration-300 group-hover/button:translate-x-0.5 group-hover/button:-translate-y-0.5" />
              </Link>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
