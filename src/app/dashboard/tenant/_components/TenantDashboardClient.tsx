"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowUpRight,
  CheckCircle2,
  Clock,
  CreditCard,
  FileText,
  History,
  Home,
  Search,
  ShieldCheck,
  Star,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import {
  IRentalRequest,
  IPaymentItem,
  TenantDashboardTab,
  PayMethod,
  ITenantStats,
} from "../types/tenant.types";

import {
  TenantTabsHeader,
  RentalRequestsTable,
  PaymentHistoryTable,
  PayNowModal,
  LeaveReviewModal,
} from "./index";

import { Tabs, TabsContent } from "@/components/ui/tabs";
import { handleCreateReviewAction } from "@/app/features/review/actions/reviewActions";
import { StatsCard, type StatsCardProps } from "@/components/StatsCard";
import { DashboardSection } from "@/components/DashboardSection";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface TenantDashboardClientProps {
  initialRequests?: IRentalRequest[];
  initialPayments?: IPaymentItem[];
  defaultTab?: TenantDashboardTab;
}

type QuickAction = {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
};

const quickActions: QuickAction[] = [
  { title: "Browse Properties", description: "Find your next rental home", href: "/properties", icon: Search, iconBg: "bg-emerald-50 group-hover:bg-emerald-100 dark:bg-emerald-950/60", iconColor: "text-emerald-600 dark:text-emerald-400" },
  { title: "Rental Requests", description: "Review your applications", href: "/dashboard/tenant", icon: FileText, iconBg: "bg-amber-50 group-hover:bg-amber-100 dark:bg-amber-950/60", iconColor: "text-amber-600 dark:text-amber-400" },
  { title: "Payment History", description: "View completed transactions", href: "/dashboard/tenant/payments", icon: CreditCard, iconBg: "bg-blue-50 group-hover:bg-blue-100 dark:bg-blue-950/60", iconColor: "text-blue-600 dark:text-blue-400" },
  { title: "My Reviews", description: "See your property feedback", href: "/dashboard/tenant/reviews", icon: Star, iconBg: "bg-purple-50 group-hover:bg-purple-100 dark:bg-purple-950/60", iconColor: "text-purple-600 dark:text-purple-400" },
];

