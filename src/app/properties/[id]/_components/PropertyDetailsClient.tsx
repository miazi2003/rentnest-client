"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Building2,
  MapPin,
  Tag,
  User,
  ArrowLeft,
  Calendar,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import RentModal from "../../components/RentModal";
import { useAuth } from "@/app/features/auth/hooks/use-auth";

interface PropertyDetailsClientProps {
  property: {
    id: string;
    title: string;
    description: string;
    price: number | string;
    address?: string;
    location?: string;
    availability?: string;
    category?: {
      name: string;
    };
    landlord?: {
      name: string;
      email: string;
      phone?: string;
    };
  };
}



import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function PropertyDetailsClient({ property }: PropertyDetailsClientProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  console.log(user?.role , "user role")

  const handleApplyClick = () => {
    if (!user) {
      toast.error("Please log in to apply for rent");
      router.push("/login");
      return;
    }
    if (user.role !== "TENANT") {
      toast.error("Only tenants can apply for property rentals");
      return;
    }
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back Button */}
      <Link href="/properties">
        <Button
          variant="outline"
          size="sm"
          className="rounded-2xl text-xs font-bold gap-2 border-border"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Properties
        </Button>
      </Link>

      {/* Main Property Card Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          {/* Title & Badge */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300">
                {property.availability || "AVAILABLE"}
              </span>
              {property.category?.name && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-muted text-muted-foreground border border-border flex items-center gap-1">
                  <Tag className="w-3 h-3 text-emerald-600" />
                  {property.category.name}
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
              {property.title}
            </h1>

            <p className="text-sm text-muted-foreground flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
              {property.address || property.location || "Location N/A"}
            </p>
          </div>

          {/* Image / Gallery Placeholder Banner */}
          <div className="w-full h-64 sm:h-80 rounded-3xl bg-gradient-to-tr from-emerald-950/40 via-teal-900/20 to-slate-900 border border-border flex flex-col items-center justify-center text-center p-6 space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
              <Building2 className="w-8 h-8" />
            </div>
            <p className="font-bold text-foreground text-sm">{property.title}</p>
            <p className="text-xs text-muted-foreground">Verified Nest Property Listing</p>
          </div>

          {/* Description Section */}
          <div className="space-y-3 pt-4 border-t border-border">
            <h3 className="text-lg font-bold text-foreground">Property Description</h3>
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
              {property.description}
            </p>
          </div>
        </div>

        {/* Right Sidebar: Rent Action Box */}
        <div className="space-y-6">
          <Card className="rounded-3xl border-border shadow-xl p-6 space-y-6 sticky top-24">
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground font-semibold">Rent Price</span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-foreground">
                  ${Number(property.price || 0).toLocaleString()}
                </span>
                <span className="text-xs text-muted-foreground font-semibold">/ day</span>
              </div>
            </div>

            {/* Landlord Info Card */}
            {property.landlord && (
              <div className="p-4 rounded-2xl bg-muted/40 border border-border/80 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">{property.landlord.name}</p>
                    <p className="text-[11px] text-muted-foreground">Property Owner</p>
                  </div>
                </div>
              </div>
            )}

            {/* Apply for Rent CTA Button */}
            {property.availability === "UNAVAILABLE" ? (
              <Button
                disabled
                className="w-full rounded-2xl py-3 text-sm font-bold bg-muted text-muted-foreground border border-border cursor-not-allowed opacity-80 gap-2"
              >
                <Calendar className="w-4 h-4 opacity-50" />
                Unavailable
              </Button>
            ) : !user || user.role === "TENANT" ? (
              <Button
                onClick={handleApplyClick}
                className="w-full rounded-2xl py-3 text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/25 gap-2 cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                Apply for Rent
              </Button>
            ) : user.role === "LANDLORD" ? (
              <Button
                disabled
                className="w-full rounded-2xl py-3 text-xs font-bold bg-muted text-muted-foreground border border-border cursor-not-allowed opacity-80"
              >
                Landlords cannot apply for rentals
              </Button>
            ) : (
              <Button
                disabled
                className="w-full rounded-2xl py-3 text-xs font-bold bg-muted text-muted-foreground border border-border cursor-not-allowed opacity-80"
              >
                Admin Account
              </Button>
            )}

            <div className="space-y-2 pt-2 border-t border-border/60 text-xs text-muted-foreground">
              <p className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                Verified Availability & Owner
              </p>
              <p className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                Secure Payment via Stripe
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* Rent Application Modal */}
      {user?.role === "TENANT" && (
        <RentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          property={{
            id: property.id,
            title: property.title,
            price: property.price,
          }}
        />
      )}
    </div>
  );
}
