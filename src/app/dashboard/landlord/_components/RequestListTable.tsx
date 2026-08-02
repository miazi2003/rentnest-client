"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Building2,
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  FileCheck2,
  Filter,
  Loader2,
  MapPin,
  Search,
  User,
  X,
} from "lucide-react";
import { handleRequestAction } from "@/app/features/landlord/actions/handleRequestAction";
import { RentalStatusBadge } from "@/app/dashboard/admin/rentals/_components/RentalStatusBadge";
import { ILandlordRentalRequest } from "../types/landlord.types";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface RequestListTableProps {
  requests: ILandlordRentalRequest[];
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  loadingId?: string | null;
}

type SortField =
  | "propertyTitle"
  | "tenantName"
  | "totalPrice"
  | "status"
  | "createdAt";
type SortOrder = "asc" | "desc";

const PAGE_SIZE = 5;

const propertyTitle = (request: ILandlordRentalRequest) =>
  request.property?.title || request.propertyTitle || "Rental Property";

const propertyAddress = (request: ILandlordRentalRequest) =>
  request.property?.address || "Location N/A";

const tenantName = (request: ILandlordRentalRequest) =>
  request.tenant?.name || request.tenantName || "Applicant Tenant";

const tenantEmail = (request: ILandlordRentalRequest) =>
  request.tenant?.email || request.tenantEmail || "Email N/A";

const totalPrice = (request: ILandlordRentalRequest) =>
  Number(request.totalPrice ?? request.price ?? request.property?.price ?? 0) || 0;

const formatDate = (dateString?: string) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
};

