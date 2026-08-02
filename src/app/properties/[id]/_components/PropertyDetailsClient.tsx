"use client";

import Image from "next/image";
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
  latitude: number;
  longitude: number;
  images: string[];
  availability: string;
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
    createdAt: string;
    updatedAt: string;
  };
  reviews: PropertyReview[];
  avgRating: number;
  totalReviews: number;
}

interface PropertyDetailsClientProps {
  property: PropertyDetails;
}

const formatDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
};

function RatingStars({ rating }: { rating: number }) {
  const safeRating = Math.max(0, Math.min(5, rating));
  return (
    <div className="flex items-center gap-0.5" aria-label={`${safeRating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`size-4 ${
            star <= Math.round(safeRating)
              ? "fill-amber-400 text-amber-400"
              : "fill-slate-100 text-slate-300 dark:fill-slate-900 dark:text-slate-700"
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
    <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-4 transition-all duration-300 hover:border-emerald-200 hover:bg-emerald-50/40 dark:border-border/60 dark:bg-muted/25 dark:hover:border-emerald-900/70 dark:hover:bg-emerald-950/10">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-emerald-100 bg-white text-emerald-600 dark:border-emerald-900/60 dark:bg-background">
        <Icon className="size-[18px]" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="mt-1 break-words text-sm font-bold text-foreground">{value}</p>
      </div>
    </div>
  );
}

export default function PropertyDetailsClient({ property }: PropertyDetailsClientProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const heroImage = property.images?.[0];
  const reviews = Array.isArray(property.reviews) ? property.reviews : [];
  const isAvailable = property.availability.toUpperCase() === "AVAILABLE";

  const handleRentNow = () => {
    if (!user) {
      toast.error("Please log in to rent this property");
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
    <div className="min-h-full bg-[#FAFAFA] dark:bg-background">
      <div className="w-full space-y-7 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="group relative aspect-[16/7] min-h-[260px] w-full overflow-hidden bg-slate-100 sm:min-h-[360px] lg:min-h-[460px] dark:bg-muted">
          {heroImage ? (
            <Image
              src={heroImage}
              alt={property.title}
              fill
              priority
              unoptimized
              sizes="100vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-slate-100 via-white to-emerald-50 text-slate-400 dark:from-slate-900 dark:via-slate-950 dark:to-emerald-950/30">
              <Building2 className="size-14" />
              <p className="mt-3 text-sm font-semibold">No property image available</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 items-start gap-7 lg:grid-cols-[minmax(0,7fr)_minmax(300px,3fr)]">
          <main className="min-w-0 space-y-7">
            <section className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className={`border px-3 py-1 text-[11px] font-bold ${isAvailable ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300" : "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-800 dark:bg-rose-950/50 dark:text-rose-300"}`}>
                  <CheckCircle2 className="mr-1 size-3.5" />{property.availability}
                </Badge>
                <Badge variant="outline" className="border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 dark:border-border dark:bg-card dark:text-slate-300">
                  <Tag className="mr-1 size-3.5 text-emerald-600" />{property.category.name}
                </Badge>
              </div>

              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                <div className="min-w-0">
                  <h1 className="text-3xl font-black tracking-[-0.03em] text-slate-950 dark:text-white sm:text-4xl lg:text-5xl">{property.title}</h1>
                  <p className="mt-3 flex items-start gap-2 text-sm text-muted-foreground"><MapPin className="mt-0.5 size-4 shrink-0 text-emerald-600" />{property.address}</p>
                </div>
                <div className="shrink-0 md:text-right">
                  <p className="text-3xl font-black tracking-tight text-emerald-700 dark:text-emerald-400">${Number(property.price).toLocaleString()}</p>
                  <p className="text-xs font-medium text-muted-foreground">per month</p>
                </div>
              </div>

              <div className="flex w-fit items-center gap-3 rounded-xl border border-slate-200/80 bg-white px-4 py-2.5 dark:border-border dark:bg-card">
                <RatingStars rating={property.avgRating} />
                <Separator orientation="vertical" className="h-5" />
                <span className="text-sm font-black text-foreground">{property.avgRating.toFixed(1)}</span>
                <span className="text-xs text-muted-foreground">({property.totalReviews} {property.totalReviews === 1 ? "review" : "reviews"})</span>
              </div>
            </section>

            <Card className="rounded-2xl border border-slate-200/70 bg-white shadow-none transition-colors duration-300 hover:border-slate-300 dark:border-border dark:bg-card dark:hover:border-slate-700">
              <CardHeader><CardTitle className="text-lg font-black">Description</CardTitle><CardDescription>About this property</CardDescription></CardHeader>
              <CardContent><p className="whitespace-pre-line text-sm leading-7 text-slate-600 dark:text-slate-300">{property.description}</p></CardContent>
            </Card>

            <Card className="rounded-2xl border border-slate-200/70 bg-white shadow-none dark:border-border dark:bg-card">
              <CardHeader><CardTitle className="text-lg font-black">Property Information</CardTitle><CardDescription>Listing and landlord details</CardDescription></CardHeader>
              <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <InformationItem icon={Tag} label="Category" value={property.category.name} />
                <InformationItem icon={UserRound} label="Landlord" value={property.landlord.name} />
                <InformationItem icon={Mail} label="Email" value={property.landlord.email} />
                <InformationItem icon={Phone} label="Phone" value={property.landlord.phone} />
                <InformationItem icon={CalendarDays} label="Created" value={formatDate(property.createdAt)} />
                <InformationItem icon={Clock3} label="Updated" value={formatDate(property.updatedAt)} />
              </CardContent>
            </Card>

            <section className="space-y-4">
              <div className="flex items-end justify-between gap-4">
                <div><h2 className="flex items-center gap-2 text-xl font-black text-foreground"><MessageSquare className="size-5 text-emerald-600" />Reviews</h2><p className="mt-1 text-sm text-muted-foreground">Tenant feedback for this property</p></div>
                <span className="text-xs font-semibold text-muted-foreground">{property.totalReviews} total</span>
              </div>

              {reviews.length === 0 ? (
                <Card className="rounded-2xl border border-dashed border-slate-300 bg-white/70 shadow-none dark:border-border dark:bg-card/70"><CardContent className="flex flex-col items-center py-12 text-center"><div className="flex size-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-muted"><MessageSquare className="size-6" /></div><h3 className="mt-4 text-sm font-bold">No reviews yet</h3><p className="mt-1 text-xs text-muted-foreground">This property has not received any reviews.</p></CardContent></Card>
              ) : (
                <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                  {reviews.map((review) => (
                    <Card key={review.id} className="rounded-2xl border border-slate-200/70 bg-white shadow-none transition-colors duration-300 hover:border-emerald-200 dark:border-border dark:bg-card dark:hover:border-emerald-900/70">
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between gap-3"><div className="flex min-w-0 items-center gap-3"><div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-black text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">{review.tenant.name.charAt(0).toUpperCase()}</div><div className="min-w-0"><p className="truncate text-sm font-bold">{review.tenant.name}</p><p className="text-[11px] text-muted-foreground">{formatDate(review.createdAt)}</p></div></div><RatingStars rating={review.rating} /></div>
                        <p className="mt-4 rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-600 dark:bg-muted/30 dark:text-slate-300">{review.comment}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </section>
          </main>

          <aside className="lg:sticky lg:top-6">
            <Card className="rounded-2xl border border-slate-200/70 bg-white shadow-none dark:border-border dark:bg-card">
              <CardContent className="space-y-6 p-6">
                <div><p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Monthly rent</p><div className="mt-1 flex items-end gap-1.5"><span className="text-4xl font-black tracking-tight text-slate-950 dark:text-white">${Number(property.price).toLocaleString()}</span><span className="pb-1 text-xs font-medium text-muted-foreground">/ month</span></div></div>
                <Separator />
                <div className="space-y-3"><div className="flex items-center justify-between text-sm"><span className="text-muted-foreground">Availability</span><span className={`font-bold ${isAvailable ? "text-emerald-600" : "text-rose-600"}`}>{property.availability}</span></div><div className="flex items-center justify-between text-sm"><span className="text-muted-foreground">Category</span><span className="font-bold text-foreground">{property.category.name}</span></div></div>
                <Separator />
                <div><p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Landlord</p><div className="mt-3 flex items-center gap-3"><div className="flex size-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"><UserRound className="size-5" /></div><div className="min-w-0"><p className="truncate text-sm font-bold">{property.landlord.name}</p><p className="truncate text-xs text-muted-foreground">{property.landlord.email}</p></div></div></div>
                <div className="space-y-2.5"><Button onClick={handleRentNow} disabled={!isAvailable} className="h-11 w-full rounded-xl bg-emerald-600 text-sm font-bold text-white shadow-none transition-colors duration-300 hover:bg-emerald-700 disabled:cursor-not-allowed">Rent Now</Button><a href={`mailto:${property.landlord.email}`} className="block"><Button type="button" variant="outline" className="h-11 w-full rounded-xl text-sm font-bold shadow-none transition-colors duration-300 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"><Mail className="mr-2 size-4" />Contact Landlord</Button></a></div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>

      {user?.role === "TENANT" && (
        <RentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} property={{ id: property.id, title: property.title, price: property.price }} />
      )}
    </div>
  );
}
