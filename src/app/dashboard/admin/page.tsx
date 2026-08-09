import * as React from "react";
import { getUsersAction } from "@/app/features/admin/actions/userActions";
import PropertyAction from "@/app/features/admin/actions/propertyActions";
import rentalActions from "@/app/features/admin/actions/rentalActions";
import { getCategoriesAction } from "@/app/features/category/actions/categoryActions";

import { StatsCard, StatsCardProps } from "@/components/StatsCard";
import { PlatformSummary, PlatformSummaryData, RentalSummaryData } from "@/components/PlatformSummary";
import { PendingRequestsTable } from "@/components/PendingRequestsTable";
import { RecentUsersTable, UserItem } from "@/components/RecentUsersTable";
import { QuickActions } from "@/components/QuickActions";
import { DashboardSection } from "@/components/DashboardSection";
import { AnalyticsCharts } from "@/components/AnalyticsCharts";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { AdminRefreshButton } from "./_components/AdminRefreshButton";

interface AdminRecord {
  id?: string;
  _id?: string;
  name?: string;
  email?: string;
  role?: string;
  status?: string;
  createdAt?: string;
  startDate?: string;
  paymentStatus?: string;
  totalPrice?: number | string;
  price?: number | string;
  propertyTitle?: string;
  propertyAddress?: string;
  tenantName?: string;
  tenantEmail?: string;
  property?: { title?: string; name?: string };
  tenant?: { name?: string; email?: string };
  user?: { name?: string; email?: string };
  category?: { id?: string; name?: string };
  categoryId?: string;
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === "object" ? value as Record<string, unknown> : null;
}

function extractArray(response: unknown, keys: string[] = []): AdminRecord[] {
  if (!response) return [];
  if (Array.isArray(response)) return response as AdminRecord[];
  const record = asRecord(response);
  if (record) {
    if (Array.isArray(record.data)) return record.data as AdminRecord[];
    const d = asRecord(record.data);
    if (d) {
      if (Array.isArray(d.data)) return d.data as AdminRecord[];
      if (Array.isArray(d.result)) return d.result as AdminRecord[];
      if (Array.isArray(d.rentals)) return d.rentals as AdminRecord[];
      if (Array.isArray(d.requests)) return d.requests as AdminRecord[];
      if (Array.isArray(d.payload)) return d.payload as AdminRecord[];
      for (const k of keys) {
        if (Array.isArray(d[k])) return d[k] as AdminRecord[];
      }
    }
    if (Array.isArray(record.rentals)) return record.rentals as AdminRecord[];
    if (Array.isArray(record.requests)) return record.requests as AdminRecord[];
    if (Array.isArray(record.result)) return record.result as AdminRecord[];
    for (const k of keys) {
      if (Array.isArray(record[k])) return record[k] as AdminRecord[];
    }
  }
  return [];
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return "N/A";
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }).format(date);
  } catch {
    return dateStr;
  }
}

