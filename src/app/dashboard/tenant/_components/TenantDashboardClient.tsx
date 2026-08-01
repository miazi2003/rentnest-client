"use me";
"use client";

import React, { useState, useMemo } from "react";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";
import {
  IRentalRequest,
  IPaymentItem,
  TenantDashboardTab,
  PayMethod,
  ITenantStats,
} from "../types/tenant.types";

import {
  TenantStatsCards,
  TenantTabsHeader,
  RentalRequestsTable,
  PaymentHistoryTable,
  PayNowModal,
  LeaveReviewModal,
} from "./index";

import { Tabs, TabsContent } from "@/components/ui/tabs";
import { handleCreateReviewAction } from "@/app/features/review/actions/reviewActions";

interface TenantDashboardClientProps {
  initialRequests?: IRentalRequest[];
  initialPayments?: IPaymentItem[];
  defaultTab?: TenantDashboardTab;
}

// Fallback sample data to demonstrate all status types & actions if live database has few records
const SAMPLE_REQUESTS: IRentalRequest[] = [
  {
    id: "req-101",
    status: "APPROVED",
    rentAmount: 1200,
    startDate: "2026-08-01",
    endDate: "2027-07-31",
    createdAt: "2026-07-28",
    property: {
      title: "Skyline Luxury Apartment 4B",
      location: "Gulshan 2, Dhaka",
      rent: 1200,
    },
    landlord: {
      name: "Tanvir Hasan",
      email: "tanvir.h@example.com",
      phone: "+880 1711-223344",
    },
  },
  {
    id: "req-102",
    status: "ACTIVE",
    rentAmount: 850,
    startDate: "2026-06-01",
    endDate: "2027-05-31",
    createdAt: "2026-05-20",
    property: {
      title: "Greenwood Studio Apartment",
      location: "Dhanmondi 27, Dhaka",
      rent: 850,
    },
    landlord: {
      name: "Anisur Rahman",
      email: "anisur@example.com",
      phone: "+880 1812-345678",
    },
  },
  {
    id: "req-103",
    status: "PENDING",
    rentAmount: 1500,
    startDate: "2026-09-01",
    endDate: "2027-08-31",
    createdAt: "2026-07-29",
    property: {
      title: "Modern Duplex Penthouse",
      location: "Banani Block D, Dhaka",
      rent: 1500,
    },
    landlord: {
      name: "Nusrat Jahan",
      email: "nusrat.j@example.com",
      phone: "+880 1913-987654",
    },
  },
  {
    id: "req-104",
    status: "REJECTED",
    rentAmount: 950,
    startDate: "2026-07-01",
    endDate: "2027-06-30",
    createdAt: "2026-06-25",
    property: {
      title: "Lakeview Resident Suite",
      location: "Uttara Sector 7, Dhaka",
      rent: 950,
    },
    landlord: {
      name: "Mahmudul Haq",
      email: "mahmud.haq@example.com",
      phone: "+880 1614-556677",
    },
  },
  {
    id: "req-105",
    status: "COMPLETED",
    rentAmount: 700,
    startDate: "2025-06-01",
    endDate: "2026-05-31",
    createdAt: "2025-05-15",
    property: {
      title: "Cozy Garden View Flat",
      location: "Mirpur 10, Dhaka",
      rent: 700,
    },
    landlord: {
      name: "Syed Alim",
      email: "syed.alim@example.com",
      phone: "+880 1515-889900",
    },
  },
];

const SAMPLE_PAYMENTS: IPaymentItem[] = [
  {
    id: "pay-501",
    transactionId: "TXN-98472301",
    amount: 1200,
    paymentMethod: "Credit Card (Visa)",
    createdAt: "2026-07-28T10:30:00Z",
    status: "COMPLETED",
    propertyTitle: "Skyline Luxury Apartment 4B",
    landlordName: "Tanvir Hasan",
  },
  {
    id: "pay-502",
    transactionId: "TXN-84729104",
    amount: 850,
    paymentMethod: "bKash Mobile Wallet",
    createdAt: "2026-06-01T14:15:00Z",
    status: "COMPLETED",
    propertyTitle: "Greenwood Studio Apartment",
    landlordName: "Anisur Rahman",
  },
  {
    id: "pay-503",
    transactionId: "TXN-73620195",
    amount: 850,
    paymentMethod: "Bank Wire Transfer",
    createdAt: "2026-07-01T09:00:00Z",
    status: "COMPLETED",
    propertyTitle: "Greenwood Studio Apartment",
    landlordName: "Anisur Rahman",
  },
];

