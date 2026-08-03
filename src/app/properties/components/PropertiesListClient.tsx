"use client";

import { useMemo, useState } from "react";
import { Building2 } from "lucide-react";
import { PropertyCard } from "./PropertyCard";
import type { PropertyItem } from "./property.types";
import { PropertySearchFilters, type PropertyFilters } from "./PropertySearchFilters";

interface PropertiesListClientProps {
  properties: PropertyItem[];
}

export default function PropertiesListClient({ properties }: PropertiesListClientProps) {
  const emptyFilters: PropertyFilters = { query: "", category: "", maxPrice: "" };
  const [filters, setFilters] = useState<PropertyFilters>(emptyFilters);

  const categories = useMemo(() => Array.from(new Set(properties.map((property) => property.category?.name).filter((name): name is string => Boolean(name)))).sort(), [properties]);

  const filteredProperties = useMemo(() => {
    const query = filters.query.trim().toLowerCase();
    const maximumPrice = filters.maxPrice ? Number(filters.maxPrice) : null;

    return properties.filter((property) => {
      const searchableText = [property.title, property.description, property.location, property.address, property.category?.name, ...(property.amenities || [])].filter(Boolean).join(" ").toLowerCase();
      const price = Number(property.price);

      if (query && !searchableText.includes(query)) return false;
      if (filters.category && property.category?.name !== filters.category) return false;
      if (maximumPrice !== null && (!Number.isFinite(price) || price > maximumPrice)) return false;
      return true;
    });
  }, [filters, properties]);

  return (
    <div className="space-y-8">
      <PropertySearchFilters filters={filters} categories={categories} onChange={setFilters} onClear={() => setFilters(emptyFilters)} />

      {filteredProperties.length > 0 ? (
        <div className="grid grid-cols-1 gap-7 md:grid-cols-2 xl:grid-cols-3">
          {filteredProperties.map((property) => <PropertyCard key={property.id} property={property} />)}
        </div>
      ) : (
        <div className="rounded-[1.75rem] border border-dashed border-border bg-muted/25 px-6 py-16 text-center">
          <Building2 className="mx-auto size-10 text-muted-foreground/40" />
          <h2 className="mt-4 text-lg font-extrabold">No matching properties</h2>
          <p className="mt-2 text-xs text-muted-foreground">Try changing or clearing some of your search filters.</p>
        </div>
      )}
    </div>
  );
}
