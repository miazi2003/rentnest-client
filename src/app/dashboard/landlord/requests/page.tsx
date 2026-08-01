import { getIncomingRequestsAction } from "@/app/features/landlord/actions/getIncomingRequestsAction";
import { RequestListTable } from "../_components/RequestListTable";

export default async function LandlordRequestsPage() {
  const requestList = (await getIncomingRequestsAction()) || [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
              Rental Requests
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              {requestList.length} Total
            </span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Manage and respond to tenant applications for your listed properties.
          </p>
        </div>
      </div>

      {/* Requests Table */}
      <RequestListTable requests={requestList} />
    </div>
  );
}
