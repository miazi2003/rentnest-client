import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  CheckCheck,
  CheckCircle2,
  ClipboardList,
  Clock,
  FileText,
  HousePlus,
  LayoutDashboard,
  PlayCircle,
  XCircle,
} from "lucide-react";
import { StatsCard, type StatsCardProps } from "@/components/StatsCard";
import { DashboardSection } from "@/components/DashboardSection";
import { AnalyticsCharts } from "@/components/AnalyticsCharts";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { getMyProperties, getRentalRequestForLandlord } from "@/app/features/api/landlord.api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

type ApiRecord = Record<string, unknown>;

type PropertyItem = {
  id: string;
  title: string;
  address: string;
  price: number;
  availability: string;
  createdAt?: string;
};

type RentalItem = {
  id: string;
  status: string;
  paymentStatus: string;
  totalPrice: number;
  createdAt?: string;
  tenantName: string;
  propertyTitle: string;
};

type QuickAction = {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
};

const asRecord = (value: unknown): ApiRecord | null =>
  value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as ApiRecord)
    : null;

const getString = (value: unknown, fallback = ""): string =>
  typeof value === "string" ? value : fallback;

const getNumber = (value: unknown): number => {
  const numberValue = typeof value === "number" ? value : Number(value);
  return Number.isFinite(numberValue) ? numberValue : 0;
};

const extractList = (payload: unknown): unknown[] => {
  if (Array.isArray(payload)) return payload;
  const record = asRecord(payload);
  if (!record) return [];

  for (const key of ["data", "properties", "requests", "rentals", "result"]) {
    if (Array.isArray(record[key])) return record[key] as unknown[];
  }

  return record.data === payload ? [] : extractList(record.data);
};

const toProperty = (value: unknown): PropertyItem | null => {
  const property = asRecord(value);
  if (!property) return null;
  const id = getString(property.id) || getString(property._id);
  if (!id) return null;

  return {
    id,
    title: getString(property.title, "Untitled property"),
    address: getString(property.address, "Location unavailable"),
    price: getNumber(property.price ?? property.rent ?? property.rentAmount),
    availability: getString(property.availability, "UNAVAILABLE").toUpperCase(),
    createdAt: getString(property.createdAt) || undefined,
  };
};

const toRental = (value: unknown): RentalItem | null => {
  const rental = asRecord(value);
  if (!rental) return null;
  const id = getString(rental.id) || getString(rental._id);
  if (!id) return null;

  const tenant = asRecord(rental.tenant);
  const property = asRecord(rental.property);
  return {
    id,
    status: getString(rental.status, "PENDING").toUpperCase(),
    paymentStatus: getString(rental.paymentStatus).toUpperCase(),
    totalPrice: getNumber(rental.totalPrice ?? rental.price ?? rental.amount),
    createdAt: getString(rental.createdAt) || undefined,
    tenantName: getString(tenant?.name ?? rental.tenantName, "Unknown tenant"),
    propertyTitle: getString(property?.title ?? rental.propertyTitle, "Unknown property"),
  };
};

const newestFirst = <T extends { createdAt?: string }>(items: T[]) =>
  [...items].sort(
    (a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()
  );

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);

const getPercent = (part: number, total: number) =>
  total ? Math.round((part / total) * 100) : 0;

const statusClass = (status: string) => {
  const styles: Record<string, string> = {
    APPROVED: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
    ACTIVE: "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300",
    REJECTED: "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300",
    COMPLETED: "bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300",
  };
  return styles[status] ?? "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300";
};

