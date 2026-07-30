"use me";
"use client";

import React, { useState } from "react";
import { Star, Building2, Calendar, MessageSquare, Sparkles, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface IReview {
  id: string;
  propertyTitle: string;
  location: string;
  rating: number;
  comment: string;
  date: string;
  landlordName: string;
}

const SAMPLE_REVIEWS: IReview[] = [
  {
    id: "rev-1",
    propertyTitle: "Greenwood Studio Apartment",
    location: "Dhanmondi 27, Dhaka",
    rating: 5,
    comment: "Excellent experience! Clean building, high-speed fiber internet pre-installed, and very responsive landlord.",
    date: "2026-07-15",
    landlordName: "Anisur Rahman",
  },
  {
    id: "rev-2",
    propertyTitle: "Cozy Garden View Flat",
    location: "Mirpur 10, Dhaka",
    rating: 4,
    comment: "Nice quiet neighborhood with good security. Parking facilities were convenient.",
    date: "2026-05-20",
    landlordName: "Syed Alim",
  },
];

export default function TenantReviewsClient() {
  const [reviews] = useState<IReview[]>(SAMPLE_REVIEWS);

  return (
    <div className="space-y-8 pb-10">
      {/* Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-emerald-900/90 via-teal-900 to-cyan-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-white/10 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-1.5 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 text-emerald-200 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            Tenant Portal
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            My Reviews & Ratings
          </h1>
          <p className="text-emerald-100/80 text-sm max-w-xl">
            View feedback you have submitted for your active and past property tenancies.
          </p>
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-emerald-600" />
            Submitted Reviews ({reviews.length})
          </h2>
        </div>

        {reviews.length === 0 ? (
          <div className="p-12 text-center bg-card border border-border rounded-3xl space-y-3">
            <Star className="w-10 h-10 text-muted-foreground mx-auto" />
            <h3 className="text-base font-bold text-foreground">No Reviews Submitted</h3>
            <p className="text-xs text-muted-foreground max-w-xs mx-auto">
              You haven&apos;t left any property reviews yet. Go to active rentals to submit your review.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-100 dark:border-emerald-900 shrink-0">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground text-sm sm:text-base leading-tight">
                        {rev.propertyTitle}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Landlord: {rev.landlordName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-1 rounded-full border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 font-bold text-xs">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    {rev.rating}.0
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-foreground/90 bg-muted/50 p-4 rounded-2xl border border-border/60 leading-relaxed italic">
                  &ldquo;{rev.comment}&rdquo;
                </p>

                <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    Reviewed on {rev.date}
                  </span>
                  <span className="font-medium text-emerald-600 dark:text-emerald-400">
                    Verified Stay
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
