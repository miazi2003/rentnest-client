"use client";

import { useState } from "react";
import { ListFilter, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export interface PropertyFilters {
  query: string;
  category: string;
  maxPrice: string;
}

interface PropertySearchFiltersProps {
  filters: PropertyFilters;
  categories: string[];
  onChange: (filters: PropertyFilters) => void;
  onClear: () => void;
}

export function PropertySearchFilters({ filters, categories, onChange, onClear }: PropertySearchFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);
  const hasAdvancedFilters = Boolean(filters.category || filters.maxPrice);
  const update = (key: keyof PropertyFilters, value: string) => onChange({ ...filters, [key]: value });

  return (
    <div className="relative flex w-full items-center gap-2 sm:w-auto">
      <div className="relative min-w-0 flex-1 sm:w-64 sm:flex-none">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-slate-500" />
        <Input
          type="search"
          value={filters.query}
          onChange={(event) => update("query", event.target.value)}
          placeholder="Search properties"
          aria-label="Search properties"
          className="h-9 rounded-lg border-0 bg-white pl-9 pr-3 text-[11px] shadow-[0_5px_18px_-10px_rgba(15,23,42,0.35)] outline-none placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-emerald-500/30 dark:bg-card"
        />
      </div>

      <Button
        type="button"
        variant="ghost"
        onClick={() => setShowFilters((value) => !value)}
        className={`h-9 shrink-0 rounded-lg bg-white px-3 text-[11px] font-bold shadow-[0_5px_18px_-10px_rgba(15,23,42,0.35)] hover:bg-slate-50 dark:bg-card dark:hover:bg-slate-900 ${hasAdvancedFilters ? "text-emerald-700 dark:text-emerald-300" : "text-slate-700 dark:text-slate-200"}`}
      >
        <ListFilter className="size-3.5" /> Filter
        {hasAdvancedFilters && <span className="size-1.5 rounded-full bg-emerald-500" />}
      </Button>

      {showFilters && (
        <div className="absolute right-0 top-12 z-20 w-64 rounded-2xl bg-white p-4 shadow-[0_22px_55px_-20px_rgba(15,23,42,0.35)] dark:bg-card">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground">Filters</p>
            <button type="button" onClick={() => setShowFilters(false)} aria-label="Close filters" className="flex size-7 items-center justify-center rounded-full bg-muted text-muted-foreground"><X className="size-3.5" /></button>
          </div>

          <div className="mt-4 space-y-4">
            <div>
              <label htmlFor="category-filter" className="mb-1.5 block text-[10px] font-bold text-muted-foreground">Category</label>
              <select id="category-filter" value={filters.category} onChange={(event) => update("category", event.target.value)} className="h-10 w-full rounded-xl border-0 bg-muted px-3 text-xs font-semibold outline-none focus:ring-2 focus:ring-emerald-500/20">
                <option value="">All categories</option>
                {categories.map((category) => <option key={category}>{category}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="price-filter" className="mb-1.5 block text-[10px] font-bold text-muted-foreground">Maximum price</label>
              <select id="price-filter" value={filters.maxPrice} onChange={(event) => update("maxPrice", event.target.value)} className="h-10 w-full rounded-xl border-0 bg-muted px-3 text-xs font-semibold outline-none focus:ring-2 focus:ring-emerald-500/20">
                <option value="">Any price</option>
                <option value="10000">Up to $10,000</option>
                <option value="25000">Up to $25,000</option>
                <option value="50000">Up to $50,000</option>
                <option value="100000">Up to $100,000</option>
              </select>
            </div>
          </div>

          {hasAdvancedFilters && <Button type="button" variant="ghost" size="sm" onClick={onClear} className="mt-4 h-8 w-full rounded-xl text-[10px] font-bold text-rose-600 hover:bg-rose-50">Clear filters</Button>}
        </div>
      )}
    </div>
  );
}