const quickActions: QuickAction[] = [
  { title: "Add Property", description: "Create a new rental listing", href: "/dashboard/landlord/properties/new", icon: HousePlus, iconBg: "bg-purple-50 group-hover:bg-purple-100 dark:bg-purple-950/60", iconColor: "text-purple-600 dark:text-purple-400" },
  { title: "Rental Requests", description: "Review tenant applications", href: "/dashboard/landlord/requests", icon: ClipboardList, iconBg: "bg-amber-50 group-hover:bg-amber-100 dark:bg-amber-950/60", iconColor: "text-amber-600 dark:text-amber-400" },
  { title: "Manage Properties", description: "Edit your current listings", href: "/dashboard/landlord/properties", icon: Building2, iconBg: "bg-emerald-50 group-hover:bg-emerald-100 dark:bg-emerald-950/60", iconColor: "text-emerald-600 dark:text-emerald-400" },
  { title: "Dashboard Overview", description: "Review your business summary", href: "/dashboard/landlord", icon: LayoutDashboard, iconBg: "bg-blue-50 group-hover:bg-blue-100 dark:bg-blue-950/60", iconColor: "text-blue-600 dark:text-blue-400" },
];

function SummaryRow({ icon: Icon, label, value, tone }: { icon: LucideIcon; label: string; value: number; tone: string }) {
  return <div className={cn("flex items-center justify-between rounded-lg p-3", tone)}><div className="flex items-center gap-2.5"><Icon className="size-4" /><span className="text-sm font-medium text-foreground">{label}</span></div><span className="text-sm font-bold text-foreground">{value}</span></div>;
}

