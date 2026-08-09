"use client";

import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Building2, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { PropertyCard } from "./PropertyCard";
import { getPropertyAvailability, type PropertyItem } from "./property.types";
import {
  PropertySearchFilters,
  type PropertyFilters,
  type SortOption,
} from "./PropertySearchFilters";
import { Button } from "@/components/ui/button";

interface PropertiesListClientProps {
  properties: PropertyItem[];
}

const ITEMS_PER_PAGE = 6;

export default function PropertiesListClient({ properties }: PropertiesListClientProps) {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("query") || "";
  const initialCategory = searchParams.get("category") || "";

  const emptyFilters: PropertyFilters = {
    query: initialQuery,
    category: initialCategory,
    maxPrice: "",
    availability: "",
    sortBy: "default",
  };

  const [filters, setFilters] = useState<PropertyFilters>(emptyFilters);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(ITEMS_PER_PAGE);

  // Sync with searchParams if changed in URL
  useEffect(() => {
    const q = searchParams.get("query") || "";
    const cat = searchParams.get("category") || "";
    if (q !== filters.query || cat !== filters.category) {
      setFilters((prev) => ({ ...prev, query: q, category: cat }));
    }
  }, [searchParams]);

  // Reset to page 1 when filters or sort change
  const handleFilterChange = (newFilters: PropertyFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const categories = useMemo(() => {
    return Array.from(
      new Set(
        properties
          .map((property) => property.category?.name)
          .filter((name): name is string => Boolean(name))
      )
    ).sort();
  }, [properties]);

  // Filter & Sort Logic
  const filteredAndSortedProperties = useMemo(() => {
    const query = filters.query.trim().toLowerCase();
    const maximumPrice = filters.maxPrice ? Number(filters.maxPrice) : null;

    let result = properties.filter((property) => {
      const searchableText = [
        property.title,
        property.description,
        property.location,
        property.address,
        property.category?.name,
        ...(property.amenities || []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const price = Number(property.price);
      const avail = getPropertyAvailability(property);

      if (query && !searchableText.includes(query)) return false;
      if (filters.category && property.category?.name !== filters.category) return false;
      if (maximumPrice !== null && (!Number.isFinite(price) || price > maximumPrice)) return false;
      if (filters.availability && avail?.toLowerCase() !== filters.availability.toLowerCase()) {
        return false;
      }

      return true;
    });

    // Sorting
    if (filters.sortBy === "price-asc") {
      result = [...result].sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
    } else if (filters.sortBy === "price-desc") {
      result = [...result].sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
    } else if (filters.sortBy === "newest") {
      result = [...result].sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
    }

    return result;
  }, [filters, properties]);

  // Pagination Logic
  const totalItems = filteredAndSortedProperties.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const paginatedProperties = filteredAndSortedProperties.slice(startIndex, endIndex);

  return (
    <div className="space-y-8">
      {/* Search, Filter & Sort Header Bar */}
      <PropertySearchFilters
        filters={filters}
        categories={categories}
        onChange={handleFilterChange}
        onClear={() => handleFilterChange(emptyFilters)}
      />

      {/* Results Header Counter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-muted-foreground border-b border-border/40 pb-3">
        <p>
          Showing{" "}
          <span className="font-extrabold text-foreground">
            {totalItems > 0 ? startIndex + 1 : 0} - {endIndex}
          </span>{" "}
          of <span className="font-extrabold text-foreground">{totalItems}</span> verified properties
        </p>

        {(filters.query || filters.category || filters.maxPrice || filters.availability || filters.sortBy !== "default") && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleFilterChange(emptyFilters)}
            className="h-7 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 self-start sm:self-auto cursor-pointer"
          >
            <RotateCcw className="size-3 mr-1" /> Reset all filters
          </Button>
        )}
      </div>

      {/* Property Cards Grid */}
      {paginatedProperties.length > 0 ? (
        <div className="grid grid-cols-1 gap-7 md:grid-cols-2 xl:grid-cols-3">
          {paginatedProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      ) : (
        <div className="rounded-[1.75rem] border border-dashed border-border bg-card px-6 py-16 text-center space-y-4">
          <Building2 className="mx-auto size-12 text-muted-foreground/40" />
          <div className="space-y-1">
            <h2 className="text-lg font-extrabold text-foreground">No matching properties found</h2>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              We couldn't find any properties matching your current search parameters. Try adjusting your filters.
            </p>
          </div>
          <Button
            onClick={() => handleFilterChange(emptyFilters)}
            variant="outline"
            className="rounded-full text-xs font-bold px-6 cursor-pointer"
          >
            Clear Filters & Search
          </Button>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border">
          {/* Per Page Selector */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Show</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="h-8 rounded-lg border border-border bg-card px-2 text-xs font-bold text-foreground outline-none cursor-pointer"
            >
              <option value={6}>6 per page</option>
              <option value={9}>9 per page</option>
              <option value={12}>12 per page</option>
            </select>
          </div>

          {/* Page Buttons */}
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="rounded-xl cursor-pointer disabled:opacity-40"
              aria-label="Previous page"
            >
              <ChevronLeft className="size-4" />
            </Button>

            {Array.from({ length: totalPages }).map((_, index) => {
              const pageNum = index + 1;
              const isActive = pageNum === currentPage;
              return (
                <Button
                  key={pageNum}
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(pageNum)}
                  className={`size-8 rounded-xl text-xs font-bold cursor-pointer ${
                    isActive
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                      : "hover:bg-muted"
                  }`}
                >
                  {pageNum}
                </Button>
              );
            })}

            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="rounded-xl cursor-pointer disabled:opacity-40"
              aria-label="Next page"
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
