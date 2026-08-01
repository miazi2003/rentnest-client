import propertyAction from "@/app/(auth)/_action/propertyAction";
import React from "react";
import Link from "next/link";
import { Building2, MapPin, DollarSign, Calendar } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function PropertiesPage() {
  const response = await propertyAction();
  const properties = Array.isArray(response?.data) ? response.data : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="space-y-2 text-center sm:text-left">
        <h1 className="text-3xl font-black tracking-tight text-foreground">
          Explore Properties
        </h1>
        <p className="text-sm text-muted-foreground">
          Discover your next home or rental property from our verified listings.
        </p>
      </div>

      {properties.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-muted/30 border border-border space-y-3">
          <div className="w-14 h-14 bg-muted text-muted-foreground rounded-2xl flex items-center justify-center mx-auto">
            <Building2 className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-foreground">No Properties Found</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            There are currently no active property listings available. Please check back later.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property: any) => (
            <Card key={property.id} className="rounded-3xl overflow-hidden border-border/80 hover:shadow-xl transition-all duration-300">
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
                      <span className="truncate">{property.address || property.location || "Location N/A"}</span>
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

              <CardFooter className="p-5 pt-3 bg-muted/20">
                <Link href={`/dashboard/tenant`} className="w-full">
                  <Button className="w-full rounded-2xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white">
                    Apply for Rent
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