export default async function LandlordDashboardPage() {
  const [propertiesResponse, requestsResponse] = await Promise.all([
    getMyProperties(),
    getRentalRequestForLandlord(),
  ]);
  if (!propertiesResponse.ok || !requestsResponse.ok) {
    throw new Error(propertiesResponse.message || requestsResponse.message || "Unable to load landlord dashboard data");
  }

  const properties = extractList(propertiesResponse.data).map(toProperty).filter((item): item is PropertyItem => item !== null);
  const requests = extractList(requestsResponse.data).map(toRental).filter((item): item is RentalItem => item !== null);
  const countStatus = (status: string) => requests.filter((request) => request.status === status).length;

  const availableProperties = properties.filter((property) => property.availability === "AVAILABLE").length;
  const unavailableProperties = properties.length - availableProperties;
  const activeRentals = countStatus("ACTIVE");
  const totalEarnings = requests
    .filter((request) => request.paymentStatus === "PAID" || request.status === "ACTIVE" || request.status === "COMPLETED")
    .reduce((sum, request) => sum + request.totalPrice, 0);
  const totalRequests = requests.length;
  const stats: StatsCardProps[] = [
    { title: "Total Properties", value: properties.length.toLocaleString(), subtitle: "Your rental listings", icon: "properties", iconBgColor: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400" },
    { title: "Pending Requests", value: countStatus("PENDING").toLocaleString(), subtitle: "Awaiting your response", icon: "rentals", iconBgColor: "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400" },
    { title: "Active Rentals", value: activeRentals.toLocaleString(), subtitle: "Currently occupied", icon: "rentals", iconBgColor: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400" },
    { title: "Total Earnings", value: formatCurrency(totalEarnings), subtitle: "From paid rental requests", icon: "payments", iconBgColor: "bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400" },
  ];

  return (
    <div className="w-full space-y-8 pb-8">
      <div className="flex flex-col justify-between gap-4 pb-2 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">Welcome Back, Landlord</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage your properties, rental requests, and earnings.</p>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle variant="ghost" />
          <Link href="/dashboard/landlord/properties/new"><Button size="sm" className="h-9 gap-2 bg-emerald-600 text-xs font-medium hover:bg-emerald-700"><HousePlus className="size-3.5" />Add Property</Button></Link>
        </div>
      </div>

      <DashboardSection>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => <StatsCard key={stat.title} {...stat} />)}
        </div>
      </DashboardSection>

      <DashboardSection>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card className="rounded-[1.5rem] border-0 bg-white shadow-sm dark:border dark:border-white/15 dark:bg-transparent dark:shadow-none">
            <CardHeader className="pb-4"><div className="flex items-center justify-between"><div className="flex items-center gap-2"><div className="rounded-lg bg-emerald-50 p-2 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400"><Building2 className="size-5" /></div><div><CardTitle className="text-base font-bold">Property Summary</CardTitle><CardDescription className="text-xs">Availability across your listings</CardDescription></div></div><Badge variant="outline" className="border-none bg-muted/60 text-xs font-normal">{properties.length} Total</Badge></div></CardHeader>
            <CardContent className="space-y-5"><div className="space-y-3 rounded-xl bg-slate-50/70 p-4 dark:bg-muted/30"><div className="flex items-center justify-between"><span className="text-sm font-semibold">Property Availability</span><span className="text-sm font-bold">{properties.length}</span></div><Progress value={getPercent(availableProperties, properties.length)} className="h-2 bg-amber-100 dark:bg-amber-950/50" indicatorClassName="bg-emerald-500" /><div className="grid grid-cols-2 gap-4 pt-1"><div className="flex items-center justify-between text-xs"><span className="flex items-center gap-1.5 text-muted-foreground"><span className="size-2 rounded-full bg-emerald-500" />Available</span><span className="font-semibold text-emerald-600">{availableProperties} ({getPercent(availableProperties, properties.length)}%)</span></div><div className="flex items-center justify-between text-xs"><span className="flex items-center gap-1.5 text-muted-foreground"><span className="size-2 rounded-full bg-amber-500" />Unavailable</span><span className="font-semibold text-amber-600">{unavailableProperties} ({getPercent(unavailableProperties, properties.length)}%)</span></div></div></div></CardContent>
          </Card>

          <Card className="rounded-[1.5rem] border-0 bg-white shadow-sm dark:border dark:border-white/15 dark:bg-transparent dark:shadow-none">
            <CardHeader className="pb-4"><div className="flex items-center justify-between"><div className="flex items-center gap-2"><div className="rounded-lg bg-purple-50 p-2 text-purple-600 dark:bg-purple-950 dark:text-purple-400"><FileText className="size-5" /></div><div><CardTitle className="text-base font-bold">Rental Summary</CardTitle><CardDescription className="text-xs">Rental request status and lifecycle</CardDescription></div></div><Badge variant="outline" className="border-none bg-muted/60 text-xs font-normal">{totalRequests} Total</Badge></div></CardHeader>
            <CardContent className="space-y-3"><SummaryRow icon={Clock} label="Pending Requests" value={countStatus("PENDING")} tone="bg-amber-50/60 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400" /><SummaryRow icon={CheckCircle2} label="Approved" value={countStatus("APPROVED")} tone="bg-emerald-50/60 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400" /><SummaryRow icon={XCircle} label="Rejected" value={countStatus("REJECTED")} tone="bg-rose-50/60 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400" /><SummaryRow icon={PlayCircle} label="Active Rentals" value={activeRentals} tone="bg-blue-50/60 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400" /><SummaryRow icon={CheckCheck} label="Completed Rentals" value={countStatus("COMPLETED")} tone="bg-purple-50/60 text-purple-600 dark:bg-purple-950/20 dark:text-purple-400" /></CardContent>
          </Card>
        </div>
      </DashboardSection>

      {/* Analytics Charts Section */}
      <DashboardSection>
        <AnalyticsCharts
          title="Landlord Revenue & Rental Performance"
          subtitle="Real-time listing analytics and application stats"
          rentalStatusData={[
            { status: "Approved", count: countStatus("APPROVED"), color: "bg-emerald-500 text-emerald-500" },
            { status: "Active", count: activeRentals, color: "bg-blue-500 text-blue-500" },
            { status: "Completed", count: countStatus("COMPLETED"), color: "bg-purple-500 text-purple-500" },
            { status: "Pending", count: countStatus("PENDING"), color: "bg-amber-500 text-amber-500" },
            { status: "Rejected", count: countStatus("REJECTED"), color: "bg-rose-500 text-rose-500" },
          ]}
        />
      </DashboardSection>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card className="overflow-hidden rounded-[1.5rem] border-0 bg-white shadow-sm dark:border dark:border-white/15 dark:bg-transparent dark:shadow-none"><CardHeader className="flex-row items-center justify-between space-y-0"><div><CardTitle className="text-base font-bold">Recent Rental Requests</CardTitle><CardDescription className="text-xs">The latest tenant applications</CardDescription></div><Link href="/dashboard/landlord/requests"><Button variant="ghost" size="sm" className="h-8 gap-1 text-xs font-medium">View All <ArrowRight className="size-3.5" /></Button></Link></CardHeader><CardContent className="px-0 pb-0"><Table><TableHeader><TableRow><TableHead>Tenant</TableHead><TableHead>Property</TableHead><TableHead className="text-right">Status</TableHead></TableRow></TableHeader><TableBody>{newestFirst(requests).slice(0, 5).map((request) => <TableRow key={request.id}><TableCell className="font-medium">{request.tenantName}</TableCell><TableCell className="max-w-44 truncate text-muted-foreground">{request.propertyTitle}</TableCell><TableCell className="text-right"><Badge className={cn("border-none text-[11px]", statusClass(request.status))}>{request.status}</Badge></TableCell></TableRow>)}{!requests.length && <TableRow><TableCell colSpan={3} className="h-24 text-center text-sm text-muted-foreground">No rental requests yet.</TableCell></TableRow>}</TableBody></Table></CardContent></Card>

        <Card className="overflow-hidden rounded-[1.5rem] border-0 bg-white shadow-sm dark:border dark:border-white/15 dark:bg-transparent dark:shadow-none"><CardHeader className="flex-row items-center justify-between space-y-0"><div><CardTitle className="text-base font-bold">Recently Added Properties</CardTitle><CardDescription className="text-xs">Your newest rental listings</CardDescription></div><Link href="/dashboard/landlord/properties"><Button variant="ghost" size="sm" className="h-8 gap-1 text-xs font-medium">Manage <ArrowRight className="size-3.5" /></Button></Link></CardHeader><CardContent className="px-0 pb-0"><Table><TableHeader><TableRow><TableHead>Property</TableHead><TableHead>Location</TableHead><TableHead>Price</TableHead><TableHead className="text-right">Availability</TableHead></TableRow></TableHeader><TableBody>{newestFirst(properties).slice(0, 5).map((property) => <TableRow key={property.id}><TableCell className="max-w-36 truncate font-medium">{property.title}</TableCell><TableCell className="max-w-32 truncate text-muted-foreground">{property.address}</TableCell><TableCell>{formatCurrency(property.price)}</TableCell><TableCell className="text-right"><Badge className={cn("border-none text-[11px]", property.availability === "AVAILABLE" ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300" : "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300")}>{property.availability === "AVAILABLE" ? "Available" : "Unavailable"}</Badge></TableCell></TableRow>)}{!properties.length && <TableRow><TableCell colSpan={4} className="h-24 text-center text-sm text-muted-foreground">No properties yet.</TableCell></TableRow>}</TableBody></Table></CardContent></Card>
      </div>

      <DashboardSection title="Quick Actions" subtitle="Frequently used landlord shortcuts">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map(({ title, description, href, icon: Icon, iconBg, iconColor }) => (
            <Link key={title} href={href} className="group block">
              <Card className="h-full rounded-[1.5rem] border-0 bg-white shadow-sm dark:border dark:border-white/15 dark:bg-transparent dark:shadow-none transition-all duration-200">
                <CardContent className="flex h-full flex-col justify-between gap-4 p-5">
                  <div className="flex items-center justify-between">
                    <div className={cn("flex size-11 items-center justify-center rounded-xl transition-all duration-200", iconBg, iconColor)}>
                      <Icon className="size-5" />
                    </div>
                    <div className="flex size-8 items-center justify-center rounded-full bg-muted/60 text-muted-foreground transition-all duration-200 group-hover:bg-primary group-hover:text-primary-foreground">
                      <ArrowUpRight className="size-4" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-950 dark:text-white transition-colors group-hover:text-primary">{title}</h3>
                    <p className="mt-1 line-clamp-1 text-xs text-slate-500 dark:text-slate-400">{description}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </DashboardSection>
    </div>
  );
}
