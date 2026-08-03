import propertyAction from "@/app/features/property/actions/propertyAction";
import React from "react";
import { Building2, Plus } from "lucide-react";
import PropertiesListClient from "./components/PropertiesListClient";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getCurrentUser } from "../features/api/auth.api";

export default async function PropertiesPage() {
  const response = await propertyAction();
  const properties = Array.isArray(response?.data) ? response.data : [];

  const currentUserRes = await getCurrentUser();
  const user = currentUserRes?.data?.data || currentUserRes?.data;

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h1 className="text-3xl font-black tracking-tight text-foreground">
            Explore Properties
          </h1>
          <p className="text-sm text-muted-foreground">
            Discover your next home or rental property from our verified listings.
          </p>
        </div>
        {user?.role === "LANDLORD" && (
          <Link href="/landlord/properties/new">
            <Button className="rounded-2xl font-bold text-xs px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/25 flex items-center gap-1.5 cursor-pointer shrink-0">
              <Plus className="w-4 h-4" />
              Create Property
            </Button>
          </Link>
        )}
      </div>

      {properties.length === 0 ? (
        <div className="p-7 sm:p-12 text-center rounded-3xl bg-muted/30 border border-border space-y-3">
          <div className="w-14 h-14 bg-muted text-muted-foreground rounded-2xl flex items-center justify-center mx-auto">
            <Building2 className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-foreground">No Properties Found</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            There are currently no active property listings available. Please check back later.
          </p>
        </div>
      ) : (
        <PropertiesListClient properties={properties} />
      )}
    </div>
  );
}
