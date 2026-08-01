"use client";

import React from "react";
import Link from "next/link";
import { Building2, MapPin, Eye } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface PropertyItem {
  id: string;
  title: string;
  description?: string;
  price?: number | string;
  address?: string;
  location?: string;
}

interface PropertiesListClientProps {
  properties: PropertyItem[];
}

export default function PropertiesListClient({ properties }: PropertiesListClientProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property) => (
        <Card
          key={property.id}
          className="rounded-3xl overflow-hidden border-border/80 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
        >
          <div>
            <CardHeader className="p-5 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold text-foreground line-clamp-1">
                    {property.title}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span className="truncate">
                      {property.address || property.location || "Location N/A"}
                    </span>
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="px-5 py-3 space-y-2 text-xs">
              <p className="text-muted-foreground line-clamp-2">
                {property.description}
              </p>
              <div className="flex justify-between items-center pt-2 border-t border-border/60">
                <span className="text-muted-foreground">Price per day:</span>
                <span className="font-extrabold text-foreground text-sm flex items-center">
                  ${Number(property.price || 0).toLocaleString()}
                </span>
              </div>
            </CardContent>
          </div>

          <CardFooter className="p-5 pt-3 bg-muted/20">
            <Link href={`/properties/${property.id}`} className="w-full">
              <Button className="w-full rounded-2xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 cursor-pointer">
                <Eye className="w-4 h-4" />
                View Details
              </Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
