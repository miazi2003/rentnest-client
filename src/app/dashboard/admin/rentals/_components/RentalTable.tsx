"use client";

import React, { useState, useMemo } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { RentalStatusBadge } from "./RentalStatusBadge";
import {
  Building2,
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  Filter,
  Calendar,
  CreditCard,
  User,
  MapPin,
  FileCheck2,
} from "lucide-react";

export interface IRentalRequestItem {
  id: string;
  propertyTitle: string;
  propertyAddress?: string;
  tenantName: string;
  tenantEmail: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED";
  paymentStatus?: "PAID" | "UNPAID";
  createdAt: string;
}

interface RentalTableProps {
  rentals?: any;
}

const DEFAULT_SAMPLE_RENTALS: IRentalRequestItem[] = [
  {
    id: "rent-1",
    propertyTitle: "Luxury Apartment in Downtown",
    propertyAddress: "Downtown, New York",
    tenantName: "Michael Chen",
    tenantEmail: "m.chen@example.com",
    startDate: "2026-08-10T00:00:00Z",
    endDate: "2026-09-10T00:00:00Z",
    totalPrice: 2500,
    status: "APPROVED",
    paymentStatus: "PAID",
    createdAt: "2026-07-29T14:08:24.432Z",
  },
  {
    id: "rent-2",
    propertyTitle: "Cozy Modern Villa",
    propertyAddress: "Beverly Hills, Los Angeles",
    tenantName: "Emma Watson",
    tenantEmail: "emma.watson@example.com",
    startDate: "2026-08-15T00:00:00Z",
    endDate: "2026-11-15T00:00:00Z",
    totalPrice: 14400,
    status: "PENDING",
    paymentStatus: "UNPAID",
    createdAt: "2026-07-30T10:15:00.000Z",
  },
  {
    id: "rent-3",
    propertyTitle: "Seaside Studio Apartment",
    propertyAddress: "Ocean Drive, Miami",
    tenantName: "Lucas Anderson",
    tenantEmail: "lucas.a@example.com",
    startDate: "2026-08-01T00:00:00Z",
    endDate: "2026-08-31T00:00:00Z",
    totalPrice: 1800,
    status: "REJECTED",
    paymentStatus: "UNPAID",
    createdAt: "2026-07-25T08:30:00.000Z",
  },
  {
    id: "rent-4",
    propertyTitle: "Spacious Family Penthouse",
    propertyAddress: "Lincoln Park, Chicago",
    tenantName: "Sophia Martinez",
    tenantEmail: "sophia.m@example.com",
    startDate: "2026-06-01T00:00:00Z",
    endDate: "2026-07-01T00:00:00Z",
    totalPrice: 3500,
    status: "COMPLETED",
    paymentStatus: "PAID",
    createdAt: "2026-05-20T16:45:00.000Z",
  },
  {
    id: "rent-5",
    propertyTitle: "Urban Loft near Station",
    propertyAddress: "SoHo, New York",
    tenantName: "Daniel White",
    tenantEmail: "daniel.w@example.com",
    startDate: "2026-08-20T00:00:00Z",
    endDate: "2026-09-20T00:00:00Z",
    totalPrice: 2200,
    status: "PENDING",
    paymentStatus: "UNPAID",
    createdAt: "2026-08-01T11:20:00.000Z",
  },
];

type SortField =
  | "propertyTitle"
  | "tenantName"
  | "totalPrice"
  | "status"
  | "createdAt";
type SortOrder = "asc" | "desc";