export default async function AdminDashboardPage() {
  const [usersRes, propertiesRes, adminRentalsRes, categoriesRes] = await Promise.all([
    getUsersAction().catch(() => null),
    PropertyAction().catch(() => null),
    rentalActions().catch(() => null),
    getCategoriesAction().catch(() => null),
  ]);

  const failedResponse = [usersRes, propertiesRes, adminRentalsRes, categoriesRes]
    .find((response) => !response?.ok);
  if (failedResponse) {
    throw new Error(failedResponse.message || "Unable to load admin dashboard data");
  }

  const rawUsers = extractArray(usersRes, ["users"]);
  const rawProperties = extractArray(propertiesRes, ["properties"]);

  const adminRentals = extractArray(adminRentalsRes, ["rentals", "requests"]);
  const rawRentals = adminRentals;
  const rawCategories = extractArray(categoriesRes, ["categories"]);

  const hasUsersData = rawUsers.length > 0;
  const totalUsersCount = rawUsers.length;
  const activeUsersCount = hasUsersData
    ? rawUsers.filter((u) => (u.status || "ACTIVE").toUpperCase() === "ACTIVE").length
    : 0;
  const blockedUsersCount = hasUsersData
    ? rawUsers.filter((u) => (u.status || "").toUpperCase() === "BANNED").length
    : 0;

  const hasPropertiesData = rawProperties.length > 0;
  const totalPropertiesCount = rawProperties.length;
  const availablePropertiesCount = hasPropertiesData
    ? rawProperties.filter((p) => (p.status || "AVAILABLE").toUpperCase() === "AVAILABLE").length
    : 0;
  const unavailablePropertiesCount = hasPropertiesData
    ? rawProperties.filter((p) => (p.status || "").toUpperCase() !== "AVAILABLE").length
    : 0;

  const hasRentalsData = rawRentals.length > 0;
  const totalRentalsCount = rawRentals.length;
  const pendingRentalsCount = hasRentalsData
    ? rawRentals.filter((r) => (r.status || "PENDING").toUpperCase() === "PENDING").length
    : 0;
  const approvedRentalsCount = hasRentalsData
    ? rawRentals.filter((r) => (r.status || "").toUpperCase() === "APPROVED").length
    : 0;
  const rejectedRentalsCount = hasRentalsData
    ? rawRentals.filter((r) => (r.status || "").toUpperCase() === "REJECTED").length
    : 0;
  const activeRentalsCount = hasRentalsData
    ? rawRentals.filter((r) => (r.status || "").toUpperCase() === "ACTIVE").length
    : 0;
  const completedRentalsCount = hasRentalsData
    ? rawRentals.filter((r) => (r.status || "").toUpperCase() === "COMPLETED").length
    : 0;

  const totalPaymentsAmount = hasRentalsData
    ? rawRentals
        .filter((r) => r.paymentStatus === "PAID" || r.status === "COMPLETED" || r.status === "APPROVED")
        .reduce((sum, r) => sum + Number(r.totalPrice || r.price || 0), 0)
    : 0;

  const totalCategoriesCount = rawCategories.length;
  const categoryColors = ["bg-emerald-500", "bg-purple-500", "bg-blue-500", "bg-amber-500"];
  const categoryChartData = rawCategories
    .map((category, index) => {
      const categoryId = category.id || category._id;
      const categoryName = category.name || "Unnamed category";
      const count = rawProperties.filter((property) =>
        (categoryId && (property.categoryId === categoryId || property.category?.id === categoryId)) ||
        property.category?.name === categoryName
      ).length;
      return { name: categoryName, count, color: categoryColors[index % categoryColors.length] };
    })
    .filter((category) => category.count > 0);

  const statsData: StatsCardProps[] = [
    {
      title: "Total Users",
      value: totalUsersCount.toLocaleString(),
      subtitle: "Updated live from API",
      icon: "users",
      iconBgColor: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400",
    },
    {
      title: "Total Properties",
      value: totalPropertiesCount.toLocaleString(),
      subtitle: "Updated live from API",
      icon: "properties",
      iconBgColor: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400",
    },
    {
      title: "Rental Requests",
      value: totalRentalsCount.toLocaleString(),
      subtitle: "Updated live from API",
      icon: "rentals",
      iconBgColor: "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400",
    },
    {
      title: "Total Payments",
      value: `$${totalPaymentsAmount.toLocaleString()}`,
      subtitle: "Calculated from rentals",
      icon: "payments",
      iconBgColor: "bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400",
    },
    {
      title: "Total Reviews",
      value: "—",
      subtitle: "Data unavailable",
      icon: "reviews",
      iconBgColor: "bg-yellow-50 text-yellow-600 dark:bg-yellow-950 dark:text-yellow-400",
    },
    {
      title: "Categories",
      value: totalCategoriesCount.toLocaleString(),
      subtitle: "Updated live from API",
      icon: "categories",
      iconBgColor: "bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400",
    },
  ];

  const platformSummaryData: PlatformSummaryData = {
    users: {
      total: totalUsersCount,
      active: activeUsersCount,
      blocked: blockedUsersCount,
    },
    properties: {
      total: totalPropertiesCount,
      available: availablePropertiesCount,
      unavailable: unavailablePropertiesCount,
    },
  };

  const rentalSummaryData: RentalSummaryData = {
    pending: pendingRentalsCount,
    approved: approvedRentalsCount,
    rejected: rejectedRentalsCount,
    active: activeRentalsCount,
    completed: completedRentalsCount,
  };

  const recentUsersList: UserItem[] = rawUsers.slice(0, 5).map((u, idx) => {
    const rawRole = (u.role || "TENANT").toUpperCase();
    const role = rawRole === "ADMIN" ? "Admin" : rawRole === "LANDLORD" ? "Landlord" : "Tenant";
    const rawStatus = (u.status || "ACTIVE").toUpperCase();
    const status = rawStatus === "BANNED" ? "Banned" : "Active";

    return {
      id: u.id || u._id || `user-${idx}`,
      name: u.name || u.email || "Registered User",
      email: u.email || "",
      role,
      status,
      joined: formatDate(u.createdAt),
    };
  });

  return (
    <div className="space-y-8 pb-8">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            Admin Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Monitor platform activity, users, properties and rental requests.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle variant="ghost" />
          <AdminRefreshButton />
        </div>
      </div>


      <DashboardSection>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          {statsData.map((stat) => (
            <StatsCard key={stat.title} {...stat} />
          ))}
        </div>
      </DashboardSection>

      <DashboardSection>
        <PlatformSummary
          platformData={platformSummaryData}
          rentalData={rentalSummaryData}
        />
      </DashboardSection>

      {/* Recharts / Analytics Section */}
      <DashboardSection>
        <AnalyticsCharts
          title="Platform Analytics & Revenue Overview"
          subtitle="System-wide application metrics, listing category breakdowns, and rental revenue trends"
          rentalStatusData={[
            { status: "Approved", count: approvedRentalsCount, color: "bg-emerald-500 text-emerald-500" },
            { status: "Active", count: activeRentalsCount, color: "bg-blue-500 text-blue-500" },
            { status: "Completed", count: completedRentalsCount, color: "bg-purple-500 text-purple-500" },
            { status: "Pending", count: pendingRentalsCount, color: "bg-amber-500 text-amber-500" },
            { status: "Rejected", count: rejectedRentalsCount, color: "bg-rose-500 text-rose-500" },
          ]}
          categoryData={categoryChartData}
          monthlyRevenueData={[]}
        />
      </DashboardSection>


      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <PendingRequestsTable
          rentals={adminRentalsRes}
        />
        <RecentUsersTable
          users={recentUsersList}
        />
      </div>


      <DashboardSection
        title="Quick Actions"
        subtitle="Frequently used admin shortcuts and shortcuts to manage platform resources"
      >
        <QuickActions />
      </DashboardSection>
    </div>
  );
}
