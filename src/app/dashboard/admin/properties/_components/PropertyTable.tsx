"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  Building2,
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  Filter,
  MapPin,
  Bed,
  Bath,
  Eye,
} from "lucide-react";

export interface IAdminProperty {
  id: string;
  _id?: string;
  title: string;
  location: string | { address?: string };
  price: number;
  bedrooms: number;
  bathrooms: number;
  category: string | { name?: string };
  status: "AVAILABLE" | "RENTED" | "PENDING";
  createdAt: string;
}

interface PropertyTableProps {
  properties?: IAdminProperty[] | {
    data?: IAdminProperty[] | { data?: IAdminProperty[]; result?: IAdminProperty[]; properties?: IAdminProperty[] };
  };
}


type SortField = "title" | "price" | "category" | "status" | "createdAt";
type SortOrder = "asc" | "desc";

export function PropertyTable({ properties }: PropertyTableProps) {
  const propertyList = useMemo(() => {
    if (properties === undefined) return [];
    if (Array.isArray(properties)) return properties;

    if (properties && typeof properties === "object") {
      if (Array.isArray(properties.data)) return properties.data;
      const d = properties.data;
      if (d && typeof d === "object") {
        if (Array.isArray(d.data)) return d.data;
        if (Array.isArray(d.result)) return d.result;
        if (Array.isArray(d.properties)) return d.properties;
      }
    }

    return [];
  }, [properties]);

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const filteredProperties = useMemo(() => {
    return propertyList.filter((p: IAdminProperty) => {
      const titleStr = p.title || "";
      const locationStr = typeof p.location === "string" ? p.location : p.location?.address || "";

      const matchesSearch =
        titleStr.toLowerCase().includes(searchTerm.toLowerCase()) ||
        locationStr.toLowerCase().includes(searchTerm.toLowerCase());

      const catName =
        typeof p.category === "object" ? p.category?.name : p.category;
      const matchesCategory =
        categoryFilter === "ALL" || catName === categoryFilter;
      const matchesStatus =
        statusFilter === "ALL" || p.status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [propertyList, searchTerm, categoryFilter, statusFilter]);

  const sortedProperties = useMemo(() => {
    return [...filteredProperties].sort((a, b) => {
      const valueFor = (property: IAdminProperty): string | number => {
        if (sortField === "category") return typeof property.category === "string" ? property.category.toLowerCase() : (property.category.name || "").toLowerCase();
        if (sortField === "createdAt") return new Date(property.createdAt).getTime() || 0;
        const value = property[sortField];
        return typeof value === "string" ? value.toLowerCase() : value;
      };
      const aValue = valueFor(a);
      const bValue = valueFor(b);

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredProperties, sortField, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(sortedProperties.length / pageSize));
  const validPage = Math.min(currentPage, totalPages);

  const paginatedProperties = useMemo(() => {
    const start = (validPage - 1) * pageSize;
    return sortedProperties.slice(start, start + pageSize);
  }, [sortedProperties, validPage, pageSize]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return (
        <ArrowUpDown className="w-3.5 h-3.5 ml-1 text-slate-400 opacity-60 group-hover:opacity-100" />
      );
    }
    return sortOrder === "asc" ? (
      <ArrowUp className="w-3.5 h-3.5 ml-1 text-primary font-bold" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 ml-1 text-primary font-bold" />
    );
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "N/A";
    try {
      const date = new Date(dateStr);
      return new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        timeZone: "UTC",
      }).format(date);
    } catch {
      return dateStr;
    }
  };

  const startItemIndex = (validPage - 1) * pageSize + 1;
  const endItemIndex = Math.min(validPage * pageSize, sortedProperties.length);

  return (
    <div className="w-full space-y-6">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Properties Management
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Overview and controls for all registered property listings.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto bg-slate-100 dark:bg-slate-800 px-3.5 py-1.5 rounded-lg border border-slate-200/60 dark:border-slate-700/60">
          <Building2 className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Total Properties: {propertyList.length}
          </span>
        </div>
      </div>


      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-4 sm:p-6 space-y-5">

        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pb-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title or location..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-lg text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mr-1 hidden sm:flex">
              <Filter className="w-3.5 h-3.5" />
              <span>Filters:</span>
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 text-xs font-medium bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-lg text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Categories</option>
              <option value="Apartment">Apartment</option>
              <option value="Villa">Villa</option>
              <option value="Studio">Studio</option>
              <option value="Penthouse">Penthouse</option>
              <option value="Loft">Loft</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 text-xs font-medium bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-lg text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="AVAILABLE">AVAILABLE</option>
              <option value="RENTED">RENTED</option>
            </select>
          </div>
        </div>


        <div className="hidden md:block rounded-xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-2xs">
          <Table>
            <TableHeader className="bg-slate-50/70 dark:bg-slate-800/60 border-b border-slate-200/80 dark:border-slate-800">
              <TableRow className="hover:bg-transparent">
                <TableHead className="py-3.5 px-4 font-semibold text-slate-700 dark:text-slate-200">
                  <button
                    type="button"
                    onClick={() => handleSort("title")}
                    className="flex items-center group cursor-pointer hover:text-slate-900 transition-colors"
                  >
                    Property
                    {getSortIcon("title")}
                  </button>
                </TableHead>
                <TableHead className="py-3.5 px-4 font-semibold text-slate-700 dark:text-slate-200">
                  <button
                    type="button"
                    onClick={() => handleSort("category")}
                    className="flex items-center group cursor-pointer hover:text-slate-900 transition-colors"
                  >
                    Category
                    {getSortIcon("category")}
                  </button>
                </TableHead>
                <TableHead className="py-3.5 px-4 font-semibold text-slate-700 dark:text-slate-200">
                  <button
                    type="button"
                    onClick={() => handleSort("price")}
                    className="flex items-center group cursor-pointer hover:text-slate-900 transition-colors"
                  >
                    Price
                    {getSortIcon("price")}
                  </button>
                </TableHead>
                <TableHead className="py-3.5 px-4 font-semibold text-slate-700 dark:text-slate-200">
                  Rooms
                </TableHead>
                <TableHead className="py-3.5 px-4 font-semibold text-slate-700 dark:text-slate-200">
                  <button
                    type="button"
                    onClick={() => handleSort("status")}
                    className="flex items-center group cursor-pointer hover:text-slate-900 transition-colors"
                  >
                    Status
                    {getSortIcon("status")}
                  </button>
                </TableHead>
                <TableHead className="py-3.5 px-4 font-semibold text-slate-700 dark:text-slate-200">
                  <button
                    type="button"
                    onClick={() => handleSort("createdAt")}
                    className="flex items-center group cursor-pointer hover:text-slate-900 transition-colors"
                  >
                    Added
                    {getSortIcon("createdAt")}
                  </button>
                </TableHead>
                <TableHead className="py-3.5 px-4 font-semibold text-slate-700 dark:text-slate-200 text-right">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedProperties.length > 0 ? (
                paginatedProperties.map((prop) => (
                  <TableRow
                    key={prop.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200/60 flex items-center justify-center shrink-0">
                          <Building2 className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                            {prop.title}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                            {typeof prop.location === "string" ? prop.location : prop.location.address || ""}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-600 dark:text-slate-400 text-xs">
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium">
                        {typeof prop.category === "object"
                          ? prop.category?.name || "Uncategorized"
                          : prop.category || "Uncategorized"}
                      </span>
                    </TableCell>
                    <TableCell className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                      ${prop.price.toLocaleString()}/mo
                    </TableCell>
                    <TableCell className="text-xs text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1">
                          <Bed className="w-3.5 h-3.5 text-slate-400" />
                          {prop.bedrooms}
                        </span>
                        <span className="flex items-center gap-1">
                          <Bath className="w-3.5 h-3.5 text-slate-400" />
                          {prop.bathrooms}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {prop.status === "AVAILABLE" ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200/80 dark:bg-green-950/40 dark:text-green-400 dark:border-green-800">
                          AVAILABLE
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/80 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800">
                          RENTED
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-slate-600 dark:text-slate-400 text-xs whitespace-nowrap">
                      {formatDate(prop.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/properties/${prop.id || prop._id}`}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-md transition-colors shadow-2xs"
                          title="View Property Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="h-32 text-center text-slate-500"
                  >
                    No properties match your criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>


        {sortedProperties.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="text-xs text-slate-500 font-medium">
              Showing <span className="font-semibold text-slate-700">{startItemIndex}</span> to{" "}
              <span className="font-semibold text-slate-700">{endItemIndex}</span> of{" "}
              <span className="font-semibold text-slate-700">{sortedProperties.length}</span> properties
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={validPage === 1}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                Previous
              </button>

              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={validPage === totalPages}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