export default function TenantDashboardClient({
  initialRequests = [],
  initialPayments = [],
  defaultTab = "requests",
}: TenantDashboardClientProps) {
  // Merge live backend data with fallback samples if empty
  const rawRequests =
    initialRequests && initialRequests.length > 0
      ? initialRequests
      : SAMPLE_REQUESTS;
  const rawPayments =
    initialPayments && initialPayments.length > 0
      ? initialPayments
      : SAMPLE_PAYMENTS;

  const [requestsList, setRequestsList] = useState<IRentalRequest[]>(rawRequests);
  const [paymentsList, setPaymentsList] = useState<IPaymentItem[]>(rawPayments);

  // Active Tab: 'requests' | 'payments'
  const [activeTab, setActiveTab] = useState<TenantDashboardTab>(defaultTab);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // Modals state
  const [payModalItem, setPayModalItem] = useState<IRentalRequest | null>(null);
  const [reviewModalItem, setReviewModalItem] = useState<IRentalRequest | null>(null);

  // Memoized stats for performance
  const stats: ITenantStats = useMemo(() => {
    const totalRequests = requestsList.length;
    const pendingRequests = requestsList.filter(
      (r) => (r.status || "").toUpperCase() === "PENDING"
    ).length;
    const activeRentals = requestsList.filter(
      (r) => (r.status || "").toUpperCase() === "ACTIVE"
    ).length;
    const approvedRequests = requestsList.filter(
      (r) => (r.status || "").toUpperCase() === "APPROVED"
    ).length;
    const totalPaymentAmount = paymentsList.reduce(
      (sum, p) => sum + Number(p.amount || 0),
      0
    );
    const totalPaymentsCount = paymentsList.length;

    return {
      totalRequests,
      pendingRequests,
      activeRentals,
      approvedRequests,
      totalPaymentAmount,
      totalPaymentsCount,
    };
  }, [requestsList, paymentsList]);

  // Helper getters
  const getPropertyTitle = (req: IRentalRequest) =>
    req.property?.title || req.propertyTitle || "Rental Property";

  const getPropertyLocation = (req: IRentalRequest) =>
    req.property?.location || req.property?.address || req.location || "Location N/A";

  const getLandlordName = (req: IRentalRequest) =>
    req.landlord?.name || req.landlordName || "Property Landlord";

  const getRentAmount = (req: IRentalRequest) => {
    const val =
      req.totalPrice ??
      req.property?.price ??
      req.price ??
      req.rentAmount ??
      req.amount ??
      0;
    return Number(val) || 0;
  };

  // Filter requests
  const filteredRequests = useMemo(() => {
    return requestsList.filter((req) => {
      const title = getPropertyTitle(req).toLowerCase();
      const landlord = getLandlordName(req).toLowerCase();
      const location = getPropertyLocation(req).toLowerCase();
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        title.includes(query) || landlord.includes(query) || location.includes(query);

      const reqStatus = (req.status || "").toUpperCase();
      const matchesStatus =
        statusFilter === "ALL" || reqStatus === statusFilter.toUpperCase();

      return matchesSearch && matchesStatus;
    });
  }, [requestsList, searchQuery, statusFilter]);

  // Filter payments
  const filteredPayments = useMemo(() => {
    return paymentsList.filter((pay) => {
      const title = (pay.propertyTitle || pay.property?.title || "").toLowerCase();
      const txn = (pay.transactionId || pay.id || "").toLowerCase();
      const landlord = (pay.landlordName || "").toLowerCase();
      const query = searchQuery.toLowerCase();

      return title.includes(query) || txn.includes(query) || landlord.includes(query);
    });
  }, [paymentsList, searchQuery]);

  // Payment Callback
  const handleConfirmPayment = (request: IRentalRequest, method: PayMethod) => {
    const statusUpper = (request.status || "").toUpperCase();
    if (statusUpper === "ACTIVE" || statusUpper === "COMPLETED") {
      toast.error("This property rental is already active and paid.");
      setPayModalItem(null);
      return;
    }

    const title = getPropertyTitle(request);
    const amount = getRentAmount(request);

    // Update request status to ACTIVE
    setRequestsList((prev) =>
      prev.map((r) => (r.id === request.id ? { ...r, status: "ACTIVE" } : r))
    );

    // Add new payment entry
    const newPayment: IPaymentItem = {
      id: `pay-${Date.now()}`,
      transactionId: `TXN-${Math.floor(10000000 + Math.random() * 90000000)}`,
      amount: Number(amount),
      paymentMethod:
        method === "card"
          ? "Credit Card (Visa/MC)"
          : method === "bkash"
          ? "bKash Mobile Wallet"
          : "Bank Wire Transfer",
      createdAt: new Date().toISOString(),
      status: "COMPLETED",
      propertyTitle: title,
      landlordName: getLandlordName(request),
    };

    setPaymentsList((prev) => [newPayment, ...prev]);

    toast.success(`Payment of $${amount} successful for "${title}"!`, {
      description: "Your rental agreement is now ACTIVE.",
    });

    setPayModalItem(null);
  };

  // Review Callback
  const handleSubmitReview = async (
    request: IRentalRequest,
    rating: number,
    comment: string
  ) => {
    const propertyId = request.propertyId || request.property?.id || request.id;
    const title = getPropertyTitle(request);

    if (!propertyId) {
      toast.error("Property ID missing from rental request.");
      return;
    }

    try {
      const res = await handleCreateReviewAction({
        propertyId,
        rating,
        comment,
      });

      if (res.ok) {
        toast.success(`Review submitted successfully!`, {
          description: `Thank you for reviewing "${title}" (${rating} stars).`,
        });
        setReviewModalItem(null);
      } else {
        toast.error(res.message || "Failed to submit review");
      }
    } catch (err) {
      console.error("Submit review error:", err);
      toast.error(err instanceof Error ? err.message : "Error submitting review");
    }
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Header section banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-emerald-900/90 via-teal-900 to-cyan-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-white/10 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-1.5 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 text-emerald-200 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            Tenant Portal
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Tenant Dashboard
          </h1>
          <p className="text-emerald-100/80 text-sm max-w-xl">
            Track your rental applications, execute instant rent payments, and view past transaction logs seamlessly.
          </p>
        </div>
      </div>

      {/* TOP STATS CARDS COMPONENT */}
      <TenantStatsCards stats={stats} />

      {/* SHADCN TABS ROOT */}
      <Tabs
        value={activeTab}
        onValueChange={(val) => setActiveTab(val as TenantDashboardTab)}
        className="bg-card text-card-foreground rounded-3xl border border-border shadow-sm overflow-hidden flex flex-col gap-0"
      >
        {/* SHADCN TABS HEADER */}
        <TenantTabsHeader
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          requestsCount={requestsList.length}
          paymentsCount={paymentsList.length}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />

        {/* TAB 1 CONTENT: RENTAL REQUESTS TABLE */}
        <TabsContent value="requests" className="mt-0 p-0">
          <RentalRequestsTable
            requests={filteredRequests}
            onOpenPayModal={(req) => setPayModalItem(req)}
            onOpenReviewModal={(req) => setReviewModalItem(req)}
          />
        </TabsContent>

        {/* TAB 2 CONTENT: PAYMENT HISTORY TABLE */}
        <TabsContent value="payments" className="mt-0 p-0">
          <PaymentHistoryTable payments={filteredPayments} />
        </TabsContent>
      </Tabs>

      {/* SHADCN DIALOG MODALS */}
      <PayNowModal
        request={payModalItem}
        onClose={() => setPayModalItem(null)}
        onConfirmPayment={handleConfirmPayment}
      />

      <LeaveReviewModal
        request={reviewModalItem}
        onClose={() => setReviewModalItem(null)}
        onSubmitReview={handleSubmitReview}
      />
    </div>
  );
}