export function RentalTable({ rentals }: RentalTableProps) {
  const rentalList = useMemo(() => {
    if (rentals === undefined) return DEFAULT_SAMPLE_RENTALS;
    if (Array.isArray(rentals)) return rentals;

    if (rentals && typeof rentals === "object") {
      if (Array.isArray(rentals.data)) return rentals.data;
      const d = rentals.data;
      if (d && typeof d === "object") {
        if (Array.isArray(d.data)) return d.data;
        if (Array.isArray(d.result)) return d.result;
        if (Array.isArray(d.rentals)) return d.rentals;
        if (Array.isArray(d.requests)) return d.requests;
      }
    }

    return [];
  }, [rentals]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const filteredRentals = useMemo(() => {
    return rentalList.filter((item: any) => {
      const propTitle =
        typeof item.propertyTitle === "string"
          ? item.propertyTitle
          : item.property?.title || "";
      const tenantName =
        typeof item.tenantName === "string"
          ? item.tenantName
          : item.tenant?.name || "";
      const tenantEmail =
        typeof item.tenantEmail === "string"
          ? item.tenantEmail
          : item.tenant?.email || "";

      const matchesSearch =
        propTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tenantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tenantEmail.toLowerCase().includes(searchTerm.toLowerCase());

      const itemStatus = (item.status || "PENDING").toUpperCase();
      const matchesStatus =
        statusFilter === "ALL" || itemStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [rentalList, searchTerm, statusFilter]);



  const sortedRentals = useMemo(() => {
    return [...filteredRentals].sort((a: any, b: any) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      if (sortField === "propertyTitle") {
        aValue = a.propertyTitle || a.property?.title || "";
        bValue = b.propertyTitle || b.property?.title || "";
      } else if (sortField === "tenantName") {
        aValue = a.tenantName || a.tenant?.name || "";
        bValue = b.tenantName || b.tenant?.name || "";
      } else if (sortField === "createdAt") {
        aValue = new Date(aValue).getTime() || 0;
        bValue = new Date(bValue).getTime() || 0;
      }

      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredRentals, sortField, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(sortedRentals.length / pageSize));
  const validPage = Math.min(currentPage, totalPages);

  const paginatedRentals = useMemo(() => {
    const start = (validPage - 1) * pageSize;
    return sortedRentals.slice(start, start + pageSize);
  }, [sortedRentals, validPage, pageSize]);

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

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
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
  const endItemIndex = Math.min(validPage * pageSize, sortedRentals.length);

  return (
    <div className="w-full space-y-6">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Rental Requests Management
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Overview and status monitoring for all property rental applications.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto bg-slate-100 dark:bg-slate-800 px-3.5 py-1.5 rounded-lg border border-slate-200/60 dark:border-slate-700/60">
          <FileCheck2 className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Total Requests: {rentalList.length}
          </span>
        </div>
      </div>


      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-4 sm:p-6 space-y-5">

        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pb-1">

          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by property or tenant..."
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
              <span>Status:</span>
            </div>

            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 text-xs font-medium bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-lg text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">PENDING</option>
              <option value="APPROVED">APPROVED</option>
              <option value="REJECTED">REJECTED</option>
              <option value="COMPLETED">COMPLETED</option>
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
                    onClick={() => handleSort("propertyTitle")}
                    className="flex items-center group cursor-pointer hover:text-slate-900 transition-colors"
                  >
                    Property
                    {getSortIcon("propertyTitle")}
                  </button>
                </TableHead>


                <TableHead className="py-3.5 px-4 font-semibold text-slate-700 dark:text-slate-200">
                  <button
                    type="button"
                    onClick={() => handleSort("tenantName")}
                    className="flex items-center group cursor-pointer hover:text-slate-900 transition-colors"
                  >
                    Tenant
                    {getSortIcon("tenantName")}
                  </button>
                </TableHead>


                <TableHead className="py-3.5 px-4 font-semibold text-slate-700 dark:text-slate-200">
                  Rental Period
                </TableHead>


                <TableHead className="py-3.5 px-4 font-semibold text-slate-700 dark:text-slate-200">
                  <button
                    type="button"
                    onClick={() => handleSort("totalPrice")}
                    className="flex items-center group cursor-pointer hover:text-slate-900 transition-colors"
                  >
                    Total Rent
                    {getSortIcon("totalPrice")}
                  </button>
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
                    Requested
                    {getSortIcon("createdAt")}
                  </button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedRentals.length > 0 ? (
                paginatedRentals.map((item: any) => {
                  const title =
                    typeof item.propertyTitle === "string"
                      ? item.propertyTitle
                      : item.property?.title || "Rental Property";
                  const address =
                    typeof item.propertyAddress === "string"
                      ? item.propertyAddress
                      : item.property?.address || item.property?.location || "Location N/A";

                  const tenantName =
                    typeof item.tenantName === "string"
                      ? item.tenantName
                      : item.tenant?.name || "Applicant Tenant";
                  const tenantEmail =
                    typeof item.tenantEmail === "string"
                      ? item.tenantEmail
                      : item.tenant?.email || "Email N/A";

                  const totalPrice = Number(item.totalPrice || item.price || 0);

                  return (
                    <TableRow
                      key={item.id || item._id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >

                      <TableCell className="font-medium py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200/60 flex items-center justify-center shrink-0">
                            <Building2 className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                              {title}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                              {address}
                            </p>
                          </div>
                        </div>
                      </TableCell>


                      <TableCell className="py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 shrink-0 text-xs font-bold">
                            <User className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                              {tenantName}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {tenantEmail}
                            </p>
                          </div>
                        </div>
                      </TableCell>


                      <TableCell className="py-3.5 text-xs text-slate-600 dark:text-slate-400 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>
                            {formatDate(item.startDate)} → {formatDate(item.endDate)}
                          </span>
                        </div>
                      </TableCell>


                      <TableCell className="py-3.5 font-bold text-slate-900 dark:text-slate-100 text-sm">
                        ${totalPrice.toLocaleString()}
                      </TableCell>


                      <TableCell className="py-3.5">
                        <div className="flex flex-col items-start gap-1">
                          <RentalStatusBadge status={item.status || "PENDING"} />
                          {item.paymentStatus && (
                            <span
                              className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-md border ${
                                item.paymentStatus === "PAID"
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                  : "bg-amber-50 text-amber-700 border-amber-200"
                              }`}
                            >
                              <CreditCard className="w-2.5 h-2.5" />
                              {item.paymentStatus}
                            </span>
                          )}
                        </div>
                      </TableCell>


                      <TableCell className="py-3.5 text-slate-600 dark:text-slate-400 text-xs whitespace-nowrap">
                        {formatDate(item.createdAt)}
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-32 text-center text-slate-500 dark:text-slate-400"
                  >
                    No rental requests match your criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>


        <div className="block md:hidden space-y-3">
          {paginatedRentals.length > 0 ? (
            paginatedRentals.map((item: any) => {
              const title =
                typeof item.propertyTitle === "string"
                  ? item.propertyTitle
                  : item.property?.title || "Rental Property";
              const tenantName =
                typeof item.tenantName === "string"
                  ? item.tenantName
                  : item.tenant?.name || "Applicant Tenant";

              return (
                <div
                  key={item.id || item._id}
                  className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs space-y-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200/60 flex items-center justify-center shrink-0">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                          {title}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Tenant: {tenantName}
                        </p>
                      </div>
                    </div>
                    <RentalStatusBadge status={item.status || "PENDING"} />
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                    <div>
                      <span className="text-slate-400 block font-medium">Rent:</span>
                      <span className="font-bold text-slate-900 dark:text-slate-100">
                        ${Number(item.totalPrice || item.price || 0).toLocaleString()}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block font-medium">Requested:</span>
                      <span className="text-slate-700 dark:text-slate-300">
                        {formatDate(item.createdAt)}
                      </span>
                    </div>

                    <div className="col-span-2">
                      <span className="text-slate-400 block font-medium">Period:</span>
                      <span className="text-slate-700 dark:text-slate-300">
                        {formatDate(item.startDate)} → {formatDate(item.endDate)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800 rounded-xl">
              No rental requests found.
            </div>
          )}
        </div>


        {sortedRentals.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="text-xs text-slate-500 font-medium">
              Showing <span className="font-semibold text-slate-700">{startItemIndex}</span> to{" "}
              <span className="font-semibold text-slate-700">{endItemIndex}</span> of{" "}
              <span className="font-semibold text-slate-700">{sortedRentals.length}</span> rental requests
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
