import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Building2, MapPin, Star } from "lucide-react";
import { getPropertyAvailability, type PropertyItem } from "./property.types";

interface PropertyCardProps {
  property: PropertyItem;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const image = property.images?.[0];
  const location = property.location || property.address;
  const availability = getPropertyAvailability(property);
  const rating = property.avgRating ?? property.rating;
  const hasRating = typeof rating === "number" && Number.isFinite(rating);
  const imageCount = Math.min(property.images?.length || 0, 4);
  const tags = property.amenities?.slice(0, 2) || [];

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white p-2.5 shadow-[0_18px_45px_-30px_rgba(15,23,42,0.45)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_60px_-30px_rgba(15,23,42,0.55)] dark:border-white/10 dark:bg-card">
      <div className="flex flex-1 flex-col px-3 pb-5 pt-3 sm:px-4 sm:pt-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="line-clamp-1 text-[1.7rem] font-medium leading-none tracking-[-0.065em] text-slate-950 dark:text-white">
              {property.title}
            </h2>
            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-slate-500 dark:text-slate-400">
              {location && (
                <span className="flex min-w-0 items-center gap-1">
                  <MapPin className="size-3 shrink-0" />
                  <span className="max-w-40 truncate">{location}</span>
                </span>
              )}
              {property.category?.name && (
                <span className="flex items-center gap-2 before:size-1 before:rounded-full before:bg-slate-400">
                  {property.category.name}
                </span>
              )}
            </div>
          </div>

          {availability && (
            <span className="shrink-0 rounded-full border border-slate-300 px-3 py-2 text-[10px] font-bold text-slate-800 dark:border-white/25 dark:text-slate-200">
              {availability}
            </span>
          )}
        </div>

        {property.description && (
          <p className="mt-3 line-clamp-2 min-h-9 max-w-[92%] text-[11px] leading-[1.45] text-slate-500 dark:text-slate-400">
            {property.description}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          <div>
            {property.price !== undefined && property.price !== null && (
              <p className="text-lg font-black tracking-[-0.035em] text-slate-950 dark:text-white">
                ${Number(property.price).toLocaleString()}
                <span className="ml-1 text-xs font-semibold tracking-normal text-slate-500 dark:text-slate-400">per month</span>
              </p>
            )}
          </div>

          <Link href={`/properties/${property.id}`} className="flex h-12 shrink-0 items-center gap-3 rounded-full bg-slate-950 py-1.5 pl-5 pr-1.5 text-xs font-bold text-white transition-transform hover:scale-[1.025] dark:bg-white dark:text-slate-950">
            View home
            <span className="flex size-9 items-center justify-center rounded-full bg-white text-slate-950 dark:bg-slate-950 dark:text-white">
              <ArrowUpRight className="size-5" />
            </span>
          </Link>
        </div>
      </div>

      <div className="relative aspect-[1.08] overflow-hidden rounded-[1.35rem] bg-slate-100 dark:bg-slate-900">
        {image ? (
          <Image src={image} alt={property.title} fill unoptimized sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]" />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-300 dark:text-slate-700">
            <Building2 className="size-14" />
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-950/55 to-transparent" />

        {imageCount > 1 && (
          <div className="absolute left-1/2 top-3 flex -translate-x-1/2 gap-1.5 rounded-full bg-black/10 px-2 py-1.5 backdrop-blur-sm">
            {Array.from({ length: imageCount }).map((_, index) => (
              <span key={index} className={`size-1.5 rounded-full ${index === 0 ? "bg-white" : "bg-white/45"}`} />
            ))}
          </div>
        )}

        <div className="absolute inset-x-0 bottom-3 flex items-end justify-between gap-3 px-3">
          <div className="flex min-w-0 gap-1.5 overflow-hidden">
            {tags.map((tag) => (
              <span key={tag} className="truncate rounded-full border border-white/15 bg-slate-950/35 px-3 py-1.5 text-[9px] font-semibold text-white backdrop-blur-md">
                {tag}
              </span>
            ))}
          </div>

          {hasRating && (
            <span className="flex shrink-0 items-center gap-1 text-xs font-black text-yellow-300">
              <Star className="size-3.5 fill-current" />
              {rating.toFixed(1)}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
