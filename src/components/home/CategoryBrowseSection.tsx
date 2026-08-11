"use client";

import Link from "next/link";
import { Building2, ArrowUpRight, Home, Sparkles } from "lucide-react";

interface CategoryBrowseSectionProps {
  categories?: Array<{ id?: string; name: string; description?: string }>;
}

export function CategoryBrowseSection({ categories = [] }: CategoryBrowseSectionProps) {
  const displayCategories = categories;

  return (
    <section className="border-y border-border/50 bg-muted/30 py-16 dark:border-y-0 sm:py-24">
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12 space-y-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
              <Sparkles className="size-3.5" /> Property Types
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground font-heading">
              Browse by Category
            </h2>
            <p className="text-sm text-muted-foreground max-w-xl">
              Explore curated rental property categories tailored to your living preference.
            </p>
          </div>
          <Link
            href="/properties"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline shrink-0"
          >
            View all categories <ArrowUpRight className="size-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayCategories.map((category, index) => (
            <Link
              key={category.id || category.name || index}
              href={`/properties?category=${encodeURIComponent(category.name)}`}
              className="group relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="size-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                {index % 2 === 0 ? <Building2 className="size-6" /> : <Home className="size-6" />}
              </div>
              <h3 className="text-xl font-bold text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                {category.name}
              </h3>
              {category.description && (
                <p className="mt-1 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {category.description}
                </p>
              )}
              <div className="mt-4 flex items-center justify-between text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <span>Explore homes</span>
                <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
