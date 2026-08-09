"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Star,
  Tag,
  UserRound,
  Sparkles,
  Bed,
  Bath,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/app/features/auth/hooks/use-auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import RentModal from "../../components/RentModal";
import { PropertyCard } from "../../components/PropertyCard";
import type { PropertyItem } from "../../components/property.types";

interface PropertyReview {
  id: string;
  propertyId: string;
  tenantId: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  tenant: {
    id: string;
    name: string;
    email: string;
  };
}

interface PropertyDetails {
  id: string;
  title: string;
  description: string;
  price: string | number;
  address: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  images: string[];
  availability: string;
  amenities?: string[];
  bedrooms?: number;
  bathrooms?: number;
  landlordId: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  landlord: {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
  };
  category: {
    id: string;
    name: string;
    description: string;
    createdAt?: string;
    updatedAt?: string;
  };
  reviews: PropertyReview[];
  avgRating: number;
  totalReviews: number;
}

interface PropertyDetailsClientProps {
  property: PropertyDetails;
  relatedProperties?: PropertyItem[];
}

const formatDate = (value?: string) => {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
};

function RatingStars({ rating }: { rating: number }) {
  const safeRating = Math.max(0, Math.min(5, rating || 0));
  return (
    <div className="flex items-center gap-0.5" aria-label={`${safeRating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`size-4 ${
            star <= Math.round(safeRating)
              ? "fill-amber-400 text-amber-400"
              : "fill-muted text-muted-foreground/30"
          }`}
        />
      ))}
    </div>
  );
}

function InformationItem({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Tag;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4 transition-all duration-300">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
        <Icon className="size-[18px]" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className="mt-1 break-words text-xs font-extrabold text-foreground">{value}</p>
      </div>
    </div>
  );
}

export default function PropertyDetailsClient({
  property,
  relatedProperties = [],
}: PropertyDetailsClientProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const images = property.images && property.images.length > 0 ? property.images : [];
  const currentImage = images[selectedImageIndex] || images[0];
  const reviews = Array.isArray(property.reviews) ? property.reviews : [];
  const isAvailable = property.availability?.toUpperCase() === "AVAILABLE";
  const locationText = property.location || property.address;

  const handleRentNow = () => {
    if (!user) {
      toast.error("Please log in to submit a rental request");
      router.push("/login");
      return;
    }
    if (user.role !== "TENANT") {
      toast.error("Only tenants can submit rental requests");
      return;
    }
    if (!isAvailable) return;
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-full bg-background text-foreground pb-16">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <Link href="/properties" className="hover:text-foreground transition-colors">Properties</Link>
          <span>/</span>
          <span className="font-semibold text-foreground truncate max-w-xs">{property.title}</span>
        </div>

        {/* 1. Image / Media Gallery Section */}
        <section className="space-y-4">
          <div className="group relative aspect-[16/8] min-h-[300px] sm:min-h-[420px] lg:min-h-[500px] w-full overflow-hidden rounded-3xl border border-border bg-muted">
            {currentImage ? (
              <Image
                src={currentImage}
                alt={property.title}
                fill
                priority
                unoptimized
                sizes="100vw"
                className="object-cover transition-transform duration-700 ease-out"
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center bg-muted text-muted-foreground">
                <Building2 className="size-16" />
                <p className="mt-3 text-sm font-semibold">No property image available</p>
              </div>
            )}
          </div>

          {/* Thumbnail Gallery Row (Only if multiple images exist in backend) */}
          {images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  aria-label={`View property image ${idx + 1}`}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative size-20 shrink-0 overflow-hidden rounded-2xl border-2 transition-all cursor-pointer ${
                    selectedImageIndex === idx
                      ? "border-emerald-500 scale-105 shadow-md"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image src={img} alt={`Thumbnail ${idx + 1}`} fill unoptimized className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </section>

        {/* 2. Main Content Grid */}
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,7fr)_minmax(320px,3.5fr)]">
          <main className="min-w-0 space-y-8">
            {/* Property Overview */}
            <section className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  className={`border px-3 py-1 text-[11px] font-bold ${
                    isAvailable
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                      : "border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300"
                  }`}
                >
                  <CheckCircle2 className="mr-1 size-3.5" />
                  {property.availability}
                </Badge>
                {property.category?.name && (
                  <Badge variant="outline" className="border-border bg-card px-3 py-1 text-[11px] font-semibold text-foreground">
                    <Tag className="mr-1.5 size-3.5 text-emerald-600 dark:text-emerald-400" />
                    {property.category.name}
                  </Badge>
                )}
              </div>

              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                <div className="min-w-0">
                  <h1 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl lg:text-5xl font-heading">
                    {property.title}
                  </h1>
                  <p className="mt-3 flex items-start gap-2 text-sm text-muted-foreground">
                    <MapPin className="mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                    {locationText}
                  </p>
                </div>
                <div className="shrink-0 md:text-right">
                  <p className="text-3xl sm:text-4xl font-black tracking-tight text-emerald-600 dark:text-emerald-400">
                    ${Number(property.price).toLocaleString()}
                  </p>
                  <p className="text-xs font-semibold text-muted-foreground">per month</p>
                </div>
              </div>

              {/* Rating Pill */}
              <div className="flex w-fit items-center gap-3 rounded-2xl border border-border bg-card px-4 py-2.5 shadow-xs">
                <RatingStars rating={property.avgRating || 0} />
                <Separator orientation="vertical" className="h-4" />
                <span className="text-xs font-black text-foreground">
                  {(property.avgRating || 0).toFixed(1)}
                </span>
                <span className="text-xs text-muted-foreground">
                  ({property.totalReviews || 0} {property.totalReviews === 1 ? "review" : "reviews"})
                </span>
              </div>
            </section>

            {/* Description Card */}
            <Card className="rounded-3xl border border-border bg-card shadow-xs">
              <CardHeader>
                <CardTitle className="text-lg font-bold">Property Description</CardTitle>
                <CardDescription className="text-xs">Overview and details provided by the landlord</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                  {property.description}
                </p>
              </CardContent>
            </Card>

            {/* Key Specifications & Details */}
            <Card className="rounded-3xl border border-border bg-card shadow-xs">
              <CardHeader>
                <CardTitle className="text-lg font-bold">Key Information & Specifications</CardTitle>
                <CardDescription className="text-xs">Listing metadata and landlord information</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {property.category?.name && (
                  <InformationItem icon={Tag} label="Category" value={property.category.name} />
                )}
                {property.bedrooms !== undefined && (
                  <InformationItem icon={Bed} label="Bedrooms" value={`${property.bedrooms} Beds`} />
                )}
                {property.bathrooms !== undefined && (
                  <InformationItem icon={Bath} label="Bathrooms" value={`${property.bathrooms} Baths`} />
                )}
                {property.landlord?.name && (
                  <InformationItem icon={UserRound} label="Landlord" value={property.landlord.name} />
                )}
                {property.landlord?.email && (
                  <InformationItem icon={Mail} label="Email" value={property.landlord.email} />
                )}
                {property.landlord?.phone && (
                  <InformationItem icon={Phone} label="Phone" value={property.landlord.phone} />
                )}
                <InformationItem icon={CalendarDays} label="Listed Date" value={formatDate(property.createdAt)} />
                <InformationItem icon={Clock3} label="Last Updated" value={formatDate(property.updatedAt)} />
              </CardContent>
            </Card>

            {/* Amenities Section (If available in property payload) */}
            {property.amenities && property.amenities.length > 0 && (
              <Card className="rounded-3xl border border-border bg-card shadow-xs">
                <CardHeader>
                  <CardTitle className="text-lg font-bold">Included Amenities</CardTitle>
                  <CardDescription className="text-xs">Features and conveniences available at this property</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {property.amenities.map((amenity) => (
                      <span
                        key={amenity}
                        className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-xs font-bold text-emerald-700 dark:text-emerald-300"
                      >
                        <CheckCircle2 className="size-3.5" />
                        {amenity}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Reviews Section */}
            <section className="space-y-4">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <h2 className="flex items-center gap-2 text-xl font-bold text-foreground font-heading">
                    <MessageSquare className="size-5 text-emerald-600 dark:text-emerald-400" />
                    Property Reviews
                  </h2>
                  <p className="mt-1 text-xs text-muted-foreground">Authentic tenant feedback and ratings</p>
                </div>
                <span className="text-xs font-semibold text-muted-foreground">
                  {property.totalReviews || 0} total
                </span>
              </div>

              {reviews.length === 0 ? (
                <Card className="rounded-3xl border border-dashed border-border bg-card/60 shadow-xs">
                  <CardContent className="flex flex-col items-center py-12 text-center">
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                      <MessageSquare className="size-6" />
                    </div>
                    <h3 className="mt-4 text-sm font-bold text-foreground">No Reviews Yet</h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      This property has not received any tenant reviews yet.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                  {reviews.map((review) => (
                    <Card key={review.id} className="rounded-3xl border border-border bg-card shadow-xs">
                      <CardContent className="p-5 space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-sm font-black text-emerald-700 dark:text-emerald-300">
                              {review.tenant?.name ? review.tenant.name.charAt(0).toUpperCase() : "T"}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-foreground">{review.tenant?.name || "Tenant"}</p>
                              <p className="text-[10px] text-muted-foreground">{formatDate(review.createdAt)}</p>
                            </div>
                          </div>
                          <RatingStars rating={review.rating} />
                        </div>
                        <p className="rounded-2xl bg-muted/40 p-3.5 text-xs leading-relaxed text-muted-foreground">
                          {review.comment}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </section>
          </main>

          {/* Sidebar Sticky Booking / Request Card */}
          <aside className="lg:sticky lg:top-24 space-y-6">
            <Card className="rounded-3xl border border-border bg-card shadow-lg p-2">
              <CardContent className="space-y-6 p-6">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Monthly Rent</p>
                  <div className="mt-1 flex items-end gap-1">
                    <span className="text-4xl font-black tracking-tight text-foreground font-heading">
                      ${Number(property.price).toLocaleString()}
                    </span>
                    <span className="pb-1 text-xs font-medium text-muted-foreground">/ month</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Availability</span>
                    <span className={`font-extrabold ${isAvailable ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600"}`}>
                      {property.availability}
                    </span>
                  </div>
                  {property.category?.name && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Category</span>
                      <span className="font-bold text-foreground">{property.category.name}</span>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Landlord Info */}
                {property.landlord && (
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Landlord Details</p>
                    <div className="mt-3 flex items-center gap-3">
                      <div className="flex size-11 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                        <UserRound className="size-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-xs font-extrabold text-foreground">{property.landlord.name}</p>
                        <p className="truncate text-[11px] text-muted-foreground">{property.landlord.email}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-3 pt-2">
                  <Button
                    onClick={handleRentNow}
                    disabled={!isAvailable}
                    className="h-12 w-full rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    Request Rental <ArrowUpRight className="size-4" />
                  </Button>

                  {property.landlord?.email && (
                    <a href={`mailto:${property.landlord.email}`} className="block">
                      <Button
                        type="button"
                        variant="outline"
                        className="h-11 w-full rounded-2xl border-border text-xs font-bold hover:bg-muted cursor-pointer flex items-center justify-center gap-2"
                      >
                        <Mail className="size-4 text-emerald-600 dark:text-emerald-400" />
                        Contact Landlord
                      </Button>
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-5 space-y-2">
              <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                <ShieldCheck className="size-4" /> RentNest Guarantee
              </span>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                All rental requests and payments on RentNest are protected via Stripe Hosted Checkout with verified receipt tracking.
              </p>
            </div>
          </aside>
        </div>

        {/* 3. Related Properties Section (Using REAL Property Data) */}
        {relatedProperties.length > 0 && (
          <section className="pt-12 border-t border-border space-y-6">
            <div className="flex items-end justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                  <Sparkles className="size-3.5" /> Similar Listings
                </span>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground font-heading mt-1">
                  Related Properties
                </h2>
              </div>
              <Link
                href="/properties"
                className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline shrink-0"
              >
                View all properties <ArrowUpRight className="size-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-7 md:grid-cols-2 xl:grid-cols-3">
              {relatedProperties.map((relatedProp) => (
                <PropertyCard key={relatedProp.id} property={relatedProp} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Existing Rent Modal */}
      {user?.role === "TENANT" && (
        <RentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          property={{ id: property.id, title: property.title, price: property.price }}
        />
      )}
    </div>
  );
}