export function RequestListTable({
  requests,
  onApprove,
  onReject,
  loadingId: externalLoadingId,
}: RequestListTableProps) {
  const router = useRouter();
  const [internalLoadingId, setInternalLoadingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [currentPage, setCurrentPage] = useState(1);

  const activeLoadingId = externalLoadingId ?? internalLoadingId;

  const filteredRequests = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return requests.filter((request) => {
      const matchesSearch =
        !query ||
        propertyTitle(request).toLowerCase().includes(query) ||
        tenantName(request).toLowerCase().includes(query) ||
        tenantEmail(request).toLowerCase().includes(query);
      const status = (request.status || "PENDING").toUpperCase();
      const matchesStatus = statusFilter === "ALL" || status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [requests, searchTerm, statusFilter]);

  const sortedRequests = useMemo(() => {
    return [...filteredRequests].sort((a, b) => {
      const values: Record<SortField, [string | number, string | number]> = {
        propertyTitle: [propertyTitle(a).toLowerCase(), propertyTitle(b).toLowerCase()],
        tenantName: [tenantName(a).toLowerCase(), tenantName(b).toLowerCase()],
        totalPrice: [totalPrice(a), totalPrice(b)],
        status: [
          (a.status || "PENDING").toUpperCase(),
          (b.status || "PENDING").toUpperCase(),
        ],
        createdAt: [
          new Date(a.createdAt).getTime() || 0,
          new Date(b.createdAt).getTime() || 0,
        ],
      };
      const [aValue, bValue] = values[sortField];
      const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      return sortOrder === "asc" ? comparison : -comparison;
    });
  }, [filteredRequests, sortField, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(sortedRequests.length / PAGE_SIZE));
  const validPage = Math.min(currentPage, totalPages);
  const paginatedRequests = sortedRequests.slice(
    (validPage - 1) * PAGE_SIZE,
    validPage * PAGE_SIZE,
  );
  const startItemIndex = sortedRequests.length
    ? (validPage - 1) * PAGE_SIZE + 1
    : 0;
  const endItemIndex = Math.min(validPage * PAGE_SIZE, sortedRequests.length);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder((previous) => (previous === "asc" ? "desc" : "asc"));
      return;
    }
    setSortField(field);
    setSortOrder("asc");
  };

  const sortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="ml-1 size-3.5 text-slate-400 opacity-60" />;
    }
    return sortOrder === "asc" ? (
      <ArrowUp className="ml-1 size-3.5 text-primary" />
    ) : (
      <ArrowDown className="ml-1 size-3.5 text-primary" />
    );
  };

  const updateRequest = async (id: string, status: "APPROVED" | "REJECTED") => {
    const callback = status === "APPROVED" ? onApprove : onReject;
    if (callback) {
      callback(id);
      return;
    }

    try {
      setInternalLoadingId(id);
      const result = await handleRequestAction(id, status);
      if (!result?.ok) {
        toast.error(
          result?.message ||
            result?.data?.message ||
            `Failed to ${status === "APPROVED" ? "approve" : "reject"} request.`,
        );
        return;
      }
      toast.success(
        status === "APPROVED"
          ? "Rental request approved successfully!"
          : "Rental request rejected.",
      );
      router.refresh();
    } catch {
      toast.error("An error occurred while updating the request.");
    } finally {
      setInternalLoadingId(null);
    }
  };

  const actions = (request: ILandlordRentalRequest, compact = false) => {
    const status = (request.status || "PENDING").toUpperCase();
    if (status !== "PENDING") {
      return <span className="text-xs font-medium text-slate-400">No actions</span>;
    }

    const loading = activeLoadingId === request.id;
    return (
      <div className={`flex items-center gap-2 ${compact ? "w-full" : "justify-end"}`}>
        <Button
          size="sm"
          disabled={loading}
          onClick={() => updateRequest(request.id, "APPROVED")}
          className={`${compact ? "flex-1" : ""} h-8 gap-1.5 rounded-lg bg-emerald-600 text-xs font-semibold text-white hover:bg-emerald-700`}
        >
          {loading ? <Loader2 className="size-3.5 animate-spin" /> : <Check className="size-3.5" />}
          Approve
        </Button>
        <Button
          size="sm"
          variant="outline"
          disabled={loading}
          onClick={() => updateRequest(request.id, "REJECTED")}
          className={`${compact ? "flex-1" : ""} h-8 gap-1.5 rounded-lg border-rose-200 text-xs font-semibold text-rose-600 hover:bg-rose-50 hover:text-rose-700`}
        >
          <X className="size-3.5" />
          Reject
        </Button>
      </div>
    );
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Rental Requests Management
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Review and respond to tenant applications for your listed properties.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start rounded-lg border border-slate-200/60 bg-slate-100 px-3.5 py-1.5 dark:border-slate-700/60 dark:bg-slate-800 sm:self-auto">
          <FileCheck2 className="size-4 text-slate-500" />
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Total Requests: {requests.length}
          </span>
        </div>
      </div>

      <div className="space-y-5 rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
        <div className="flex flex-col items-stretch justify-between gap-4 pb-1 md:flex-row md:items-center">
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              placeholder="Search by property or tenant..."
              value={searchTerm}
              onChange={(event) => {
                setSearchTerm(event.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:ring-2 focus:ring-slate-900/10 dark:border-slate-700/80 dark:bg-slate-800/80 dark:text-slate-100"
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="mr-1 hidden items-center gap-1.5 text-xs font-medium text-slate-500 sm:flex">
              <Filter className="size-3.5" /> Status:
            </div>
            <select
              value={statusFilter}
              onChange={(event) => {
                setStatusFilter(event.target.value);
                setCurrentPage(1);
              }}
              className="cursor-pointer rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 outline-none dark:border-slate-700/80 dark:bg-slate-800/80 dark:text-slate-200"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">PENDING</option>
              <option value="APPROVED">APPROVED</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="REJECTED">REJECTED</option>
              <option value="COMPLETED">COMPLETED</option>
            </select>
          </div>
        </div>

        <div className="hidden overflow-hidden rounded-xl border border-slate-200/80 shadow-2xs dark:border-slate-800 md:block">
          <Table>
            <TableHeader className="border-b border-slate-200/80 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-800/60">
              <TableRow className="hover:bg-transparent">
                {([
                  ["propertyTitle", "Property"],
                  ["tenantName", "Tenant"],
                ] as const).map(([field, label]) => (
                  <TableHead key={field} className="px-4 py-3.5 font-semibold text-slate-700 dark:text-slate-200">
                    <button type="button" onClick={() => handleSort(field)} className="group flex cursor-pointer items-center">
                      {label}{sortIcon(field)}
                    </button>
                  </TableHead>
                ))}
                <TableHead className="px-4 py-3.5 font-semibold text-slate-700 dark:text-slate-200">Rental Period</TableHead>
                {([
                  ["totalPrice", "Total Rent"],
                  ["status", "Status"],
                  ["createdAt", "Requested"],
                ] as const).map(([field, label]) => (
                  <TableHead key={field} className="px-4 py-3.5 font-semibold text-slate-700 dark:text-slate-200">
                    <button type="button" onClick={() => handleSort(field)} className="group flex cursor-pointer items-center">
                      {label}{sortIcon(field)}
                    </button>
                  </TableHead>
                ))}
                <TableHead className="px-4 py-3.5 text-right font-semibold text-slate-700 dark:text-slate-200">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedRequests.length ? paginatedRequests.map((request) => (
                <TableRow key={request.id} className="transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                  <TableCell className="py-3.5 font-medium">
                    <div className="flex items-center gap-3">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-emerald-200/60 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"><Building2 className="size-4" /></div>
                      <div><p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{propertyTitle(request)}</p><p className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400"><MapPin className="size-3 shrink-0" />{propertyAddress(request)}</p></div>
                    </div>
                  </TableCell>
                  <TableCell className="py-3.5">
                    <div className="flex items-center gap-2.5"><div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"><User className="size-3.5" /></div><div><p className="text-xs font-semibold text-slate-900 dark:text-slate-100 sm:text-sm">{tenantName(request)}</p><p className="text-xs text-slate-500 dark:text-slate-400">{tenantEmail(request)}</p></div></div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap py-3.5 text-xs text-slate-600 dark:text-slate-400"><div className="flex items-center gap-1.5"><Calendar className="size-3.5 shrink-0 text-emerald-600" />{formatDate(request.startDate)} → {formatDate(request.endDate)}</div></TableCell>
                  <TableCell className="py-3.5 text-sm font-bold text-slate-900 dark:text-slate-100">${totalPrice(request).toLocaleString()}</TableCell>
                  <TableCell className="py-3.5"><div className="flex flex-col items-start gap-1"><RentalStatusBadge status={request.status || "PENDING"} />{request.paymentStatus && <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase ${request.paymentStatus === "PAID" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-amber-200 bg-amber-50 text-amber-700"}`}><CreditCard className="size-2.5" />{request.paymentStatus}</span>}</div></TableCell>
                  <TableCell className="whitespace-nowrap py-3.5 text-xs text-slate-600 dark:text-slate-400">{formatDate(request.createdAt)}</TableCell>
                  <TableCell className="py-3.5 text-right">{actions(request)}</TableCell>
                </TableRow>
              )) : <TableRow><TableCell colSpan={7} className="h-32 text-center text-slate-500 dark:text-slate-400">No rental requests match your criteria.</TableCell></TableRow>}
            </TableBody>
          </Table>
        </div>

        <div className="space-y-3 md:hidden">
          {paginatedRequests.length ? paginatedRequests.map((request) => (
            <div key={request.id} className="space-y-3 rounded-xl border border-slate-200/80 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-start justify-between gap-3"><div className="flex items-center gap-2.5"><div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-emerald-200/60 bg-emerald-50 text-emerald-700"><Building2 className="size-4" /></div><div><h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{propertyTitle(request)}</h4><p className="text-xs text-slate-500">Tenant: {tenantName(request)}</p></div></div><RentalStatusBadge status={request.status || "PENDING"} /></div>
              <div className="grid grid-cols-2 gap-2 border-t border-slate-100 pt-2 text-xs dark:border-slate-800"><div><span className="block font-medium text-slate-400">Rent:</span><span className="font-bold text-slate-900 dark:text-slate-100">${totalPrice(request).toLocaleString()}</span></div><div><span className="block font-medium text-slate-400">Requested:</span><span className="text-slate-700 dark:text-slate-300">{formatDate(request.createdAt)}</span></div><div className="col-span-2"><span className="block font-medium text-slate-400">Period:</span><span className="text-slate-700 dark:text-slate-300">{formatDate(request.startDate)} → {formatDate(request.endDate)}</span></div></div>
              <div className="border-t border-slate-100 pt-3 dark:border-slate-800">{actions(request, true)}</div>
            </div>
          )) : <div className="rounded-xl border border-slate-200 p-8 text-center text-slate-500 dark:border-slate-800 dark:text-slate-400">No rental requests found.</div>}
        </div>

        {sortedRequests.length > 0 && (
          <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-100 pt-3 dark:border-slate-800 sm:flex-row">
            <div className="text-xs font-medium text-slate-500">Showing <span className="font-semibold text-slate-700">{startItemIndex}</span> to <span className="font-semibold text-slate-700">{endItemIndex}</span> of <span className="font-semibold text-slate-700">{sortedRequests.length}</span> rental requests</div>
            <div className="flex items-center gap-1.5">
              <button type="button" onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} disabled={validPage === 1} className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"><ChevronLeft className="size-3.5" />Previous</button>
              <button type="button" onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))} disabled={validPage === totalPages} className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">Next<ChevronRight className="size-3.5" /></button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
