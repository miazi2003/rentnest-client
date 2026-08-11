import { getCurrentUser } from "@/app/features/api/auth.api";
import { redirect } from "next/navigation";

const dashboardByRole = {
  ADMIN: "/dashboard/admin",
  LANDLORD: "/dashboard/landlord",
  TENANT: "/dashboard/tenant",
} as const;

export default async function DashboardPage() {
  const result = await getCurrentUser();
  const user = result?.data?.data || result?.data;
  const role = user?.role as keyof typeof dashboardByRole | undefined;

  if (!result.ok || !role || !dashboardByRole[role]) {
    redirect("/login");
  }

  redirect(dashboardByRole[role]);
}
