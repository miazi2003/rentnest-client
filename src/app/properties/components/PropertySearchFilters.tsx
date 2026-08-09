"use client";

import { useState } from "react";
import { ListFilter, Search, X, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export type SortOption = "default" | "price-asc" | "price-desc" | "newest";

export interface PropertyFilters {
  query: string;
  category: string;
  maxPrice: string;
  availability: string;
  sortBy: SortOption;
}

interface PropertySearchFiltersProps {
  filters: PropertyFilters;
  categories: string[];
  onChange: (filters: PropertyFilters) => void;
  onClear: () => void;
}

export function PropertySearchFilters({ filters, categories, onChange, onClear }: PropertySearchFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);
  const hasAdvancedFilters = Boolean(filters.category || filters.maxPrice || filters.availability);

  const update = (key: keyof PropertyFilters, value: string) =>
    onChange({ ...filters, [key]: value });

  return (
    <div className="flex items-center justify-end gap-2 w-full ml-auto flex-wrap sm:flex-nowrap">
      {/* Minimal Borderless Search Bar */}
      <div className="relative min-w-[200px] max-w-xs flex-1 sm:flex-none">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          value={filters.query}
          onChange={(event) => update("query", event.target.value)}
          placeholder="Search..."
          aria-label="Search properties"
          className="h-9 rounded-full border-0 bg-muted/60 dark:bg-card/80 pl-8 pr-7 text-xs font-medium text-foreground outline-none shadow-xs shadow-[0_4px_12px_-4px_rgba(15,23,42,0.12)] dark:shadow-none placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-emerald-500/40"
        />
        {filters.query && (
          <button
            type="button"
            onClick={() => update("query", "")}
            aria-label="Clear search query"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5"
          >
            <X className="size-3" />
          </button>
        )}
      </div>

      {/* Minimal Borderless Sort Selector */}
      <div className="relative flex items-center gap-1 rounded-full border-0 bg-muted/60 dark:bg-card/80 px-3 h-9 text-xs font-semibold shrink-0 shadow-xs shadow-[0_4px_12px_-4px_rgba(15,23,42,0.12)] dark:shadow-none">
        <ArrowUpDown className="size-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
        <select
          value={filters.sortBy}
          onChange={(e) => update("sortBy", e.target.value as SortOption)}
          aria-label="Sort properties"
          className="bg-transparent text-[11px] font-semibold text-foreground outline-none cursor-pointer pr-1"
        >
          <option value="default" className="bg-card text-foreground">Default</option>
          <option value="price-asc" className="bg-card text-foreground">Price: Low → High</option>
          <option value="price-desc" className="bg-card text-foreground">Price: High → Low</option>
          <option value="newest" className="bg-card text-foreground">Newest</option>
        </select>
      </div>

      {/* Minimal Borderless Filter Button */}
      <div className="relative shrink-0">
        <Button
          type="button"
          variant="ghost"
          onClick={() => setShowFilters((value) => !value)}
          className={`h-9 rounded-full border-0 px-3 text-[11px] font-semibold shadow-xs shadow-[0_4px_12px_-4px_rgba(15,23,42,0.12)] dark:shadow-none cursor-pointer ${
            hasAdvancedFilters
              ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
              : "bg-muted/60 dark:bg-card/80 text-foreground hover:bg-muted"
          }`}
        >
          <ListFilter className="size-3.5" /> Filter
          {hasAdvancedFilters && (
            <span className="size-1.5 rounded-full bg-emerald-500" />
          )}
        </Button>

        {/* Filter Popover */}
        {showFilters && (
          <div className="absolute right-0 top-11 z-30 w-64 rounded-2xl border-0 bg-white dark:bg-slate-900 p-4 shadow-2xl space-y-3.5 text-foreground">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Filter Properties</p>
              <button
                type="button"
                onClick={() => setShowFilters(false)}
                aria-label="Close filters"
                className="flex size-6 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 cursor-pointer"
              >
                <X className="size-3" />
              </button>
            </div>

            <div className="space-y-3">
              {/* Category Filter */}
              <div>
                <label htmlFor="category-filter" className="mb-1 block text-[10px] font-bold text-muted-foreground">
                  Category
                </label>
                <select
                  id="category-filter"
                  value={filters.category}
                  onChange={(event) => update("category", event.target.value)}
                  className="h-8 w-full rounded-lg border-0 bg-slate-100 dark:bg-slate-800 px-2.5 text-xs font-semibold text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-emerald-500/30 cursor-pointer"
                >
                  <option value="" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Maximum Price Filter */}
              <div>
                <label htmlFor="price-filter" className="mb-1 block text-[10px] font-bold text-muted-foreground">
                  Maximum Price
                </label>
                <select
                  id="price-filter"
                  value={filters.maxPrice}
                  onChange={(event) => update("maxPrice", event.target.value)}
                  className="h-8 w-full rounded-lg border-0 bg-slate-100 dark:bg-slate-800 px-2.5 text-xs font-semibold text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-emerald-500/30 cursor-pointer"
                >
                  <option value="" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Any Price</option>
                  <option value="1500" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Up to $1,500 / mo</option>
                  <option value="3000" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Up to $3,000 / mo</option>
                  <option value="5000" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Up to $5,000 / mo</option>
                  <option value="10000" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Up to $10,000 / mo</option>
                </select>
              </div>

              {/* Availability Filter */}
              <div>
                <label htmlFor="availability-filter" className="mb-1 block text-[10px] font-bold text-muted-foreground">
                  Availability
                </label>
                <select
                  id="availability-filter"
                  value={filters.availability}
                  onChange={(event) => update("availability", event.target.value)}
                  className="h-8 w-full rounded-lg border-0 bg-slate-100 dark:bg-slate-800 px-2.5 text-xs font-semibold text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-emerald-500/30 cursor-pointer"
                >
                  <option value="" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">All Statuses</option>
                  <option value="Available" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Available Now</option>
                  <option value="Rented" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Rented / Occupied</option>
                </select>
              </div>
            </div>

            {hasAdvancedFilters && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onClear}
                className="mt-1 h-7 w-full rounded-lg text-[10px] font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 cursor-pointer"
              >
                Clear Filters
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
