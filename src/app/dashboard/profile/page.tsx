import { redirect } from "next/navigation";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Mail,
  Phone,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { getCurrentUser } from "@/app/features/api/auth.api";
import type { IUser } from "@/app/features/auth/types";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProfileLogoutButton } from "./_components/ProfileLogoutButton";

const formatDate = (value?: string) => {
  if (!value) return "Not available";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not available";
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
};

const roleStyles: Record<IUser["role"], string> = {
  ADMIN: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
  LANDLORD: "bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300",
  TENANT: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
};

function ProfileField({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof UserRound;
  label: string;
  value: string;
}) {
  return (
    <div className="group flex items-start gap-4 rounded-xl border border-slate-100 bg-slate-50/70 p-4 transition-colors hover:border-emerald-200 hover:bg-emerald-50/40 dark:border-border/60 dark:bg-muted/25 dark:hover:border-emerald-900 dark:hover:bg-emerald-950/10">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-emerald-100 bg-white text-emerald-600 shadow-xs transition-transform group-hover:scale-105 dark:border-emerald-900/60 dark:bg-background">
        <Icon className="size-[18px]" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="mt-1 break-words text-sm font-bold text-foreground">{value}</p>
      </div>
    </div>
  );
}

export default async function ProfilePage() {
  const response = await getCurrentUser();

  if (response.status === 401) redirect("/login");

  const responseBody = response.data as
    | { data?: IUser; user?: IUser }
    | IUser
    | null;
  const user = responseBody && "data" in responseBody
    ? responseBody.data
    : responseBody && "user" in responseBody
      ? responseBody.user
      : responseBody as IUser | null;

  if (!response.ok || !user) {
    return (
      <div className="w-full py-10">
        <Card className="rounded-xl border-none bg-white shadow-sm dark:bg-card">
          <CardContent className="p-10 text-center">
            <UserRound className="mx-auto size-10 text-muted-foreground" />
            <h1 className="mt-4 text-xl font-bold">Profile unavailable</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              We could not load your account details. Please try again later.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8 pb-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">My Profile</h1>
          <p className="mt-1 text-sm text-muted-foreground">Your personal details, role, and RentNest membership information.</p>
        </div>
        <ProfileLogoutButton />
      </div>

      <Card className="relative overflow-hidden rounded-2xl border-none bg-slate-950 text-white shadow-lg dark:bg-slate-900">
        <div className="absolute -right-20 -top-28 size-80 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute -bottom-32 left-1/3 size-72 rounded-full bg-teal-500/10 blur-3xl" />
        <CardContent className="relative flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
            <div className="flex size-24 shrink-0 items-center justify-center rounded-3xl border border-white/15 bg-gradient-to-br from-emerald-400 to-teal-600 text-4xl font-black text-white shadow-xl shadow-emerald-950/40 ring-4 ring-white/5">
              {user.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-2xl font-black tracking-tight sm:text-3xl">{user.name}</h2>
                <Badge className={`border-none text-[11px] ${roleStyles[user.role]}`}><ShieldCheck className="mr-1 size-3" />{user.role}</Badge>
              </div>
              <p className="mt-2 flex items-center gap-2 text-sm text-slate-300"><Mail className="size-4 text-emerald-400" />{user.email}</p>
              <p className="mt-1.5 flex items-center gap-2 text-sm text-slate-300"><Phone className="size-4 text-emerald-400" />{user.phone || "Phone number not provided"}</p>
            </div>
          </div>

          <div className="grid w-full grid-cols-2 gap-3 sm:w-auto sm:min-w-[360px]">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"><p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Account status</p><p className="mt-2 flex items-center gap-2 text-sm font-bold"><CheckCircle2 className="size-4 text-emerald-400" />{user.status}</p></div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"><p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Member since</p><p className="mt-2 flex items-center gap-2 text-sm font-bold"><CalendarDays className="size-4 text-emerald-400" />{formatDate(user.createdAt)}</p></div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.35fr_0.65fr]">
          <Card className="rounded-2xl border-none bg-white shadow-sm dark:bg-card">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Personal Information</CardTitle>
              <CardDescription className="text-sm">Details associated with your authenticated account.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <ProfileField icon={UserRound} label="Full name" value={user.name || "Not available"} />
              <ProfileField icon={Mail} label="Email address" value={user.email || "Not available"} />
              <ProfileField icon={Phone} label="Phone number" value={user.phone || "Not available"} />
              <ProfileField icon={ShieldCheck} label="Account role" value={user.role} />
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-none bg-white shadow-sm dark:bg-card">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Account Information</CardTitle>
              <CardDescription className="text-sm">Status and membership timeline.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4">
              <ProfileField icon={user.status === "ACTIVE" ? CheckCircle2 : Clock3} label="Account status" value={user.status || "Not available"} />
              <ProfileField icon={CalendarDays} label="Member since" value={formatDate(user.createdAt)} />
              <ProfileField icon={Clock3} label="Last updated" value={formatDate(user.updatedAt)} />
            </CardContent>
          </Card>
      </div>
    </div>
  );
}
