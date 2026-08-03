"use client";

import React, { useState } from "react";
import { Star } from "lucide-react";
import { IRentalRequest } from "../types/tenant.types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { handleGetPropertyReviewsAction } from "@/app/features/review/actions/reviewActions";

interface LeaveReviewModalProps {
  request: IRentalRequest | null;
  onClose: () => void;
  onSubmitReview: (request: IRentalRequest, rating: number, comment: string) => void;
}

export const LeaveReviewModal: React.FC<LeaveReviewModalProps> = ({
  request,
  onClose,
  onSubmitReview,
}) => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);

  const propertyId = request?.propertyId || request?.property?.id || request?.id;

  React.useEffect(() => {
    if (!propertyId) return;
    handleGetPropertyReviewsAction(propertyId)
      .then((res) => {
        if (res.ok && res.data) {
          const list = Array.isArray(res.data.data)
            ? res.data.data
            : Array.isArray(res.data)
            ? res.data
            : [];
          if (list.length > 0) {
            setAlreadyReviewed(true);
          } else {
            setAlreadyReviewed(false);
          }
        }
      })
      .catch(() => setAlreadyReviewed(false));
  }, [propertyId]);

  const isOpen = Boolean(request);
  if (!request) return null;

  const propertyTitle =
    request.property?.title || request.propertyTitle || "Rental Property";
  const landlordName =
    request.landlord?.name || request.landlordName || "Landlord";

  const handleSubmit = async () => {
    if (isSubmitting || alreadyReviewed) return;
    setIsSubmitting(true);
    try {
      await onSubmitReview(request, rating, reviewComment);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md rounded-3xl p-6 gap-5 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-200/80 dark:border-slate-800 shadow-2xl">
        <DialogHeader className="gap-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-100 dark:border-emerald-900 shrink-0">
              <Star className="w-6 h-6 fill-current" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white">
                Leave a Property Review
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
                Share your living experience with future tenants
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Target Property info */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-1">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Property
          </p>
          <p className="font-bold text-slate-900 dark:text-white text-sm">
            {propertyTitle}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Landlord: {landlordName}</p>
        </div>

        {/* Star Rating selector */}
        <div className="space-y-2 text-center">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
            Your Rating ({hoverRating || rating} / 5 Stars)
          </label>
          <div className="flex justify-center items-center gap-2 py-2">
            {[1, 2, 3, 4, 5].map((starVal) => (
              <button
                key={starVal}
                type="button"
                onMouseEnter={() => setHoverRating(starVal)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(starVal)}
                className="p-1 rounded-lg hover:scale-125 transition-transform cursor-pointer focus:outline-none"
              >
                <Star
                  className={`w-8 h-8 transition-colors ${
                    starVal <= (hoverRating || rating)
                      ? "text-amber-400 fill-amber-400 drop-shadow-xs"
                      : "text-slate-300 dark:text-slate-700"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Already Reviewed Alert */}
        {alreadyReviewed && (
          <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs">
            <p className="font-bold">Review Already Submitted</p>
            <p className="text-[11px] text-amber-700 dark:text-amber-300">
              You have already reviewed this property. Duplicate reviews are disabled.
            </p>
          </div>
        )}

        {/* Review Comment Area */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Written Feedback
          </label>
          <textarea
            rows={3}
            disabled={alreadyReviewed}
            placeholder="How is the property quality, location convenience, and landlord response time?"
            value={reviewComment}
            onChange={(e) => setReviewComment(e.target.value)}
            className="w-full p-3 text-xs sm:text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/40 text-slate-900 dark:text-white disabled:opacity-60"
          />
        </div>

        {/* Dialog Footer Actions */}
        <DialogFooter className="flex-col-reverse items-stretch gap-3 pt-2 sm:flex-row sm:items-center">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="w-1/3 rounded-xl text-xs border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={isSubmitting || alreadyReviewed}
            onClick={handleSubmit}
            className={`w-2/3 rounded-xl font-bold text-xs shadow-md gap-2 ${
              alreadyReviewed
                ? "bg-slate-400 text-white cursor-not-allowed opacity-80"
                : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20 cursor-pointer"
            }`}
          >
            {alreadyReviewed ? (
              <>
                <Star className="w-4 h-4 text-amber-300 fill-amber-300" />
                Already Reviewed
              </>
            ) : isSubmitting ? (
              <span className="animate-pulse">Submitting Review...</span>
            ) : (
              <>
                <Star className="w-4 h-4 fill-current" />
                Submit Review
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
