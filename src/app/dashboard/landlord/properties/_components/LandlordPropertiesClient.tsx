"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Building2, ChevronLeft, ChevronRight, Eye, MapPin, Pencil, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DeletePropertyButton } from "../../_components/DeletePropertyButton";
import type { ILandlordProperty } from "../../types/landlord.types";

const PAGE_SIZE = 6;

export function LandlordPropertiesClient({ properties }: { properties: ILandlordProperty[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [availability, setAvailability] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredProperties = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return properties.filter((property) => {
      const matchesSearch = !query || [property.title, property.description, property.address, property.location, property.category?.name]
        .some((value) => value?.toLowerCase().includes(query));
      const matchesAvailability = availability === "ALL" || (property.availability || "AVAILABLE").toUpperCase() === availability;
      return matchesSearch && matchesAvailability;
    });
  }, [availability, properties, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredProperties.length / PAGE_SIZE));
  const validPage = Math.min(currentPage, totalPages);
  const visibleProperties = filteredProperties.slice((validPage - 1) * PAGE_SIZE, validPage * PAGE_SIZE);
  const updateSearch = (value: string) => { setSearchQuery(value); setCurrentPage(1); };
  const updateAvailability = (value: string) => { setAvailability(value); setCurrentPage(1); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div><h1 className="text-2xl font-black tracking-tight text-foreground">My Properties</h1><p className="mt-0.5 text-xs text-muted-foreground">Manage and monitor all your listed rental properties.</p></div>
        <Link href="/dashboard/landlord/properties/new"><Button className="flex cursor-pointer items-center gap-1.5 rounded-2xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-600/25 hover:bg-emerald-700"><Plus className="h-4 w-4" />Create Property</Button></Link>
      </div>

      {properties.length > 0 && (
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1"><Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><input type="search" value={searchQuery} onChange={(event) => updateSearch(event.target.value)} placeholder="Search your properties..." className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-4 text-sm text-foreground outline-none focus:ring-2 focus:ring-emerald-500/30" /></div>
          <select value={availability} onChange={(event) => updateAvailability(event.target.value)} className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-emerald-500/30">
            <option value="ALL">All availability</option><option value="AVAILABLE">Available</option><option value="UNAVAILABLE">Unavailable</option>
          </select>
        </div>
      )}

      {filteredProperties.length === 0 ? (
        <div className="space-y-4 rounded-3xl border border-dashed border-border/80 bg-muted/10 p-8 py-16 text-center">
          <Building2 className="mx-auto h-12 w-12 text-muted-foreground/60" />
          <div className="space-y-1"><h3 className="text-base font-bold text-foreground">{properties.length ? "No properties found" : "No properties listed yet"}</h3><p className="text-xs text-muted-foreground">{properties.length ? "No properties match your search or availability filter." : "Start listing your properties to receive rental applications from tenants."}</p></div>
          {!properties.length && <Link href="/dashboard/landlord/properties/new"><Button className="mx-auto flex cursor-pointer items-center gap-1.5 rounded-2xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-600/25 hover:bg-emerald-700"><Plus className="h-4 w-4" />Create Property</Button></Link>}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {visibleProperties.map((property) => (
              <Card key={property.id} className="flex flex-col justify-between overflow-hidden rounded-3xl border-border/80 transition-all duration-300 hover:shadow-xl">
                <div><CardHeader className="p-5 pb-3"><div className="flex items-start justify-between gap-2"><div className="flex min-w-0 items-center gap-3"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60"><Building2 className="h-5 w-5" /></div><div className="min-w-0"><CardTitle className="line-clamp-1 text-base font-bold text-foreground">{property.title || "Untitled Property"}</CardTitle><p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3 w-3 shrink-0 text-emerald-600" /><span className="truncate">{property.address || property.location || "Location N/A"}</span></p></div></div><span className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-bold ${property.availability === "UNAVAILABLE" ? "border-rose-500/20 bg-rose-500/10 text-rose-600 dark:text-rose-400" : "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"}`}>{property.availability === "UNAVAILABLE" ? "Unavailable" : "Available"}</span></div></CardHeader>
                <CardContent className="space-y-2 px-5 py-3 text-xs"><p className="line-clamp-2 text-muted-foreground">{property.description || "No description available."}</p><div className="flex items-center justify-between border-t border-border/60 pt-2"><span className="text-muted-foreground">Price per day:</span><span className="flex items-center text-sm font-extrabold text-foreground">${Number(property.price ?? 0).toLocaleString()}</span></div></CardContent></div>
                <CardFooter className="flex items-center gap-2 bg-muted/20 p-5 pt-3"><Link href={`/properties/${property.id}`} className="flex-1"><Button className="w-full cursor-pointer gap-1.5 rounded-2xl bg-emerald-600 text-xs font-bold text-white hover:bg-emerald-700"><Eye className="h-4 w-4" />View Details</Button></Link><Link href={`/dashboard/landlord/properties/${property.id}/edit`}><Button variant="outline" size="sm" title="Edit Property" className="shrink-0 cursor-pointer gap-1.5 rounded-2xl border-border px-3 py-2 text-xs font-bold hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400"><Pencil className="h-3.5 w-3.5" />Edit</Button></Link><DeletePropertyButton propertyId={property.id} /></CardFooter>
              </Card>
            ))}
          </div>
          {filteredProperties.length > PAGE_SIZE && <div className="flex items-center justify-between border-t border-border pt-4"><p className="text-xs text-muted-foreground">Showing {(validPage - 1) * PAGE_SIZE + 1}–{Math.min(validPage * PAGE_SIZE, filteredProperties.length)} of {filteredProperties.length}</p><div className="flex items-center gap-2"><Button type="button" variant="outline" size="sm" onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} disabled={validPage === 1} className="h-8 gap-1 text-xs"><ChevronLeft className="size-3.5" />Previous</Button><span className="text-xs font-semibold text-muted-foreground">{validPage} / {totalPages}</span><Button type="button" variant="outline" size="sm" onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))} disabled={validPage === totalPages} className="h-8 gap-1 text-xs">Next<ChevronRight className="size-3.5" /></Button></div></div>}
        </>
      )}
    </div>
  );
}
