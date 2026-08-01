import propertyAction from "@/app/features/property/actions/propertyAction";
import React from "react";
import { Building2 } from "lucide-react";
import PropertiesListClient from "./components/PropertiesListClient";

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
        <PropertiesListClient properties={properties} />
      )}
    </div>
  );
}