function SummaryRow({ icon: Icon, label, value, tone }: { icon: LucideIcon; label: string; value: number; tone: string }) {
  return (
    <div className={cn("flex items-center justify-between rounded-lg p-3", tone)}>
      <div className="flex items-center gap-2.5"><Icon className="size-4" /><span className="text-sm font-medium text-foreground">{label}</span></div>
      <span className="text-sm font-bold text-foreground">{value}</span>
    </div>
  );
}

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

  const [activeTab, setActiveTab] = useState<TenantDashboardTab>(defaultTab);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const [payModalItem, setPayModalItem] = useState<IRentalRequest | null>(null);
  const [reviewModalItem, setReviewModalItem] = useState<IRentalRequest | null>(null);

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

  const filteredPayments = useMemo(() => {
    return paymentsList.filter((pay) => {
      const title = (pay.propertyTitle || pay.property?.title || "").toLowerCase();
      const txn = (pay.transactionId || pay.id || "").toLowerCase();
      const landlord = (pay.landlordName || "").toLowerCase();
      const query = searchQuery.toLowerCase();

      return title.includes(query) || txn.includes(query) || landlord.includes(query);
    });
  }, [paymentsList, searchQuery]);

  const handleConfirmPayment = (request: IRentalRequest, method: PayMethod) => {
    const statusUpper = (request.status || "").toUpperCase();
    if (statusUpper === "ACTIVE" || statusUpper === "COMPLETED") {
      toast.error("This property rental is already active and paid.");
      setPayModalItem(null);
      return;
    }

    const title = getPropertyTitle(request);
    const amount = getRentAmount(request);

    setRequestsList((prev) =>
      prev.map((r) => (r.id === request.id ? { ...r, status: "ACTIVE" } : r))
    );

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

  const countStatus = (status: string) =>
    requestsList.filter(
      (request) => (request.status || "PENDING").toUpperCase() === status,
    ).length;
  const completedRequests = countStatus("COMPLETED");
  const rejectedRequests = countStatus("REJECTED");
  const paidPayments = paymentsList.filter(
    (payment) => (payment.status || "COMPLETED").toUpperCase() !== "FAILED",
  ).length;
  const paymentCompletion = paymentsList.length
    ? Math.round((paidPayments / paymentsList.length) * 100)
    : 0;
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  const statCards: StatsCardProps[] = [
    { title: "Total Requests", value: stats.totalRequests.toLocaleString(), subtitle: "Your rental applications", icon: "rentals", iconBgColor: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400" },
    { title: "Pending Requests", value: stats.pendingRequests.toLocaleString(), subtitle: "Awaiting landlord response", icon: "rentals", iconBgColor: "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400" },
    { title: "Active Rentals", value: stats.activeRentals.toLocaleString(), subtitle: "Your current homes", icon: "properties", iconBgColor: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400" },
    { title: "Total Payments", value: formatCurrency(stats.totalPaymentAmount), subtitle: `${stats.totalPaymentsCount} completed transactions`, icon: "payments", iconBgColor: "bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400" },
  ];

  return (
    <div className="w-full space-y-8 pb-8">
      <div className="flex flex-col justify-between gap-4 pb-2 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">Welcome Back, Tenant</h1>
          <p className="mt-1 text-sm text-muted-foreground">Track your rental requests, active homes, payments, and reviews.</p>
        </div>
        <Link href="/properties"><Button size="sm" className="h-9 gap-2 bg-emerald-600 text-xs font-medium hover:bg-emerald-700"><Search className="size-3.5" />Browse Properties</Button></Link>
      </div>

      <DashboardSection>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat) => <StatsCard key={stat.title} {...stat} />)}
        </div>
      </DashboardSection>

      <DashboardSection>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card className="rounded-xl border-none bg-white shadow-sm transition-shadow hover:shadow-md dark:bg-card">
            <CardHeader className="pb-4"><div className="flex items-center justify-between"><div className="flex items-center gap-2"><div className="rounded-lg bg-emerald-50 p-2 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400"><Home className="size-5" /></div><div><CardTitle className="text-base font-bold">Rental Overview</CardTitle><CardDescription className="text-xs">Your application and rental lifecycle</CardDescription></div></div><Badge variant="outline" className="border-none bg-muted/60 text-xs font-normal">{requestsList.length} Total</Badge></div></CardHeader>
            <CardContent className="space-y-3"><SummaryRow icon={Clock} label="Pending Requests" value={stats.pendingRequests} tone="bg-amber-50/60 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400" /><SummaryRow icon={CheckCircle2} label="Approved Requests" value={stats.approvedRequests} tone="bg-emerald-50/60 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400" /><SummaryRow icon={ShieldCheck} label="Active Rentals" value={stats.activeRentals} tone="bg-blue-50/60 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400" /><SummaryRow icon={XCircle} label="Rejected Requests" value={rejectedRequests} tone="bg-rose-50/60 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400" /><SummaryRow icon={CheckCircle2} label="Completed Rentals" value={completedRequests} tone="bg-purple-50/60 text-purple-600 dark:bg-purple-950/20 dark:text-purple-400" /></CardContent>
          </Card>

          <Card className="rounded-xl border-none bg-white shadow-sm transition-shadow hover:shadow-md dark:bg-card">
            <CardHeader className="pb-4"><div className="flex items-center justify-between"><div className="flex items-center gap-2"><div className="rounded-lg bg-purple-50 p-2 text-purple-600 dark:bg-purple-950 dark:text-purple-400"><CreditCard className="size-5" /></div><div><CardTitle className="text-base font-bold">Payment Summary</CardTitle><CardDescription className="text-xs">Your completed rent transactions</CardDescription></div></div><Badge variant="outline" className="border-none bg-muted/60 text-xs font-normal">{paymentsList.length} Total</Badge></div></CardHeader>
            <CardContent className="space-y-5"><div className="space-y-3 rounded-xl bg-slate-50/70 p-4 dark:bg-muted/30"><div className="flex items-center justify-between"><span className="text-sm font-semibold">Payment Completion</span><span className="text-sm font-bold">{paymentCompletion}%</span></div><Progress value={paymentCompletion} className="h-2 bg-amber-100 dark:bg-amber-950/50" indicatorClassName="bg-emerald-500" /><div className="grid grid-cols-2 gap-4 pt-1"><div><p className="text-xs text-muted-foreground">Total Paid</p><p className="mt-1 text-lg font-bold text-emerald-600">{formatCurrency(stats.totalPaymentAmount)}</p></div><div><p className="text-xs text-muted-foreground">Transactions</p><p className="mt-1 text-lg font-bold text-foreground">{stats.totalPaymentsCount}</p></div></div></div><div className="flex items-center justify-between rounded-lg bg-blue-50/60 p-3 dark:bg-blue-950/20"><div className="flex items-center gap-2.5"><History className="size-4 text-blue-600" /><span className="text-sm font-medium">Payment records</span></div><Link href="/dashboard/tenant/payments" className="text-xs font-semibold text-blue-600 hover:underline">View history</Link></div></CardContent>
          </Card>
        </div>
      </DashboardSection>

      <DashboardSection title="Rental Activity" subtitle="Search and manage your requests and payment records">
      <Tabs
        value={activeTab}
        onValueChange={(val) => setActiveTab(val as TenantDashboardTab)}
        className="flex flex-col gap-0 overflow-hidden rounded-xl border-none bg-white text-card-foreground shadow-sm dark:bg-card"
      >

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


        <TabsContent value="requests" className="mt-0 p-0">
          <RentalRequestsTable
            requests={filteredRequests}
            onOpenPayModal={(req) => setPayModalItem(req)}
            onOpenReviewModal={(req) => setReviewModalItem(req)}
          />
        </TabsContent>


        <TabsContent value="payments" className="mt-0 p-0">
          <PaymentHistoryTable payments={filteredPayments} />
        </TabsContent>
      </Tabs>
      </DashboardSection>

      <DashboardSection title="Quick Actions" subtitle="Frequently used tenant shortcuts">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map(({ title, description, href, icon: Icon, iconBg, iconColor }) => <Link key={title} href={href} className="group block"><Card className="h-full rounded-xl border-none bg-white shadow-sm transition-all duration-200 hover:shadow-md dark:bg-card"><CardContent className="flex h-full flex-col justify-between gap-4 p-5"><div className="flex items-center justify-between"><div className={cn("flex size-11 items-center justify-center rounded-xl transition-all duration-200", iconBg, iconColor)}><Icon className="size-5" /></div><div className="flex size-8 items-center justify-center rounded-full bg-muted/60 text-muted-foreground transition-all duration-200 group-hover:bg-primary group-hover:text-primary-foreground"><ArrowUpRight className="size-4" /></div></div><div><h3 className="text-base font-bold text-foreground transition-colors group-hover:text-primary">{title}</h3><p className="mt-1 line-clamp-1 text-xs text-muted-foreground">{description}</p></div></CardContent></Card></Link>)}
        </div>
      </DashboardSection>


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
