"use client";

import Image from "next/image";
import Link from "next/link";
import { Building2, Calendar, ChevronLeft, ChevronRight, MapPin, MessageSquare, Sparkles, Star } from "lucide-react";
import type { ReviewPaginationMeta, TenantReview } from "@/app/features/review/types";
import { buttonVariants } from "@/components/ui/button";

interface TenantReviewsClientProps {
  reviews: TenantReview[];
  meta: ReviewPaginationMeta | null;
  error: string | null;
}

const formatReviewDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
};

export default function TenantReviewsClient({ reviews, meta, error }: TenantReviewsClientProps) {
  const currentPage = meta?.page || 1;
  const totalPages = meta?.totalPages || 0;

  return (
    <div className="space-y-8 pb-10">
      <div className="relative flex flex-col gap-4 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-emerald-900/90 via-teal-900 to-cyan-900 p-6 text-white shadow-xl sm:p-8 md:flex-row md:items-center md:justify-between">
        <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 translate-x-8 -translate-y-8 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="z-10 space-y-1.5">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-200 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-emerald-300" />
            Tenant Portal
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">My Reviews & Ratings</h1>
          <p className="max-w-xl text-sm text-emerald-100/80">View feedback you have submitted for your active and past property tenancies.</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg font-bold text-foreground">
            <MessageSquare className="h-5 w-5 text-emerald-600" />
            Submitted Reviews ({meta?.total ?? reviews.length})
          </h2>
        </div>

        {error ? (
          <div role="alert" className="space-y-2 rounded-3xl border border-rose-200 bg-rose-50 p-8 text-center dark:border-rose-900/60 dark:bg-rose-950/30">
            <MessageSquare className="mx-auto h-9 w-9 text-rose-500" />
            <h3 className="text-base font-bold text-rose-700 dark:text-rose-300">Unable to load reviews</h3>
            <p className="mx-auto max-w-md text-xs text-rose-600 dark:text-rose-400">{error}</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="space-y-3 rounded-3xl border border-border bg-card p-12 text-center">
            <Star className="mx-auto h-10 w-10 text-muted-foreground" />
            <h3 className="text-base font-bold text-foreground">No Reviews Submitted</h3>
            <p className="mx-auto max-w-xs text-xs text-muted-foreground">You haven&apos;t left any property reviews yet. Go to active rentals to submit your review.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {reviews.map((review) => {
                const image = review.property.images?.[0];
                return (
                  <article key={review.id} className="space-y-4 rounded-3xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-emerald-100 bg-emerald-50 text-emerald-600 dark:border-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-400">
                          {image ? (
                            <Image src={image} alt={review.property.title} fill unoptimized sizes="44px" className="object-cover" />
                          ) : (
                            <Building2 className="h-5 w-5" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <h3 className="truncate text-sm font-bold leading-tight text-foreground sm:text-base">{review.property.title}</h3>
                          <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="h-3.5 w-3.5 shrink-0" />
                            <span className="truncate">{review.property.address}</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700 dark:border-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        {review.rating}
                      </div>
                    </div>

                    <p className="rounded-2xl border border-border/60 bg-muted/50 p-4 text-xs italic leading-relaxed text-foreground/90 sm:text-sm">&ldquo;{review.comment}&rdquo;</p>

                    <div className="flex items-center text-xs text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        Reviewed on {formatReviewDate(review.createdAt)}
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>

            {meta && totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-border pt-4">
                <p className="text-xs text-muted-foreground">Showing {(currentPage - 1) * meta.limit + 1}-{Math.min(currentPage * meta.limit, meta.total)} of {meta.total}</p>
                <div className="flex items-center gap-2">
                  {currentPage > 1 ? (
                    <Link href={`/dashboard/tenant/reviews?page=${Math.max(1, currentPage - 1)}`} className={buttonVariants({ variant: "outline", size: "sm", className: "h-8 gap-1 text-xs" })}>
                      <ChevronLeft className="h-3.5 w-3.5" /> Previous
                    </Link>
                  ) : (
                    <span className={buttonVariants({ variant: "outline", size: "sm", className: "h-8 gap-1 text-xs opacity-50" })} aria-disabled="true">
                      <ChevronLeft className="h-3.5 w-3.5" /> Previous
                    </span>
                  )}
                  <span className="text-xs font-semibold text-muted-foreground">{currentPage} / {totalPages}</span>
                  {currentPage < totalPages ? (
                    <Link href={`/dashboard/tenant/reviews?page=${Math.min(totalPages, currentPage + 1)}`} className={buttonVariants({ variant: "outline", size: "sm", className: "h-8 gap-1 text-xs" })}>
                      Next <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  ) : (
                    <span className={buttonVariants({ variant: "outline", size: "sm", className: "h-8 gap-1 text-xs opacity-50" })} aria-disabled="true">
                      Next <ChevronRight className="h-3.5 w-3.5" />
                    </span>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
